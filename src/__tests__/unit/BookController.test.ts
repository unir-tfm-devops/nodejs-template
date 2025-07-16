import { Request, Response, NextFunction } from 'express';
import { BookController } from '../../controllers/BookController';
import { BookService } from '../../services/BookService';
import { Book, CreateBookRequest, UpdateBookRequest } from '../../models/Book';
import { ValidationError } from '../../utils/validation';

// Mock the BookService
jest.mock('../../services/BookService');

describe('BookController', () => {
  let bookController: BookController;
  let mockBookService: jest.Mocked<BookService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

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
    
    // Create a new instance of BookController
    bookController = new BookController();
    
    // Get the mocked service instance
    mockBookService = (bookController as any).bookService;
    
    // Setup mock response
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    
    // Setup mock next function
    mockNext = jest.fn();
  });

  describe('getAllBooks', () => {
    it('should return all books successfully', async () => {
      const mockBooks = [mockBook];
      mockBookService.getAllBooks.mockResolvedValue(mockBooks);
      
      mockRequest = {};

      await bookController.getAllBooks(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBookService.getAllBooks).toHaveBeenCalledTimes(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockBooks,
        count: 1
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return empty array when no books exist', async () => {
      mockBookService.getAllBooks.mockResolvedValue([]);
      
      mockRequest = {};

      await bookController.getAllBooks(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBookService.getAllBooks).toHaveBeenCalledTimes(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: [],
        count: 0
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error when service throws', async () => {
      const error = new Error('Database error');
      mockBookService.getAllBooks.mockRejectedValue(error);
      
      mockRequest = {};

      await bookController.getAllBooks(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBookService.getAllBooks).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('getBookById', () => {
    it('should return a book when it exists', async () => {
      mockBookService.getBookById.mockResolvedValue(mockBook);
      
      mockRequest = {
        params: { id: '1' }
      };

      await bookController.getBookById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBookService.getBookById).toHaveBeenCalledWith('1');
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockBook
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with ValidationError when book does not exist', async () => {
      const error = new ValidationError('Book not found');
      mockBookService.getBookById.mockRejectedValue(error);
      
      mockRequest = {
        params: { id: '999' }
      };

      await bookController.getBookById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBookService.getBookById).toHaveBeenCalledWith('999');
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('createBook', () => {
    it('should create a book successfully', async () => {
      mockBookService.createBook.mockResolvedValue(mockBook);
      
      mockRequest = {
        body: mockCreateBookRequest
      };

      await bookController.createBook(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBookService.createBook).toHaveBeenCalledWith(mockCreateBookRequest);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockBook,
        message: 'Book created successfully'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with ValidationError when validation fails', async () => {
      const error = new ValidationError('Book name is required');
      mockBookService.createBook.mockRejectedValue(error);
      
      mockRequest = {
        body: { ...mockCreateBookRequest, name: '' }
      };

      await bookController.createBook(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBookService.createBook).toHaveBeenCalledWith({ ...mockCreateBookRequest, name: '' });
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should call next with error when service throws unexpected error', async () => {
      const error = new Error('Database connection failed');
      mockBookService.createBook.mockRejectedValue(error);
      
      mockRequest = {
        body: mockCreateBookRequest
      };

      await bookController.createBook(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBookService.createBook).toHaveBeenCalledWith(mockCreateBookRequest);
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('updateBook', () => {
    it('should update a book successfully', async () => {
      const updatedBook = { ...mockBook, ...mockUpdateBookRequest };
      mockBookService.updateBook.mockResolvedValue(updatedBook);
      
      mockRequest = {
        params: { id: '1' },
        body: mockUpdateBookRequest
      };

      await bookController.updateBook(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBookService.updateBook).toHaveBeenCalledWith('1', mockUpdateBookRequest);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: updatedBook,
        message: 'Book updated successfully'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with ValidationError when book does not exist', async () => {
      const error = new ValidationError('Book not found');
      mockBookService.updateBook.mockRejectedValue(error);
      
      mockRequest = {
        params: { id: '999' },
        body: mockUpdateBookRequest
      };

      await bookController.updateBook(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBookService.updateBook).toHaveBeenCalledWith('999', mockUpdateBookRequest);
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should call next with ValidationError when validation fails', async () => {
      const error = new ValidationError('Book price must be a non-negative number');
      mockBookService.updateBook.mockRejectedValue(error);
      
      mockRequest = {
        params: { id: '1' },
        body: { ...mockUpdateBookRequest, price: -10 }
      };

      await bookController.updateBook(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBookService.updateBook).toHaveBeenCalledWith('1', { ...mockUpdateBookRequest, price: -10 });
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('deleteBook', () => {
    it('should delete a book successfully', async () => {
      mockBookService.deleteBook.mockResolvedValue();
      
      mockRequest = {
        params: { id: '1' }
      };

      await bookController.deleteBook(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBookService.deleteBook).toHaveBeenCalledWith('1');
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Book deleted successfully'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with ValidationError when book does not exist', async () => {
      const error = new ValidationError('Book not found');
      mockBookService.deleteBook.mockRejectedValue(error);
      
      mockRequest = {
        params: { id: '999' }
      };

      await bookController.deleteBook(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBookService.deleteBook).toHaveBeenCalledWith('999');
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should call next with ValidationError when delete fails', async () => {
      const error = new ValidationError('Failed to delete book');
      mockBookService.deleteBook.mockRejectedValue(error);
      
      mockRequest = {
        params: { id: '1' }
      };

      await bookController.deleteBook(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBookService.deleteBook).toHaveBeenCalledWith('1');
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
}); 