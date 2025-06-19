"use client";

import { Slider } from "@/components/ui/slider";
import { FilterState } from "@/types/product";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface PriceFilterProps {
  filterState: FilterState;
  setFilterState: (
    state: FilterState | ((prev: FilterState) => FilterState)
  ) => void;
}

export default function PriceFilter({
  filterState,
  setFilterState,
}: PriceFilterProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>(
    filterState.priceRange
  );
  const [debouncedPriceRange] = useDebounce(priceRange, 1000);

  useEffect(() => {
    setPriceRange(filterState.priceRange);
  }, [filterState.priceRange]);

  useEffect(() => {
    setFilterState((prev) => ({
      ...prev,
      priceRange: debouncedPriceRange,
      page: 1,
    }));
  }, [debouncedPriceRange, setFilterState]);

  return (
    <div className="px-2">
      <Slider
        value={priceRange}
        onValueChange={(val) => setPriceRange([val[0], val[1]])}
        max={1000}
        min={0}
        step={10}
        className="mb-4"
      />
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>${priceRange[0]}</span>
        <span>${priceRange[1]}</span>
      </div>
    </div>
  );
}
