"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="min-h-[85vh] w-full flex flex-col items-center justify-center bg-base-100 gap-4 transition-colors duration-300">
      <div className="flex flex-col items-center gap-3">
        <span className="loading loading-spinner loading-lg text-[#00a851]"></span>
        <p className="text-xs font-bold tracking-widest uppercase text-base-content/40 animate-pulse">
          Loading BookVerse
        </p>
      </div>
    </div>
  );
}