import db from './db';
import type { Product } from './types';

export const getProducts = (): Product[] => {
    return db.query('SELECT * FROM products').all() as Product[];
};

export const getProduct = (id: string): Product | null => {
    return db.query('SELECT * FROM products WHERE id = $id').get({ $id: id } as any) as Product | null;
};

export const createProduct = (product: Product): Product => {
    db.run(
        'INSERT INTO products (id, name, price, description) VALUES ($id, $name, $price, $description)',
        {
            $id: product.id,
            $name: product.name,
            $price: product.price,
            $description: product.description,
        } as any
    );
    return product;
};

export const updateProduct = (id: string, updatedProduct: Partial<Product>): Product | null => {
    const current = getProduct(id);
    if (!current) return null;

    const newProduct = { ...current, ...updatedProduct };
    db.run(
        'UPDATE products SET name = $name, price = $price, description = $description WHERE id = $id',
        {
            $id: id,
            $name: newProduct.name,
            $price: newProduct.price,
            $description: newProduct.description,
        } as any
    );
    return newProduct;
};

export const deleteProduct = (id: string): boolean => {
    const result = db.run('DELETE FROM products WHERE id = $id', { $id: id } as any);
    return result.changes > 0;
};
