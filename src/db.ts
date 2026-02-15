import { Database } from 'bun:sqlite';

const db = new Database('sqlite.db');

db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT,
    price REAL,
    description TEXT
  )
`);

export default db;
