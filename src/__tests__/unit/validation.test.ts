import { ValidationError, sanitizeString } from '../../utils/validation';

describe('ValidationError', () => {
  it('should set the correct name and message', () => {
    const err = new ValidationError('Test error');
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('ValidationError');
    expect(err.message).toBe('Test error');
  });
});

describe('sanitizeString', () => {
  it('should trim whitespace from both ends', () => {
    expect(sanitizeString('  hello  ')).toBe('hello');
  });

  it('should replace multiple spaces with a single space', () => {
    expect(sanitizeString('hello    world')).toBe('hello world');
  });

  it('should handle tabs and newlines', () => {
    expect(sanitizeString('\thello\nworld  ')).toBe('hello world');
  });

  it('should return empty string if input is only whitespace', () => {
    expect(sanitizeString('    ')).toBe('');
  });

  it('should not modify already clean strings', () => {
    expect(sanitizeString('clean')).toBe('clean');
  });
}); 