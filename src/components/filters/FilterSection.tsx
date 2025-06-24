"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

interface FilterSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export default function FilterSection({
  title,
  isExpanded,
  onToggle,
  children,
}: FilterSectionProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-2 text-left"
        aria-expanded={isExpanded}
      >
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        {isExpanded ? (
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronUp className="w-4 h-4 text-gray-500" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ rotate: 180 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
