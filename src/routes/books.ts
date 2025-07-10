import { Router } from 'express';
import { BookController } from '../controllers/BookController';

const router = Router();
const bookController = new BookController();

// GET /api/books - Get all books (with optional filters)
router.get('/', bookController.getAllBooks);

// GET /api/books/:id - Get book by ID
router.get('/:id', bookController.getBookById);

// POST /api/books - Create a new book
router.post('/', bookController.createBook);

// PUT /api/books/:id - Update an existing book
router.put('/:id', bookController.updateBook);

// DELETE /api/books/:id - Delete a book
router.delete('/:id', bookController.deleteBook);

export const booksRouter = router; 