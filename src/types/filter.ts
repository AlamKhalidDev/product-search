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
