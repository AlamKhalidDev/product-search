"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import type { FilterState, SearchResults } from "@/types/product";
import { Button } from "@/components/ui/button";
import FilterSection from "@/components/filters/FilterSection";
import FilterOption from "@/components/filters/FilterOption";
import PriceFilter from "@/components/filters/PriceFilter";

interface FilterSidebarProps {
  filterState: FilterState;
  setFilterState: (
    state: FilterState | ((prev: FilterState) => FilterState)
  ) => void;
  results: SearchResults;
  onResetFilters: () => void;
}

export default function FilterSidebar({
  filterState,
  setFilterState,
  results,
  onResetFilters,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    vendors: true,
    productTypes: true,
    tags: true,
    status: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleVendorChange = (vendor: string, checked: boolean) => {
    setFilterState((prev) => ({
      ...prev,
      vendors: checked
        ? [...prev.vendors, vendor]
        : prev.vendors.filter((v) => v !== vendor),
      page: 1,
    }));
  };

  const handleProductTypeChange = (productType: string, checked: boolean) => {
    setFilterState((prev) => ({
      ...prev,
      productTypes: checked
        ? [...prev.productTypes, productType]
        : prev.productTypes.filter((pt) => pt !== productType),
      page: 1,
    }));
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    setFilterState((prev) => ({
      ...prev,
      tags: checked ? [...prev.tags, tag] : prev.tags.filter((t) => t !== tag),
      page: 1,
    }));
  };

  const handleStatusChange = (status: string) => {
    setFilterState((prev) => ({
      ...prev,
      status: prev.status === status ? "" : status,
      page: 1,
    }));
  };

  const hasActiveFilters =
    filterState.vendors.length > 0 ||
    filterState.productTypes.length > 0 ||
    filterState.tags.length > 0 ||
    filterState.status !== "" ||
    filterState.priceRange[0] !== 0 ||
    filterState.priceRange[1] !== 1000;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <FilterSection
          title="Price Range"
          isExpanded={expandedSections.price}
          onToggle={() => toggleSection("price")}
        >
          <PriceFilter
            filterState={filterState}
            setFilterState={setFilterState}
          />
        </FilterSection>

        {/* Vendors */}
        {results.aggregations?.vendors?.buckets?.length > 0 && (
          <FilterSection
            title="Vendors"
            isExpanded={expandedSections.vendors}
            onToggle={() => toggleSection("vendors")}
          >
            <div className="max-h-48 overflow-y-auto space-y-2">
              {results.aggregations.vendors.buckets.map((bucket) => {
                if (!bucket.key) return null;
                return (
                  <FilterOption
                    key={bucket.key}
                    id={`vendor-${bucket.key}`}
                    label={bucket.key}
                    checked={filterState.vendors.includes(bucket.key)}
                    onChange={(checked) =>
                      handleVendorChange(bucket.key, checked)
                    }
                    count={bucket.doc_count}
                  />
                );
              })}
            </div>
          </FilterSection>
        )}

        {/* Product Types */}
        {results.aggregations?.productTypes?.buckets?.length > 0 && (
          <FilterSection
            title="Product Types"
            isExpanded={expandedSections.productTypes}
            onToggle={() => toggleSection("productTypes")}
          >
            <div className="max-h-48 overflow-y-auto space-y-2">
              {results.aggregations.productTypes.buckets.map((bucket) => {
                if (!bucket.key) return null;
                return (
                  <FilterOption
                    key={bucket.key}
                    id={`type-${bucket.key}`}
                    label={bucket.key}
                    checked={filterState.productTypes.includes(bucket.key)}
                    onChange={(checked) =>
                      handleProductTypeChange(bucket.key, checked)
                    }
                    count={bucket.doc_count}
                  />
                );
              })}
            </div>
          </FilterSection>
        )}

        {/* Tags */}
        {results.aggregations?.tags?.buckets?.length > 0 && (
          <FilterSection
            title="Tags"
            isExpanded={expandedSections.tags}
            onToggle={() => toggleSection("tags")}
          >
            <div className="max-h-48 overflow-y-auto space-y-2">
              {results.aggregations.tags.buckets
                .filter((bucket) => !/[|_]/.test(bucket.key))
                .map((bucket) => (
                  <FilterOption
                    key={bucket.key}
                    id={`tag-${bucket.key}`}
                    label={bucket.key}
                    checked={filterState.tags.includes(bucket.key)}
                    onChange={(checked) => handleTagChange(bucket.key, checked)}
                    count={bucket.doc_count}
                  />
                ))}
            </div>
          </FilterSection>
        )}

        {/* Status */}
        <FilterSection
          title="Status"
          isExpanded={expandedSections.status}
          onToggle={() => toggleSection("status")}
        >
          <div className="space-y-2">
            {["active", "draft", "archived"].map((status) => (
              <FilterOption
                key={status}
                id={`status-${status}`}
                label={status.charAt(0).toUpperCase() + status.slice(1)}
                checked={filterState.status === status}
                onChange={() => handleStatusChange(status)}
              />
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );
}
