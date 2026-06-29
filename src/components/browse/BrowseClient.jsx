"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import FilterControls from "./FilterControls";
import EbookCard from "../EbookCard";
import Pagination from "./Pagination";

export default function BrowseClient({ initialData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialMount = useRef(true);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    genre: searchParams.get("genre") || "",
    availability: searchParams.get("availability") || "",
    sortBy: searchParams.get("sortBy") || "newest",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    page: searchParams.get("page") || "1",
  });

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ 
      ...prev, 
      [name]: value, 
      ...(name !== "page" && { page: "1" }) 
    }));
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });

    router.push(`/browse?${params.toString()}`, { scroll: false });
  }, [filters, router]);

  return (
    <div className="space-y-8">
      <FilterControls filters={filters} onFilterChange={handleFilterChange} />

      {!initialData?.data || initialData.data.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-base-content/10 bg-base-200/20 rounded-2xl">
          <p className="text-sm font-medium text-base-content/50">No ebooks match your query criteria.</p>
        </div>
      ) : (
        <>
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {initialData.data.map((book) => (
                <EbookCard key={book._id} book={book} />
              ))}
            </AnimatePresence>
          </motion.div>

          <Pagination
            currentPage={Number(filters.page)}
            totalPages={initialData?.totalPages || 1}
            onPageChange={(pageNumber) => handleFilterChange("page", String(pageNumber))}
          />
        </>
      )}
    </div>
  );
}