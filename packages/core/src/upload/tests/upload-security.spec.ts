import { FileSecurityValidator } from '../validators/file-security.validator';

describe('FileSecurityValidator', () => {
  it('should block executable attachments', () => {
    expect(FileSecurityValidator.validateFileName('malware.exe')).toBe(false);
    expect(FileSecurityValidator.validateFileName('evidence.pdf')).toBe(true);
  });
});
