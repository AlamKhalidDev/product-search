export interface FilterState {
  priceRange: [number, number];
  vendors: string[];
  productTypes: string[];
  tags: string[];
  status: string;
  page: number;
}

export interface AggregationBucket {
  key: string;
  doc_count: number;
}

export interface AggregationResult {
  buckets: AggregationBucket[];
}

export interface SearchResults {
  aggregations?: {
    vendors?: AggregationResult;
    productTypes?: AggregationResult;
    tags?: AggregationResult;
  };
}
