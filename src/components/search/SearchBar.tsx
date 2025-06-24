"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import type { Product } from "@/types/product";
import Image from "next/image";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearchSubmit: () => void;
  autocompleteResults: Product[];
  showAutocomplete: boolean;
  setShowAutocomplete: (show: boolean) => void;
  className?: string;
}

export default function SearchBar({
  query,
  onQueryChange,
  onSearchSubmit,
  autocompleteResults,
  showAutocomplete,
  setShowAutocomplete,
  className = "",
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(query);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [autoCompleteSelected, setAutoCompleteSelected] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const debouncedOnQueryChange = useDebouncedCallback((value: string) => {
    onQueryChange(value);
  }, 500);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowAutocomplete(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowAutocomplete]);

  useEffect(() => {
    if (autoCompleteSelected) {
      onSearchSubmit();
      setAutoCompleteSelected(false);
    }
  }, [autoCompleteSelected, onSearchSubmit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    debouncedOnQueryChange.flush();
    onSearchSubmit();
  };

  const handleAutocompleteSelect = (product: Product) => {
    debouncedOnQueryChange.cancel();
    setInputValue(product.title);
    setShowAutocomplete(false);
    onQueryChange(product.title);
    setAutoCompleteSelected(true);
  };

  const handleClear = () => {
    debouncedOnQueryChange.cancel();
    setInputValue("");
    onQueryChange("");
    setShowAutocomplete(false);
  };
  if (!isMounted) return null;

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`relative flex items-center bg-white rounded-lg shadow-lg transition-all duration-200 ${
            isFocused ? "ring-2 ring-blue-500 shadow-xl" : "shadow-lg"
          }`}
        >
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              const newValue = e.target.value;
              setInputValue(newValue);
              setShowAutocomplete(true);
              debouncedOnQueryChange(newValue);
            }}
            onFocus={() => {
              setIsFocused(true);
              if (inputValue) setShowAutocomplete(true);
            }}
            placeholder="Search for products..."
            className="w-full pl-12 pr-12 py-4 text-lg rounded-lg border-0 focus:outline-none focus:ring-0"
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-12 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>

      {showAutocomplete && autocompleteResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border z-50 max-h-96 overflow-y-auto">
          {autocompleteResults.slice(0, 8).map((product) => (
            <button
              key={product.id}
              onClick={() => handleAutocompleteSelect(product)}
              className=" cursor-pointer w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                {product.image && (
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    width={40}
                    height={40}
                    className="object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.title}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {product.vendor} • ${product.price}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
