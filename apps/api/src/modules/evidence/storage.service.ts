import { BadRequestException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream, type ReadStream } from 'node:fs';
import { mkdir, stat, unlink, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, normalize, resolve, sep } from 'node:path';
import { references } from '../../common/utils/reference-generator.util';
import { sha256Hex } from '../../common/utils/crypto.util';

export interface StoredObject {
  storageKey: string;
  sizeBytes: number;
  sha256Hash: string;
}

/**
 * Evidence blobs on the local filesystem.
 *
 * Objects are addressed by an opaque generated key, never by the uploader's
 * filename, and every path is re-resolved against the storage root before use so
 * a crafted key cannot escape it.
 */
@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private root!: string;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const configured = this.config.getOrThrow<string>('STORAGE_ROOT');
    this.root = isAbsolute(configured) ? normalize(configured) : resolve(process.cwd(), configured);

    await mkdir(this.root, { recursive: true });
    this.logger.log(`Evidence storage root: ${this.root}`);
  }

  async put(buffer: Buffer, originalFileName: string): Promise<StoredObject> {
    const storageKey = references.storageKey(extensionOf(originalFileName));
    const absolutePath = this.resolveKey(storageKey);

    await mkdir(dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, buffer, { flag: 'wx' });

    return {
      storageKey,
      sizeBytes: buffer.byteLength,
      sha256Hash: sha256Hex(buffer),
    };
  }

  createReadStream(storageKey: string): ReadStream {
    return createReadStream(this.resolveKey(storageKey));
  }

  async exists(storageKey: string): Promise<boolean> {
    try {
      const stats = await stat(this.resolveKey(storageKey));
      return stats.isFile();
    } catch {
      return false;
    }
  }

  async remove(storageKey: string): Promise<void> {
    try {
      await unlink(this.resolveKey(storageKey));
    } catch (error) {
      // A missing blob is not worth failing an archival operation over.
      this.logger.warn(
        `Could not remove ${storageKey}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Rejects any key that resolves outside the storage root, which is what stops
   * a `../` in a stored key from reading arbitrary files.
   */
  private resolveKey(storageKey: string): string {
    const absolutePath = resolve(join(this.root, storageKey));

    if (absolutePath !== this.root && !absolutePath.startsWith(this.root + sep)) {
      throw new BadRequestException('Invalid storage key.');
    }

    return absolutePath;
  }
}

function extensionOf(fileName: string): string {
  const match = /\.[a-z0-9]{1,8}$/i.exec(fileName.trim());
  return match ? match[0].toLowerCase() : '';
}
