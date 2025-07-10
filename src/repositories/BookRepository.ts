import { pool } from '../config/database';
import { Book, CreateBookRequest, UpdateBookRequest } from '../models/Book';

export class BookRepository {
  async findAll(): Promise<Book[]> {
    const query = 'SELECT * FROM books';
    const result = await pool.query(query);
    return result.rows;
  }

  async findById(id: string): Promise<Book | null> {
    const query = 'SELECT * FROM books WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async create(bookData: CreateBookRequest): Promise<Book> {
    const query = `
      INSERT INTO books (name, description, price, stock)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [bookData.name, bookData.description, bookData.price, bookData.stock];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async update(id: string, bookData: UpdateBookRequest): Promise<Book | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (bookData.name !== undefined) {
      fields.push(`name = $${paramIndex}`);
      values.push(bookData.name);
      paramIndex++;
    }
    
    if (bookData.description !== undefined) {
      fields.push(`description = $${paramIndex}`);
      values.push(bookData.description);
      paramIndex++;
    }
    
    if (bookData.price !== undefined) {
      fields.push(`price = $${paramIndex}`);
      values.push(bookData.price);
      paramIndex++;
    }
    
    if (bookData.stock !== undefined) {
      fields.push(`stock = $${paramIndex}`);
      values.push(bookData.stock);
      paramIndex++;
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const query = `
      UPDATE books 
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM books WHERE id = $1';
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async exists(id: string): Promise<boolean> {
    const query = 'SELECT EXISTS(SELECT 1 FROM books WHERE id = $1)';
    const result = await pool.query(query, [id]);
    return result.rows[0].exists;
  }
} 