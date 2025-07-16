import { errorHandler } from '../../middleware/errorHandler';
import { notFoundHandler } from '../../middleware/notFoundHandler';
import { ValidationError } from '../../utils/validation';

// Mocks for Express req and res
const mockReq = {} as any;

const createMockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('errorHandler middleware', () => {
  let res: any;
  beforeEach(() => {
    res = createMockRes();
    process.env.NODE_ENV = 'test';
  });

  it('handles ValidationError with 400 status', () => {
    const err = new ValidationError('Invalid input');
    errorHandler(err, mockReq, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({ message: 'Invalid input' })
      })
    );
  });

  it('handles AppError with custom statusCode', () => {
    const err = new Error('Custom error') as any;
    err.statusCode = 403;
    errorHandler(err, mockReq, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({ message: 'Custom error' })
      })
    );
  });

  it('handles generic errors with 500 status', () => {
    const err = new Error('Something went wrong');
    errorHandler(err, mockReq, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({ message: 'Internal Server Error' })
      })
    );
  });
});

describe('notFoundHandler middleware', () => {
  it('returns 404 with correct message and code', () => {
    const res = createMockRes();
    const req = { originalUrl: '/nonexistent' } as any;
    notFoundHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Route /nonexistent not found',
        code: 'NOT_FOUND'
      }
    });
  });
}); 