"use client";

import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-10 h-10 text-xs font-black rounded-xl transition-all ${
            currentPage === i
              ? "bg-[#00a851] text-white shadow-md shadow-[#00a851]/20"
              : "bg-base-200/60 hover:bg-base-200 border border-base-content/5 text-base-content/80"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-base-200/60 hover:bg-base-200 border border-base-content/5 disabled:opacity-40 disabled:cursor-not-allowed text-base-content transition-all"
        aria-label="Previous Page"
      >
        <FiChevronLeft className="text-base" />
      </button>

      <div className="flex items-center gap-1.5">{renderPageNumbers()}</div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-base-200/60 hover:bg-base-200 border border-base-content/5 disabled:opacity-40 disabled:cursor-not-allowed text-base-content transition-all"
        aria-label="Next Page"
      >
        <FiChevronRight className="text-base" />
      </button>
    </div>
  );
}