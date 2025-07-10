export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ');
}; 