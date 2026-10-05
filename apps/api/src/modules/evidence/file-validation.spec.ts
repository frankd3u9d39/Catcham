import { BadRequestException } from '@nestjs/common';
import { sanitiseFileName, validateUpload } from './file-validation';

const MAX = 1024 * 1024;

function withPrefix(bytes: number[], totalLength = 64): Buffer {
  const buffer = Buffer.alloc(totalLength);
  bytes.forEach((byte, index) => {
    buffer[index] = byte;
  });
  return buffer;
}

const PNG = withPrefix([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const JPEG = withPrefix([0xff, 0xd8, 0xff]);
const PDF = withPrefix([0x25, 0x50, 0x44, 0x46, 0x2d]);

describe('validateUpload', () => {
  it('accepts a PNG and reports the sniffed type', () => {
    expect(validateUpload(PNG, 'scene.png', MAX)).toEqual({
      mimeType: 'image/png',
      safeFileName: 'scene.png',
    });
  });

  it('accepts a type whose magic bytes sit at an offset', () => {
    const webp = Buffer.alloc(64);
    Buffer.from('RIFF').copy(webp, 0);
    Buffer.from('WEBP').copy(webp, 8);

    expect(validateUpload(webp, 'photo.webp', MAX).mimeType).toBe('image/webp');
  });

  it('rejects a file whose contents do not match its extension', () => {
    expect(() => validateUpload(PDF, 'invoice.png', MAX)).toThrow(
      /contents are application\/pdf but the name ends in \.png/,
    );
  });

  it('rejects an unrecognised type regardless of extension', () => {
    const script = Buffer.from('#!/bin/sh\nrm -rf /\n');

    expect(() => validateUpload(script, 'payload.png', MAX)).toThrow(/Unsupported file type/);
  });

  it('rejects an empty file', () => {
    expect(() => validateUpload(Buffer.alloc(0), 'empty.png', MAX)).toThrow(BadRequestException);
  });

  it('rejects a file over the size limit', () => {
    expect(() => validateUpload(JPEG, 'big.jpg', 8)).toThrow(/exceeds the 0 MB limit/);
  });

  it('accepts a file with no extension on the strength of its signature', () => {
    expect(validateUpload(JPEG, 'evidence', MAX).mimeType).toBe('image/jpeg');
  });

  it('treats DOCX as a ZIP container', () => {
    const zip = withPrefix([0x50, 0x4b, 0x03, 0x04]);

    expect(validateUpload(zip, 'statement.docx', MAX).mimeType).toBe('application/zip');
  });
});

describe('sanitiseFileName', () => {
  it('strips directory components', () => {
    expect(sanitiseFileName('../../etc/passwd')).toBe('passwd');
    expect(sanitiseFileName('C:\\Users\\x\\report.pdf')).toBe('report.pdf');
  });

  it('removes control characters', () => {
    expect(sanitiseFileName('rep\u0000ort\u001f.pdf')).toBe('report.pdf');
  });

  it('replaces characters that are invalid in a filename', () => {
    expect(sanitiseFileName('a<b>c:d.png')).toBe('a_b_c_d.png');
  });

  it('falls back to a default when nothing usable remains', () => {
    expect(sanitiseFileName('...')).toBe('evidence');
    expect(sanitiseFileName('   ')).toBe('evidence');
  });

  it('caps the length', () => {
    expect(sanitiseFileName(`${'a'.repeat(300)}.png`)).toHaveLength(180);
  });
});
