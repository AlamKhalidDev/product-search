import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { initDatabase, insertProductsBatch } from "../lib/db";
import { createIndex, indexProducts } from "../lib/elastic";
import { Product } from "../types/product";

const CSV_PATH = path.resolve(process.cwd(), "data", "csv.csv");
const BATCH_SIZE = 1000;

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

async function processBatch(
  batch: Product[],
  totalProcessed: number
): Promise<void> {
  insertProductsBatch(batch);
  await indexProducts(batch);
  console.log(`Processed batch: ${totalProcessed} records so far`);
}

async function loadCsvData(): Promise<number> {
  if (!fs.existsSync(CSV_PATH)) {
    console.error(`CSV file not found at ${CSV_PATH}`);
    process.exit(1);
  }

  initDatabase();
  console.log("Loading data from CSV...");

  return new Promise<number>((resolve, reject) => {
    let batch: Product[] = [];
    let totalProcessed = 0;
    let rowCount = 0;

    const stream = fs.createReadStream(CSV_PATH).pipe(csv());

    stream
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

          batch.push(product);
          rowCount++;

          if (batch.length >= BATCH_SIZE) {
            stream.pause();
            const currentBatch = [...batch];
            batch = [];
            totalProcessed += currentBatch.length;
            await processBatch(currentBatch, totalProcessed);
            stream.resume();
          }
        } catch (err) {
          console.error("Error processing row:", err);
        }
      })
      .on("end", async () => {
        try {
          if (batch.length > 0) {
            totalProcessed += batch.length;
            await processBatch(batch, totalProcessed);
          }
          resolve(rowCount);
        } catch (err) {
          reject(err);
        }
      })
      .on("error", reject);
  });
}

(async () => {
  try {
    await createIndex();
    const rowCount = await loadCsvData();
    console.log(`${rowCount} records loaded successfully.`);
  } catch (err) {
    console.error("Error loading data:", err);
  }
})();
