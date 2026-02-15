import { Hono } from 'hono'
import { v4 as uuidv4 } from 'uuid'
import { jwt, sign } from 'hono/jwt'
import { logger } from 'hono/logger'
import { streamText } from 'hono/streaming'
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

app.use(logger())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/stream', (c) => {
  return streamText(c, async (stream) => {
    const responseText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n`

    const words = responseText.split(' ')
    for (const word of words) {
      await stream.write(word + ' ')
      await stream.sleep(50) // 50ms delay per word
    }
  })
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
