"use client";

import { Checkbox } from "@/components/ui/checkbox";

interface FilterOptionProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  count?: number;
}

export default function FilterOption({
  id,
  label,
  checked,
  onChange,
  count,
}: FilterOptionProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(checked) => onChange(checked as boolean)}
      />
      <label
        htmlFor={id}
        className="text-sm text-gray-700 flex-1 cursor-pointer"
      >
        {label} {count !== undefined && `(${count})`}
      </label>
    </div>
  );
}
