import { BookService } from '../../services/BookService';
import { BookRepository } from '../../repositories/BookRepository';
import { Book, CreateBookRequest, UpdateBookRequest } from '../../models/Book';
import { ValidationError } from '../../utils/validation';

// Mock the BookRepository
jest.mock('../../repositories/BookRepository');

describe('BookService', () => {
  let bookService: BookService;
  let mockBookRepository: jest.Mocked<BookRepository>;

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
    
    // Create a new instance of BookService
    bookService = new BookService();
    
    // Get the mocked repository instance
    mockBookRepository = (bookService as any).bookRepository;
  });

  describe('getAllBooks', () => {
    it('should return all books', async () => {
      const mockBooks = [mockBook];
      mockBookRepository.findAll.mockResolvedValue(mockBooks);

      const result = await bookService.getAllBooks();

      expect(mockBookRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockBooks);
    });

    it('should return empty array when no books exist', async () => {
      mockBookRepository.findAll.mockResolvedValue([]);

      const result = await bookService.getAllBooks();

      expect(mockBookRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe('getBookById', () => {
    it('should return a book when it exists', async () => {
      mockBookRepository.findById.mockResolvedValue(mockBook);

      const result = await bookService.getBookById('1');

      expect(mockBookRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockBook);
    });

    it('should throw ValidationError when book does not exist', async () => {
      mockBookRepository.findById.mockResolvedValue(null);

      await expect(bookService.getBookById('999')).rejects.toThrow(ValidationError);
      await expect(bookService.getBookById('999')).rejects.toThrow('Book not found');
      expect(mockBookRepository.findById).toHaveBeenCalledWith('999');
    });
  });

  describe('createBook', () => {
    it('should create a book with valid data', async () => {
      mockBookRepository.create.mockResolvedValue(mockBook);

      const result = await bookService.createBook(mockCreateBookRequest);

      expect(mockBookRepository.create).toHaveBeenCalledWith(mockCreateBookRequest);
      expect(result).toEqual(mockBook);
    });

    it('should throw ValidationError when name is missing', async () => {
      const invalidData = { ...mockCreateBookRequest, name: '' };

      await expect(bookService.createBook(invalidData)).rejects.toThrow(ValidationError);
      await expect(bookService.createBook(invalidData)).rejects.toThrow('Book name is required');
      expect(mockBookRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when name is only whitespace', async () => {
      const invalidData = { ...mockCreateBookRequest, name: '   ' };

      await expect(bookService.createBook(invalidData)).rejects.toThrow(ValidationError);
      await expect(bookService.createBook(invalidData)).rejects.toThrow('Book name is required');
      expect(mockBookRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when description is missing', async () => {
      const invalidData = { ...mockCreateBookRequest, description: '' };

      await expect(bookService.createBook(invalidData)).rejects.toThrow(ValidationError);
      await expect(bookService.createBook(invalidData)).rejects.toThrow('Book description is required');
      expect(mockBookRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when price is negative', async () => {
      const invalidData = { ...mockCreateBookRequest, price: -10 };

      await expect(bookService.createBook(invalidData)).rejects.toThrow(ValidationError);
      await expect(bookService.createBook(invalidData)).rejects.toThrow('Book price must be a non-negative number');
      expect(mockBookRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when stock is negative', async () => {
      const invalidData = { ...mockCreateBookRequest, stock: -5 };

      await expect(bookService.createBook(invalidData)).rejects.toThrow(ValidationError);
      await expect(bookService.createBook(invalidData)).rejects.toThrow('Book stock must be a non-negative integer');
      expect(mockBookRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when price is undefined', async () => {
      const invalidData = { name: 'Test', description: 'Test', stock: 5 } as any;

      await expect(bookService.createBook(invalidData)).rejects.toThrow(ValidationError);
      await expect(bookService.createBook(invalidData)).rejects.toThrow('Book price must be a non-negative number');
      expect(mockBookRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when stock is undefined', async () => {
      const invalidData = { name: 'Test', description: 'Test', price: 10 } as any;

      await expect(bookService.createBook(invalidData)).rejects.toThrow(ValidationError);
      await expect(bookService.createBook(invalidData)).rejects.toThrow('Book stock must be a non-negative integer');
      expect(mockBookRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('updateBook', () => {
    it('should update a book with valid data', async () => {
      const updatedBook = { ...mockBook, ...mockUpdateBookRequest };
      mockBookRepository.exists.mockResolvedValue(true);
      mockBookRepository.update.mockResolvedValue(updatedBook);

      const result = await bookService.updateBook('1', mockUpdateBookRequest);

      expect(mockBookRepository.exists).toHaveBeenCalledWith('1');
      expect(mockBookRepository.update).toHaveBeenCalledWith('1', mockUpdateBookRequest);
      expect(result).toEqual(updatedBook);
    });

    it('should throw ValidationError when book does not exist', async () => {
      mockBookRepository.exists.mockResolvedValue(false);

      await expect(bookService.updateBook('999', mockUpdateBookRequest)).rejects.toThrow(ValidationError);
      await expect(bookService.updateBook('999', mockUpdateBookRequest)).rejects.toThrow('Book not found');
      expect(mockBookRepository.exists).toHaveBeenCalledWith('999');
      expect(mockBookRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when update fails', async () => {
      mockBookRepository.exists.mockResolvedValue(true);
      mockBookRepository.update.mockResolvedValue(null);

      await expect(bookService.updateBook('1', mockUpdateBookRequest)).rejects.toThrow(ValidationError);
      await expect(bookService.updateBook('1', mockUpdateBookRequest)).rejects.toThrow('Failed to update book');
      expect(mockBookRepository.exists).toHaveBeenCalledWith('1');
      expect(mockBookRepository.update).toHaveBeenCalledWith('1', mockUpdateBookRequest);
    });

    it('should throw ValidationError when name is empty string', async () => {
      const invalidData = { name: '' };
      mockBookRepository.exists.mockResolvedValue(true);

      await expect(bookService.updateBook('1', invalidData)).rejects.toThrow(ValidationError);
      await expect(bookService.updateBook('1', invalidData)).rejects.toThrow('Book name cannot be empty');
      expect(mockBookRepository.exists).toHaveBeenCalledWith('1');
      expect(mockBookRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when description is empty string', async () => {
      const invalidData = { description: '' };
      mockBookRepository.exists.mockResolvedValue(true);

      await expect(bookService.updateBook('1', invalidData)).rejects.toThrow(ValidationError);
      await expect(bookService.updateBook('1', invalidData)).rejects.toThrow('Book description cannot be empty');
      expect(mockBookRepository.exists).toHaveBeenCalledWith('1');
      expect(mockBookRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when price is negative', async () => {
      const invalidData = { price: -10 };
      mockBookRepository.exists.mockResolvedValue(true);

      await expect(bookService.updateBook('1', invalidData)).rejects.toThrow(ValidationError);
      await expect(bookService.updateBook('1', invalidData)).rejects.toThrow('Book price must be a non-negative number');
      expect(mockBookRepository.exists).toHaveBeenCalledWith('1');
      expect(mockBookRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when stock is negative', async () => {
      const invalidData = { stock: -5 };
      mockBookRepository.exists.mockResolvedValue(true);

      await expect(bookService.updateBook('1', invalidData)).rejects.toThrow(ValidationError);
      await expect(bookService.updateBook('1', invalidData)).rejects.toThrow('Book stock must be a non-negative integer');
      expect(mockBookRepository.exists).toHaveBeenCalledWith('1');
      expect(mockBookRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteBook', () => {
    it('should delete a book when it exists', async () => {
      mockBookRepository.exists.mockResolvedValue(true);
      mockBookRepository.delete.mockResolvedValue(true);

      await bookService.deleteBook('1');

      expect(mockBookRepository.exists).toHaveBeenCalledWith('1');
      expect(mockBookRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw ValidationError when book does not exist', async () => {
      mockBookRepository.exists.mockResolvedValue(false);

      await expect(bookService.deleteBook('999')).rejects.toThrow(ValidationError);
      await expect(bookService.deleteBook('999')).rejects.toThrow('Book not found');
      expect(mockBookRepository.exists).toHaveBeenCalledWith('999');
      expect(mockBookRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when delete fails', async () => {
      mockBookRepository.exists.mockResolvedValue(true);
      mockBookRepository.delete.mockResolvedValue(false);

      await expect(bookService.deleteBook('1')).rejects.toThrow(ValidationError);
      await expect(bookService.deleteBook('1')).rejects.toThrow('Failed to delete book');
      expect(mockBookRepository.exists).toHaveBeenCalledWith('1');
      expect(mockBookRepository.delete).toHaveBeenCalledWith('1');
    });
  });
}); 