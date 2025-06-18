import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { initDatabase, insertProduct } from "../lib/db";
import { createIndex, indexProducts } from "../lib/elastic";
import { Product } from "../types/product";

const CSV_PATH = path.resolve(process.cwd(), "data", "csv.csv");

interface CsvRow {
  ID: string;
  TITLE: string;
  HANDLE: string;
  DESCRIPTION_HTML: string;
  BODY_HTML: string;
  VENDOR: string;
  TAGS: string;
  FEATURED_IMAGE: string;
  PRICE_RANGE_V2: string;
  CREATED_AT: string;
  UPDATED_AT: string;
  PRODUCT_TYPE: string;
  STATUS: string;
  TOTAL_INVENTORY: string;
  SEO: string;
}

function parseJsonField<T>(field: string): T | null {
  try {
    return field ? JSON.parse(field) : null;
  } catch {
    return null;
  }
}

async function loadCsvData(): Promise<Product[]> {
  if (!fs.existsSync(CSV_PATH)) {
    console.error(`CSV file not found at ${CSV_PATH}`);
    process.exit(1);
  }

  const products: Product[] = [];
  initDatabase();
  console.log("Loading data from CSV...");

  return new Promise<Product[]>((resolve, reject) => {
    fs.createReadStream(CSV_PATH)
      .pipe(csv())
      .on("data", async (row: CsvRow) => {
        try {
          const seo = parseJsonField<{ title: string; description: string }>(
            row.SEO
          );
          const priceRange = parseJsonField<{
            min_variant_price: { amount: string };
          }>(row.PRICE_RANGE_V2);
          const featuredImage = parseJsonField<{ url: string }>(
            row.FEATURED_IMAGE
          );

          const product: Product = {
            id: row.ID,
            title: row.TITLE,
            handle: row.HANDLE,
            description: row.DESCRIPTION_HTML || row.BODY_HTML || "",
            vendor: row.VENDOR,
            tags: row.TAGS ? row.TAGS.split(",").map((tag) => tag.trim()) : [],
            image: featuredImage?.url || null,
            price: priceRange?.min_variant_price?.amount
              ? parseFloat(priceRange.min_variant_price.amount)
              : 0,
            createdAt: new Date(row.CREATED_AT).toISOString(),
            updatedAt: new Date(row.UPDATED_AT).toISOString(),
            productType: row.PRODUCT_TYPE,
            status: row.STATUS,
            totalInventory: parseInt(row.TOTAL_INVENTORY) || 0,
            seoTitle: seo?.title || "",
            seoDescription: seo?.description || "",
          };

          insertProduct(product);
          products.push(product);
        } catch (err) {
          console.error("Error processing row:", err);
        }
      })
      .on("end", () => {
        resolve(products);
      })
      .on("error", reject);
  });
}

(async () => {
  try {
    const products = await loadCsvData();
    console.log(`${products.length} loaded successfully\nIndexing products...`);
    await createIndex();
    await indexProducts(products);
    console.log(`Indexed ${products.length} products successfully.`);
  } catch (err) {
    console.error("Error loading data:", err);
  }
})();
