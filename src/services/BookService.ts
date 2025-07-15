import { BookRepository } from '../repositories/BookRepository';
import { Book, CreateBookRequest, UpdateBookRequest } from '../models/Book';
import { ValidationError } from '../utils/validation';

export class BookService {
  private readonly bookRepository: BookRepository;

  constructor() {
    this.bookRepository = new BookRepository();
  }

  async getAllBooks(): Promise<Book[]> {
    return await this.bookRepository.findAll();
  }

  async getBookById(id: string): Promise<Book> {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new ValidationError('Book not found');
    }
    return book;
  }

  async createBook(bookData: CreateBookRequest): Promise<Book> {
    // Validate book data
    this.validateBookData(bookData);
    
    return await this.bookRepository.create(bookData);
  }

  async updateBook(id: string, bookData: UpdateBookRequest): Promise<Book> {
    // Check if book exists
    const exists = await this.bookRepository.exists(id);
    if (!exists) {
      throw new ValidationError('Book not found');
    }

    // Validate update data
    this.validateBookUpdate(bookData);
    
    const updatedBook = await this.bookRepository.update(id, bookData);
    if (!updatedBook) {
      throw new ValidationError('Failed to update book');
    }
    
    return updatedBook;
  }

  async deleteBook(id: string): Promise<void> {
    const exists = await this.bookRepository.exists(id);
    if (!exists) {
      throw new ValidationError('Book not found');
    }

    const deleted = await this.bookRepository.delete(id);
    if (!deleted) {
      throw new ValidationError('Failed to delete book');
    }
  }

  private validateBookData(data: CreateBookRequest): void {
    if (!data.name || data.name.trim().length < 1) {
      throw new ValidationError('Book name is required');
    }
    
    if (!data.description || data.description.trim().length < 1) {
      throw new ValidationError('Book description is required');
    }
    
    if (data.price === undefined || data.price < 0) {
      throw new ValidationError('Book price must be a non-negative number');
    }
    
    if (data.stock === undefined || data.stock < 0) {
      throw new ValidationError('Book stock must be a non-negative integer');
    }
  }

  private validateBookUpdate(data: UpdateBookRequest): void {
    if (data.name !== undefined && data.name.trim().length < 1) {
      throw new ValidationError('Book name cannot be empty');
    }
    
    if (data.description !== undefined && data.description.trim().length < 1) {
      throw new ValidationError('Book description cannot be empty');
    }
    
    if (data.price !== undefined && data.price < 0) {
      throw new ValidationError('Book price must be a non-negative number');
    }
    
    if (data.stock !== undefined && data.stock < 0) {
      throw new ValidationError('Book stock must be a non-negative integer');
    }
  }
} 