"use client";
import React, { useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[85vh] w-full bg-base-100 text-base-content flex flex-col items-center justify-center px-6 text-center transition-colors duration-300">
      <div className="max-w-sm flex flex-col items-center">
        <FiAlertTriangle className="text-6xl text-warning bg-warning/10 p-3 rounded-2xl mb-6" />
        <h2 className="text-xl font-black tracking-tight">Something went wrong.</h2>
        <p className="text-xs text-base-content/50 mt-2 font-medium">
          An unexpected runtime error occurred while processing your request.
        </p>
        <button
          onClick={() => reset()}
          className="mt-6 px-5 py-3 bg-base-200 hover:bg-base-300 border border-base-content/10 text-base-content font-bold text-xs tracking-wide rounded-xl transition-all uppercase"
        >
          Reload Page
        </button>
      </div>
    </main>
  );
}