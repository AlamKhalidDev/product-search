import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Filters } from "@/types/search";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildFilters(params: {
  vendor?: string;
  productType?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  tag?: string;
}): Filters {
  const filters: Filters = {};
  if (params.vendor) filters.vendor = params.vendor;
  if (params.productType) filters.productType = params.productType;
  if (params.minPrice !== undefined) filters.minPrice = params.minPrice;
  if (params.maxPrice !== undefined) filters.maxPrice = params.maxPrice;
  if (params.status) filters.status = params.status;
  if (params.tag) filters.tags = params.tag;
  return filters;
}

export function formatPrice(
  amount: number,
  locale = "en-US",
  currency = "USD"
) {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    amount
  );
}

export function formatDate(dateString: string, locale = "en-US") {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
