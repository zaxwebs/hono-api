# Hono Product API

A simple, fast REST API built with [Hono](https://hono.dev), featuring:
- **JWT Authentication** for secure endpoints.
- **SQLite Database** (`bun:sqlite`) for persistence.
- **CRUD Operations** for managing products.

## Installation

```sh
bun install
```

## Running the Server

```sh
bun run dev
```

The server will start at `http://localhost:3000`.

## API Endpoints

### Authentication

- **POST /auth/login**
  - Body: `{ "username": "admin", "password": "password" }`
  - Returns: `{ "token": "jwt_token_here" }`

### Products

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/products` | List all products | No |
| `GET` | `/products/:id` | Get a product by ID | No |
| `POST` | `/products` | Create a new product | **Yes** |
| `PUT` | `/products/:id` | Update a product | **Yes** |
| `DELETE` | `/products/:id` | Delete a product | **Yes** |

### Streaming

- **GET /stream**
  - Streams "Lorem ipsum" text word-by-word (simulating ChatGPT) using text streaming.

**Note:** For protected routes, include the header `Authorization: Bearer <your_token>`.

## Database

The application uses a local SQLite database file named `sqlite.db`, which is automatically created in the root directory upon the first run.
