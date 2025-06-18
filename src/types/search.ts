export interface Filters {
  vendor?: string;
  productType?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  tags?: string;
}

export interface Sort {
  field?: string;
  order?: "asc" | "desc";
}
