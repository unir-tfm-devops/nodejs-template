-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_books_name ON books(name);
CREATE INDEX IF NOT EXISTS idx_books_price ON books(price);
CREATE INDEX IF NOT EXISTS idx_books_stock ON books(stock);

-- Insert some sample data
INSERT INTO books (name, description, price, stock) VALUES
  ('The Great Gatsby', 'A classic American novel by F. Scott Fitzgerald', 29.99, 15),
  ('To Kill a Mockingbird', 'Harper Lee''s masterpiece about racial injustice', 24.99, 20),
  ('1984', 'George Orwell''s dystopian masterpiece', 19.99, 12),
  ('Pride and Prejudice', 'Jane Austen''s beloved romantic novel', 22.99, 18),
  ('The Hobbit', 'J.R.R. Tolkien''s fantasy adventure', 27.99, 25)
ON CONFLICT DO NOTHING; 