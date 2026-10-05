import { BadRequestException } from '@nestjs/common';

/**
 * Accepted evidence types, each with the magic bytes that must appear at the
 * start of the file. The declared Content-Type is attacker-controlled, so the
 * stored MIME type comes from the sniffed signature, not from the upload header.
 */
interface TypeSignature {
  mimeType: string;
  extensions: string[];
  /** Byte prefix, or a prefix at a fixed offset. */
  magic: Array<{ offset: number; bytes: number[] }>;
}

const SIGNATURES: TypeSignature[] = [
  { mimeType: 'image/jpeg', extensions: ['.jpg', '.jpeg'], magic: [{ offset: 0, bytes: [0xff, 0xd8, 0xff] }] },
  { mimeType: 'image/png', extensions: ['.png'], magic: [{ offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] }] },
  { mimeType: 'image/gif', extensions: ['.gif'], magic: [{ offset: 0, bytes: [0x47, 0x49, 0x46, 0x38] }] },
  { mimeType: 'image/webp', extensions: ['.webp'], magic: [{ offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] }] },
  { mimeType: 'application/pdf', extensions: ['.pdf'], magic: [{ offset: 0, bytes: [0x25, 0x50, 0x44, 0x46, 0x2d] }] },
  { mimeType: 'video/mp4', extensions: ['.mp4', '.m4v'], magic: [{ offset: 4, bytes: [0x66, 0x74, 0x79, 0x70] }] },
  { mimeType: 'audio/mpeg', extensions: ['.mp3'], magic: [{ offset: 0, bytes: [0x49, 0x44, 0x33] }] },
  { mimeType: 'audio/wav', extensions: ['.wav'], magic: [{ offset: 8, bytes: [0x57, 0x41, 0x56, 0x45] }] },
  {
    // DOCX and XLSX are ZIP containers; they share this signature.
    mimeType: 'application/zip',
    extensions: ['.zip', '.docx', '.xlsx'],
    magic: [{ offset: 0, bytes: [0x50, 0x4b, 0x03, 0x04] }],
  },
];

export interface ValidatedUpload {
  /** Sniffed MIME type, which is what gets stored. */
  mimeType: string;
  /** Filename with directory components and control characters stripped. */
  safeFileName: string;
}

export function validateUpload(
  buffer: Buffer,
  originalFileName: string,
  maxBytes: number,
): ValidatedUpload {
  if (buffer.byteLength === 0) {
    throw new BadRequestException('The uploaded file is empty.');
  }
  if (buffer.byteLength > maxBytes) {
    throw new BadRequestException(
      `File exceeds the ${Math.floor(maxBytes / 1024 / 1024)} MB limit.`,
    );
  }

  const safeFileName = sanitiseFileName(originalFileName);
  const signature = SIGNATURES.find((candidate) =>
    candidate.magic.every(({ offset, bytes }) => matchesAt(buffer, offset, bytes)),
  );

  if (!signature) {
    throw new BadRequestException(
      'Unsupported file type. Accepted: JPEG, PNG, GIF, WebP, PDF, MP4, MP3, WAV, ZIP, DOCX, XLSX.',
    );
  }

  const extension = extensionOf(safeFileName);
  if (extension && !signature.extensions.includes(extension)) {
    throw new BadRequestException(
      `The file contents are ${signature.mimeType} but the name ends in ${extension}.`,
    );
  }

  return { mimeType: signature.mimeType, safeFileName };
}

function matchesAt(buffer: Buffer, offset: number, bytes: number[]): boolean {
  if (buffer.byteLength < offset + bytes.length) {
    return false;
  }
  return bytes.every((byte, index) => buffer[offset + index] === byte);
}

/**
 * Strips directory components, control characters and leading dots. The result
 * is only ever used as a display name and as the download filename; the stored
 * path comes from a generated key.
 */
export function sanitiseFileName(fileName: string): string {
  const base = fileName.split(/[\\/]/).pop() ?? 'evidence';

  const cleaned = base
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/[<>:"|?*]/g, '_')
    .replace(/^\.+/, '')
    .trim();

  return cleaned.length > 0 ? cleaned.slice(0, 180) : 'evidence';
}

function extensionOf(fileName: string): string {
  const match = /\.[a-z0-9]{1,8}$/i.exec(fileName);
  return match ? match[0].toLowerCase() : '';
}
