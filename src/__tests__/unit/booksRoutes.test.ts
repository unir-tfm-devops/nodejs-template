import express from 'express';
import request from 'supertest';
import { booksRouter } from '../../routes/books';

jest.mock('../../controllers/BookController', () => {
  return {
    BookController: jest.fn().mockImplementation(() => ({
      getAllBooks: jest.fn((req, res) => res.json({ called: 'getAllBooks' })),
      getBookById: jest.fn((req, res) => res.json({ called: 'getBookById' })),
      createBook: jest.fn((req, res) => res.json({ called: 'createBook' })),
      updateBook: jest.fn((req, res) => res.json({ called: 'updateBook' })),
      deleteBook: jest.fn((req, res) => res.json({ called: 'deleteBook' })),
    }))
  };
});

describe('booksRouter', () => {
  let app: express.Express;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/books', booksRouter);
  });

  it('GET /api/books calls getAllBooks', async () => {
    const res = await request(app).get('/api/books');
    expect(res.body).toEqual({ called: 'getAllBooks' });
  });

  it('GET /api/books/:id calls getBookById', async () => {
    const res = await request(app).get('/api/books/123');
    expect(res.body).toEqual({ called: 'getBookById' });
  });

  it('POST /api/books calls createBook', async () => {
    const res = await request(app).post('/api/books').send({});
    expect(res.body).toEqual({ called: 'createBook' });
  });

  it('PUT /api/books/:id calls updateBook', async () => {
    const res = await request(app).put('/api/books/123').send({});
    expect(res.body).toEqual({ called: 'updateBook' });
  });

  it('DELETE /api/books/:id calls deleteBook', async () => {
    const res = await request(app).delete('/api/books/123');
    expect(res.body).toEqual({ called: 'deleteBook' });
  });
}); 