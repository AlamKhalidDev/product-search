import { Client } from "@elastic/elasticsearch";
import { Product } from "@/types/product";

export const client = new Client({
  node: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
});
export const INDEX_NAME = "products";

export async function createIndex() {
  const exists = await client.indices.exists({ index: INDEX_NAME });
  if (exists) {
    await client.indices.delete({ index: INDEX_NAME });
  }

  await client.indices.create({
    index: INDEX_NAME,
    body: {
      mappings: {
        properties: {
          id: { type: "keyword" },
          title: {
            type: "text",
            fields: {
              keyword: { type: "keyword" },
              completion: { type: "completion" },
            },
          },
          handle: { type: "keyword" },
          description: { type: "text" },
          vendor: {
            type: "text",
            fields: {
              keyword: { type: "keyword", ignore_above: 256 },
            },
          },
          tags: { type: "keyword" },
          image: { type: "keyword" },
          price: { type: "float" },
          createdAt: { type: "date" },
          updatedAt: { type: "date" },
          productType: { type: "keyword" },
          status: { type: "keyword" },
          totalInventory: { type: "integer" },
          seoTitle: { type: "text" },
          seoDescription: { type: "text" },
        },
      },
      settings: {
        index: {
          number_of_shards: 3,
          number_of_replicas: 1,
          refresh_interval: "30s",
        },
      },
    },
  });
}

export async function indexProducts(products: Product[]) {
  const BATCH_SIZE = 1000;
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    const body = batch.flatMap((doc) => [
      { index: { _index: INDEX_NAME, _id: doc.id } },
      doc,
    ]);
    await client.bulk({ refresh: false, body });
  }
  await client.indices.refresh({ index: INDEX_NAME });
}
