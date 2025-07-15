import { Request, Response, NextFunction } from 'express';
import { BookService } from '../services/BookService';
import { CreateBookRequest, UpdateBookRequest } from '../models/Book';

export class BookController {
  private readonly bookService: BookService;

  constructor() {
    this.bookService = new BookService();
  }

  // GET /api/books
  getAllBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const books = await this.bookService.getAllBooks();
      
      res.json({
        success: true,
        data: books,
        count: books.length
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/books/:id
  getBookById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const book = await this.bookService.getBookById(id);
      
      res.json({
        success: true,
        data: book
      });
    } catch (error) {
      next(error);
    }
  };

  // POST /api/books
  createBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookData: CreateBookRequest = req.body;
      const newBook = await this.bookService.createBook(bookData);
      
      res.status(201).json({
        success: true,
        data: newBook,
        message: 'Book created successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  // PUT /api/books/:id
  updateBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const bookData: UpdateBookRequest = req.body;
      const updatedBook = await this.bookService.updateBook(id, bookData);
      
      res.json({
        success: true,
        data: updatedBook,
        message: 'Book updated successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  // DELETE /api/books/:id
  deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.bookService.deleteBook(id);
      
      res.json({
        success: true,
        message: 'Book deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
} 