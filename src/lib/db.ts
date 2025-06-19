import { Product } from "@/types/product";
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), "data", "products.db");
const db = new Database(dbPath);

export function initDatabase() {
  db.exec(`   
    DROP TABLE IF EXISTS products;
 
    CREATE TABLE products (
      id TEXT PRIMARY KEY,
      title TEXT,
      handle TEXT,
      description TEXT,
      vendor TEXT,
      tags TEXT,
      image TEXT,
      price REAL,
      createdAt TEXT,
      updatedAt TEXT,
      productType TEXT,
      status TEXT,
      totalInventory INTEGER,
      seoTitle TEXT,
      seoDescription TEXT
    );
    
    CREATE INDEX IF NOT EXISTS idx_vendor ON products (vendor);
    CREATE INDEX IF NOT EXISTS idx_price ON products (price);
    CREATE INDEX IF NOT EXISTS idx_createdAt ON products (createdAt);
    CREATE INDEX IF NOT EXISTS idx_productType ON products (productType);
  `);
}

export function insertProduct(product: Product) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO products (
      id, title, handle, description, vendor, tags, image, price, 
      createdAt, updatedAt, productType, status, totalInventory,
      seoTitle, seoDescription
    ) VALUES (
      @id, @title, @handle, @description, @vendor, @tags, @image, @price,
      @createdAt, @updatedAt, @productType, @status, @totalInventory,
      @seoTitle, @seoDescription
    )
  `);

  stmt.run({
    ...product,
    tags: JSON.stringify(product.tags),
  });
}

export function insertProductsBatch(products: Product[]) {
  const insert = db.prepare(`
    INSERT OR REPLACE INTO products (
      id, title, handle, description, vendor, tags, image, price, 
      createdAt, updatedAt, productType, status, totalInventory,
      seoTitle, seoDescription
    ) VALUES (
      @id, @title, @handle, @description, @vendor, @tags, @image, @price,
      @createdAt, @updatedAt, @productType, @status, @totalInventory,
      @seoTitle, @seoDescription
    )
  `);

  const insertMany = db.transaction((products: Product[]) => {
    for (const product of products) {
      insert.run({
        ...product,
        tags: JSON.stringify(product.tags),
      });
    }
  });

  insertMany(products);
}

export function getAllProducts(): Product[] {
  const stmt = db.prepare("SELECT * FROM products");
  return stmt.all().map((row: any) => ({
    ...row,
    tags: JSON.parse(row.tags),
  }));
}

export function closeDatabase() {
  db.close();
}
