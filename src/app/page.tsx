"use client";

import { useEffect, useRef } from "react";
import HeroSection from "@/components/search/HeroSection";
import ProductGrid from "@/components/search/ProductGrid";
import SortDropdown from "@/components/search/SortDropdown";
import Pagination from "@/components/search/Pagination";
import useSearch from "@/hooks/useSearch";
import FilterSidebar from "@/components/filters/FilterSidebar";

export default function HomePage() {
  const {
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
  } = useSearch();

  const totalPages = Math.ceil(results.total / filterState.pageSize);

  const mainContentRef = useRef<HTMLDivElement | null>(null);
  const prevPageRef = useRef(filterState.page);

  useEffect(() => {
    if (filterState.page !== prevPageRef.current) {
      mainContentRef.current?.scrollIntoView({ behavior: "smooth" });
      prevPageRef.current = filterState.page;
    }
  }, [filterState.page]);

  const handlePageChange = (page: number) => {
    if (page !== filterState.page) {
      setFilterState((prev) => ({ ...prev, page }));
    }
  };

  return (
    <main>
      <HeroSection
        query={filterState.query}
        onQueryChange={handleQueryChange}
        onSearchSubmit={handleSearchSubmit}
        autocompleteResults={autocompleteResults}
        showAutocomplete={showAutocomplete}
        setShowAutocomplete={setShowAutocomplete}
      />

      <main
        ref={mainContentRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80 flex-shrink-0">
            <FilterSidebar
              filterState={filterState}
              setFilterState={setFilterState}
              results={results}
              onResetFilters={resetFilters}
            />
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Search Results
                </h2>
                <p className="text-gray-600 mt-1">
                  {results.total} products found
                </p>
              </div>
              <SortDropdown
                filterState={filterState}
                setFilterState={setFilterState}
              />
            </div>

            <ProductGrid
              products={results.products}
              isLoading={isLoading}
              total={results.total}
            />

            <Pagination
              currentPage={filterState.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </main>
    </main>
  );
}
