# Nodejs Template

A modern, production-ready Node.js API template built with Express and TypeScript.

## 🚀 Features

- **TypeScript** - Full TypeScript support with strict type checking
- **Express.js** - Fast, unopinionated web framework
- **Security** - Helmet.js for security headers, CORS support
- **Logging** - Morgan for HTTP request logging
- **Error Handling** - Centralized error handling middleware
- **Validation** - Input validation utilities
- **Testing** - Jest and Supertest for testing
- **Code Quality** - ESLint configuration for TypeScript
- **Development** - Hot reload with ts-node-dev
- **Environment** - Environment variable management with dotenv

## 📁 Project Structure

```
src/
├── index.ts              # Main application entry point
├── config/               # Configuration files
│   └── database.ts       # Database configuration
├── controllers/          # Request handlers
│   └── BookController.ts # Book API controller
├── middleware/           # Express middleware
│   ├── errorHandler.ts   # Global error handling
│   └── notFoundHandler.ts # 404 handler
├── models/               # Data models
│   └── Book.ts           # Book model and interfaces
├── repositories/         # Data access layer
│   └── BookRepository.ts # Book database operations
├── routes/               # API routes
│   ├── health.ts         # Health check endpoints
│   └── books.ts          # Book CRUD operations
├── services/             # Business logic layer
│   └── BookService.ts    # Book business logic
├── types/                # TypeScript type definitions
│   └── index.ts          # Common interfaces
├── utils/                # Utility functions
│   └── validation.ts     # Validation helpers
└── __tests__/            # Test files
    ├── health.test.ts    # Health endpoint tests
    └── books.test.ts     # Book API tests
```

## 🛠️ Installation

### Option 1: Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd nodejs-template
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
```

4. Start the development server:
```bash
npm run dev
```

### Option 2: Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd nodejs-template
```

2. Start the application with Docker Compose:
```bash
docker-compose up -d
```

3. Access the API at http://localhost:3000

## 📝 Available Scripts

### NPM Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix linting issues

### Docker Commands
- `docker-compose up -d` - Start services
- `docker-compose down` - Stop services
- `docker-compose logs -f api` - View API logs
- `docker-compose logs -f postgres` - View database logs

## 🌐 API Endpoints

### Health Check
- `GET /api/health` - Check API health status
- `GET /api/health/ready` - Check if API is ready to serve requests

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

## 📊 Example API Responses

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "The Great Gatsby",
    "description": "A classic American novel",
    "price": 29.99,
    "stock": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Book not found"
  }
}
```

## 🧪 Testing

Run tests with:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `env.example`:

```env
PORT=3000
NODE_ENV=development
```

### TypeScript Configuration

The project uses strict TypeScript configuration with:
- ES2020 target
- CommonJS modules
- Strict type checking
- Source maps for debugging
- Path mapping for clean imports

## 🚀 Deployment

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## 📚 Next Steps

- Add database integration (PostgreSQL, MongoDB, etc.)
- Implement authentication and authorization
- Add rate limiting
- Set up CI/CD pipeline
- Add API documentation with Swagger
- Implement caching strategies
- Add monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run linting and tests
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
