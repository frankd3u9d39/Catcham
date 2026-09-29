export interface IStorageRepository {
  generatePresignedUploadUrl(bucket: string, key: string, expiresInSec: number): Promise<string>;
  generatePresignedDownloadUrl(bucket: string, key: string, expiresInSec: number): Promise<string>;
  deleteObject(bucket: string, key: string): Promise<void>;
}
