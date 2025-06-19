"use client";

import { Product } from "@/types/product";
import SearchBar from "./SearchBar";

interface HeroSectionProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearchSubmit: () => void;
  autocompleteResults: Product[];
  showAutocomplete: boolean;
  setShowAutocomplete: (show: boolean) => void;
}

export default function HeroSection({
  query,
  onQueryChange,
  onSearchSubmit,
  autocompleteResults,
  showAutocomplete,
  setShowAutocomplete,
}: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Find Your Perfect
            <span className="text-blue-600 block">Product</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Search through thousands of products from top brands. Use our
            advanced filters to find exactly what you need.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <SearchBar
            query={query}
            onQueryChange={onQueryChange}
            onSearchSubmit={onSearchSubmit}
            autocompleteResults={autocompleteResults}
            showAutocomplete={showAutocomplete}
            setShowAutocomplete={setShowAutocomplete}
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}
