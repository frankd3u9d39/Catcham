export class FileSecurityValidator {
  private static readonly BLOCKED_EXTENSIONS = ['.exe', '.bat', '.cmd', '.sh', '.msi', '.vbs'];

  static validateFileName(fileName: string): boolean {
    const ext = fileName.slice(((fileName.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
    return !this.BLOCKED_EXTENSIONS.includes('.' + ext);
  }
}
