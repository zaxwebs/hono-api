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
  - **Body:** `{ "username": "admin", "password": "password" }`
  - **Success Response (200):**
    ```json
    { "token": "ey..." }
    ```
  - **Error Response (401):**
    ```json
    { "message": "Invalid credentials" }
    ```

### Products

#### GET /products
List all products.
- **Auth Required:** No
- **Success Response (200):**
  ```json
  [
    {
      "id": "uuid",
      "name": "Product Name",
      "price": 99.99,
      "description": "Optional description"
    }
  ]
  ```

#### GET /products/:id
Get a single product by ID.
- **Auth Required:** No
- **Success Response (200):** Returns the product object.
- **Error Response (404):**
  ```json
  { "message": "Product not found" }
  ```

#### POST /products
Create a new product.
- **Auth Required:** Yes
- **Body:**
  ```json
  {
    "name": "New Product", // Required, String, Min 1 char
    "price": 29.99,        // Required, Number, Min 0
    "description": "Desc"  // Optional, String
  }
  ```
- **Success Response (201):** Returns the created product object.
- **Validation Error (400):**
  ```json
  {
    "success": false,
    "error": { ...zod_error_details }
  }
  ```

#### PUT /products/:id
Update an existing product.
- **Auth Required:** Yes
- **Body:** (All fields are optional)
  ```json
  {
    "name": "Updated Name",
    "price": 39.99
  }
  ```
- **Success Response (200):** Returns the updated product object.
- **Error Response (404):** Product not found.
- **Validation Error (400):** Invalid data types or constraints.

#### DELETE /products/:id
Delete a product.
- **Auth Required:** Yes
- **Success Response (200):**
  ```json
  { "message": "Product deleted" }
  ```
- **Error Response (404):** Product not found.

### Streaming

- **GET /stream**
  - Streams text word-by-word. Can be consumed using standard fetch with a reader.

**Note:** For protected routes, include the header `Authorization: Bearer <your_token>`.

## Database

The application uses a local SQLite database file named `sqlite.db`, which is automatically created in the root directory upon the first run.
