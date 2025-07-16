import { BookRepository } from '../../repositories/BookRepository';
import { Book, CreateBookRequest, UpdateBookRequest } from '../../models/Book';

// Mock the database pool
jest.mock('../../config/database', () => ({
  pool: {
    query: jest.fn()
  }
}));

describe('BookRepository', () => {
  let bookRepository: BookRepository;
  let mockPool: any;

  const mockBook: Book = {
    id: '1',
    name: 'Test Book',
    description: 'A test book description',
    price: 29.99,
    stock: 10
  };

  const mockCreateBookRequest: CreateBookRequest = {
    name: 'New Book',
    description: 'A new book description',
    price: 19.99,
    stock: 5
  };

  const mockUpdateBookRequest: UpdateBookRequest = {
    name: 'Updated Book',
    price: 39.99
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create a new instance of BookRepository
    bookRepository = new BookRepository();
    
    // Get the mocked pool
    const { pool } = require('../../config/database');
    mockPool = pool;
  });

  describe('findAll', () => {
    it('should return all books', async () => {
      const mockBooks = [mockBook];
      mockPool.query.mockResolvedValue({
        rows: mockBooks
      });

      const result = await bookRepository.findAll();

      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM books');
      expect(result).toEqual(mockBooks);
    });

    it('should return empty array when no books exist', async () => {
      mockPool.query.mockResolvedValue({
        rows: []
      });

      const result = await bookRepository.findAll();

      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM books');
      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      mockPool.query.mockRejectedValue(error);

      await expect(bookRepository.findAll()).rejects.toThrow('Database connection failed');
      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM books');
    });
  });

  describe('findById', () => {
    it('should return a book when it exists', async () => {
      mockPool.query.mockResolvedValue({
        rows: [mockBook]
      });

      const result = await bookRepository.findById('1');

      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM books WHERE id = $1', ['1']);
      expect(result).toEqual(mockBook);
    });

    it('should return null when book does not exist', async () => {
      mockPool.query.mockResolvedValue({
        rows: []
      });

      const result = await bookRepository.findById('999');

      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM books WHERE id = $1', ['999']);
      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      mockPool.query.mockRejectedValue(error);

      await expect(bookRepository.findById('1')).rejects.toThrow('Database connection failed');
      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM books WHERE id = $1', ['1']);
    });
  });

  describe('create', () => {
    it('should create a book successfully', async () => {
      const createdBook = { ...mockBook, ...mockCreateBookRequest };
      mockPool.query.mockResolvedValue({
        rows: [createdBook]
      });

      const result = await bookRepository.create(mockCreateBookRequest);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO books (name, description, price, stock)'),
        [mockCreateBookRequest.name, mockCreateBookRequest.description, mockCreateBookRequest.price, mockCreateBookRequest.stock]
      );
      expect(result).toEqual(createdBook);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      mockPool.query.mockRejectedValue(error);

      await expect(bookRepository.create(mockCreateBookRequest)).rejects.toThrow('Database connection failed');
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO books (name, description, price, stock)'),
        [mockCreateBookRequest.name, mockCreateBookRequest.description, mockCreateBookRequest.price, mockCreateBookRequest.stock]
      );
    });
  });

  describe('update', () => {
    it('should update a book with all fields', async () => {
      const updatedBook = { ...mockBook, ...mockUpdateBookRequest };
      mockPool.query.mockResolvedValue({
        rows: [updatedBook]
      });

      const result = await bookRepository.update('1', mockUpdateBookRequest);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringMatching(/UPDATE books\s+SET name = \$1, price = \$2/),
        [mockUpdateBookRequest.name, mockUpdateBookRequest.price, '1']
      );
      expect(result).toEqual(updatedBook);
    });

    it('should update a book with only name field', async () => {
      const updateData = { name: 'Updated Name' };
      const updatedBook = { ...mockBook, name: 'Updated Name' };
      mockPool.query.mockResolvedValue({
        rows: [updatedBook]
      });

      const result = await bookRepository.update('1', updateData);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringMatching(/UPDATE books\s+SET name = \$1/),
        ['Updated Name', '1']
      );
      expect(result).toEqual(updatedBook);
    });

    it('should update a book with only price field', async () => {
      const updateData = { price: 49.99 };
      const updatedBook = { ...mockBook, price: 49.99 };
      mockPool.query.mockResolvedValue({
        rows: [updatedBook]
      });

      const result = await bookRepository.update('1', updateData);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringMatching(/UPDATE books\s+SET price = \$1/),
        [49.99, '1']
      );
      expect(result).toEqual(updatedBook);
    });

    it('should return existing book when no fields to update', async () => {
      const updateData = {};
      mockPool.query.mockResolvedValue({
        rows: [mockBook]
      });

      const result = await bookRepository.update('1', updateData);

      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM books WHERE id = $1', ['1']);
      expect(result).toEqual(mockBook);
    });

    it('should return null when update affects no rows', async () => {
      mockPool.query.mockResolvedValue({
        rows: []
      });

      const result = await bookRepository.update('999', mockUpdateBookRequest);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringMatching(/UPDATE books\s+SET name = \$1, price = \$2/),
        [mockUpdateBookRequest.name, mockUpdateBookRequest.price, '999']
      );
      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      mockPool.query.mockRejectedValue(error);

      await expect(bookRepository.update('1', mockUpdateBookRequest)).rejects.toThrow('Database connection failed');
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringMatching(/UPDATE books\s+SET name = \$1, price = \$2/),
        [mockUpdateBookRequest.name, mockUpdateBookRequest.price, '1']
      );
    });
  });

  describe('delete', () => {
    it('should delete a book successfully', async () => {
      mockPool.query.mockResolvedValue({
        rowCount: 1
      });

      const result = await bookRepository.delete('1');

      expect(mockPool.query).toHaveBeenCalledWith('DELETE FROM books WHERE id = $1', ['1']);
      expect(result).toBe(true);
    });

    it('should return false when no book is deleted', async () => {
      mockPool.query.mockResolvedValue({
        rowCount: 0
      });

      const result = await bookRepository.delete('999');

      expect(mockPool.query).toHaveBeenCalledWith('DELETE FROM books WHERE id = $1', ['999']);
      expect(result).toBe(false);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      mockPool.query.mockRejectedValue(error);

      await expect(bookRepository.delete('1')).rejects.toThrow('Database connection failed');
      expect(mockPool.query).toHaveBeenCalledWith('DELETE FROM books WHERE id = $1', ['1']);
    });

    it('should handle undefined rowCount', async () => {
      mockPool.query.mockResolvedValue({});

      const result = await bookRepository.delete('1');

      expect(mockPool.query).toHaveBeenCalledWith('DELETE FROM books WHERE id = $1', ['1']);
      expect(result).toBe(false);
    });
  });

  describe('exists', () => {
    it('should return true when book exists', async () => {
      mockPool.query.mockResolvedValue({
        rows: [{ exists: true }]
      });

      const result = await bookRepository.exists('1');

      expect(mockPool.query).toHaveBeenCalledWith('SELECT EXISTS(SELECT 1 FROM books WHERE id = $1)', ['1']);
      expect(result).toBe(true);
    });

    it('should return false when book does not exist', async () => {
      mockPool.query.mockResolvedValue({
        rows: [{ exists: false }]
      });

      const result = await bookRepository.exists('999');

      expect(mockPool.query).toHaveBeenCalledWith('SELECT EXISTS(SELECT 1 FROM books WHERE id = $1)', ['999']);
      expect(result).toBe(false);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      mockPool.query.mockRejectedValue(error);

      await expect(bookRepository.exists('1')).rejects.toThrow('Database connection failed');
      expect(mockPool.query).toHaveBeenCalledWith('SELECT EXISTS(SELECT 1 FROM books WHERE id = $1)', ['1']);
    });
  });
}); 