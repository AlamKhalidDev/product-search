"use client";

import { ChevronDown } from "lucide-react";
import type { FilterState } from "@/types/product";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface SortDropdownProps {
  filterState: FilterState;
  setFilterState: (
    state: FilterState | ((prev: FilterState) => FilterState)
  ) => void;
}

export default function SortDropdown({
  filterState,
  setFilterState,
}: SortDropdownProps) {
  const sortOptions = [
    { field: "relevance", order: "desc", label: "Relevance" },
    { field: "createdAt", order: "desc", label: "Newest First" },
    { field: "createdAt", order: "asc", label: "Oldest First" },
    { field: "price", order: "asc", label: "Price: Low to High" },
    { field: "price", order: "desc", label: "Price: High to Low" },
    { field: "title", order: "asc", label: "Name: A to Z" },
    { field: "title", order: "desc", label: "Name: Z to A" },
  ];

  const currentSort = sortOptions.find(
    (option) =>
      option.field === filterState.sort.field &&
      option.order === filterState.sort.order
  );

  const handleSortChange = (field: string, order: string) => {
    setFilterState((prev) => ({
      ...prev,
      sort: { field, order },
      page: 1,
    }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <span>Sort by: {currentSort?.label}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={`${option.field}-${option.order}`}
            onClick={() => handleSortChange(option.field, option.order)}
            className={
              option.field === filterState.sort.field &&
              option.order === filterState.sort.order
                ? "bg-blue-50 text-blue-600"
                : ""
            }
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
