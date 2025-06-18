export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  tags: string[];
  image: string | null;
  price: number;
  createdAt: string;
  updatedAt: string;
  productType: string;
  status: string;
  totalInventory: number;
  seoTitle: string;
  seoDescription: string;
  highlight?: {
    title?: string[];
    description?: string[];
  };
}

export interface SearchResults {
  products: Product[];
  total: number;
  aggregations: {
    vendors: { buckets: { key: string; doc_count: number }[] };
    productTypes: { buckets: { key: string; doc_count: number }[] };
    tags: { buckets: { key: string; doc_count: number }[] };
    priceRange: {
      buckets: { key: string; doc_count: number; from?: number; to?: number }[];
    };
  };
}

export interface FilterState {
  query: string;
  vendors: string[];
  productTypes: string[];
  priceRange: [number, number];
  tags: string[];
  status: string;
  sort: { field: string; order: string };
  page: number;
  pageSize: number;
}
