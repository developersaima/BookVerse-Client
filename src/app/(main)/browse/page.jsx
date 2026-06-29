import React from "react";
import BrowseClient from "@/components/browse/BrowseClient";

export const metadata = {
  title: "Browse Premium Ebooks | BookVerse",
  description: "Explore, filter, and buy the finest technical, fictional, and educational e-books from world-class independent writers.",
};

async function getEbooks(searchParams) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, val]) => {
    if (val) params.set(key, val);
  });
  
  if (!params.has("limit")) params.set("limit", "8");

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const res = await fetch(`${baseUrl}/api/ebooks?${params.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) return { data: [], totalPages: 1, totalItems: 0 };
    return res.json();
  } catch (err) {
    return { data: [], totalPages: 1, totalItems: 0 };
  }
}

export default async function BrowsePage({ searchParams }) {
  const resolvedParams = await searchParams;
  const initialData = await getEbooks(resolvedParams);

  return (
    <main className="min-h-screen bg-base-100 text-base-content py-12 px-4 md:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-10">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Browse <span className="text-[#00a851]">Ebooks</span>
          </h1>
          <p className="text-xs md:text-sm text-base-content/50 font-medium mt-1.5">
            Discover your next obsession from {initialData.totalItems || 0} active publications
          </p>
        </div>
        
        <BrowseClient initialData={initialData} />
      </div>
    </main>
  );
}