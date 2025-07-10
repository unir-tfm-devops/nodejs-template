export interface Book {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface CreateBookRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface UpdateBookRequest {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}

 