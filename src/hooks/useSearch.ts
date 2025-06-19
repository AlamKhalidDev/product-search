"use client";

import { useState, useEffect } from "react";
import type { Product, SearchResults, FilterState } from "@/types/product";
import toast from "react-hot-toast";

export default function useSearch() {
  const [filterState, setFilterState] = useState<FilterState>({
    query: "",
    vendors: [],
    productTypes: [],
    priceRange: [0, 1000],
    tags: [],
    status: "",
    sort: { field: "relevance", order: "desc" },
    page: 1,
    pageSize: 12,
  });

  const [results, setResults] = useState<SearchResults>({
    products: [],
    total: 0,
    aggregations: {
      vendors: { buckets: [] },
      productTypes: { buckets: [] },
      tags: { buckets: [] },
      priceRange: { buckets: [] },
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [autocompleteResults, setAutocompleteResults] = useState<Product[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  const buildQueryParams = () => {
    const params = new URLSearchParams();

    params.set("q", filterState.query);
    params.set("page", filterState.page.toString());
    params.set("size", filterState.pageSize.toString());
    params.set("sort", filterState.sort.field);
    params.set("order", filterState.sort.order);

    if (filterState.vendors.length > 0) {
      params.set("vendor", filterState.vendors.join(","));
    }

    if (filterState.productTypes.length > 0) {
      params.set("productType", filterState.productTypes.join(","));
    }

    if (filterState.tags.length > 0) {
      params.set("tag", filterState.tags.join(","));
    }

    if (filterState.status) {
      params.set("status", filterState.status);
    }

    if (filterState.priceRange[0] !== 0 || filterState.priceRange[1] !== 1000) {
      params.set("minPrice", filterState.priceRange[0].toString());
      params.set("maxPrice", filterState.priceRange[1].toString());
    }

    return params.toString();
  };

  const searchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?${buildQueryParams()}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setResults(data);
    } catch (error) {
      toast.error("Failed to fetch products");
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAutocomplete = async (query: string) => {
    if (!query.trim()) {
      setAutocompleteResults([]);
      return;
    }

    try {
      const res = await fetch(
        `/api/autocomplete?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setAutocompleteResults(data);
    } catch (error) {
      console.error("Autocomplete error:", error);
    }
  };

  useEffect(() => {
    searchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filterState.page,
    filterState.sort,
    filterState.vendors,
    filterState.productTypes,
    filterState.tags,
    filterState.status,
    filterState.priceRange,
  ]);

  const handleQueryChange = (query: string) => {
    setFilterState((prev) => ({ ...prev, query }));
    fetchAutocomplete(query);
  };

  const handleSearchSubmit = () => {
    setShowAutocomplete(false);
    if (filterState.page !== 1) {
      setFilterState((prev) => ({ ...prev, page: 1 }));
    } else {
      searchProducts();
    }
  };

  const resetFilters = () => {
    setFilterState({
      query: filterState.query,
      vendors: [],
      productTypes: [],
      priceRange: [0, 1000],
      tags: [],
      status: "",
      sort: { field: "relevance", order: "desc" },
      page: 1,
      pageSize: 12,
    });
  };

  return {
    filterState,
    setFilterState,
    results,
    isLoading,
    autocompleteResults,
    showAutocomplete,
    setShowAutocomplete,
    handleQueryChange,
    handleSearchSubmit,
    resetFilters,
    searchProducts,
  };
}
