import { Hono } from 'hono'
import { v4 as uuidv4 } from 'uuid'
import { jwt, sign } from 'hono/jwt'
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from './products'
import type { Product } from './types'

const app = new Hono()
const JWT_SECRET = 'it-is-a-secret'

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// Auth Route
app.post('/auth/login', async (c) => {
  const body = await c.req.json()
  if (body.username === 'admin' && body.password === 'password') {
    const payload = {
      sub: 'admin',
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) + 60 * 5, // 5 min expiration
    }
    const token = await sign(payload, JWT_SECRET)
    return c.json({ token })
  }
  return c.json({ message: 'Invalid credentials' }, 401)
})

// Product Routes

// GET /products - Public
app.get('/products', (c) => {
  const products = getProducts()
  return c.json(products)
})

// GET /products/:id - Public
app.get('/products/:id', (c) => {
  const id = c.req.param('id')
  const product = getProduct(id)
  if (!product) {
    return c.json({ message: 'Product not found' }, 404)
  }
  return c.json(product)
})

// Protected Routes Middleware
app.use('/products/*', jwt({ secret: JWT_SECRET, alg: 'HS256' }))

// POST /products - Protected
app.post('/products', async (c) => {
  const body = await c.req.json()
  const newProduct: Product = {
    id: uuidv4(),
    name: body.name,
    price: body.price,
    description: body.description,
  }
  const createdProduct = createProduct(newProduct)
  return c.json(createdProduct, 201)
})

// PUT /products/:id - Protected
app.put('/products/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const updatedProduct = updateProduct(id, body)
  if (!updatedProduct) {
    return c.json({ message: 'Product not found' }, 404)
  }
  return c.json(updatedProduct)
})

// DELETE /products/:id - Protected
app.delete('/products/:id', (c) => {
  const id = c.req.param('id')
  const deleted = deleteProduct(id)
  if (!deleted) {
    return c.json({ message: 'Product not found' }, 404)
  }
  return c.json({ message: 'Product deleted' })
})

export default app
