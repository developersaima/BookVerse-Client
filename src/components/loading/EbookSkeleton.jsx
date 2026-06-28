"use client";
import React from "react";

export default function EbookSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="border border-base-content/10 bg-base-100 rounded-2xl overflow-hidden p-5 space-y-4">
          <div className="skeleton aspect-[4/5] w-full bg-base-200 rounded-xl" />
          <div className="skeleton h-4 w-1/3 bg-base-200 rounded" />
          <div className="skeleton h-6 w-3/4 bg-base-200 rounded" />
          <div className="skeleton h-4 w-1/2 bg-base-200 rounded" />
          <div className="flex justify-between items-center pt-4 border-t border-base-content/5">
            <div className="skeleton h-6 w-16 bg-base-200 rounded" />
            <div className="skeleton h-9 w-24 bg-base-200 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}