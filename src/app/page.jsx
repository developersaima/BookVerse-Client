"use client";
import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import EbookGenres from "@/components/EbookGenres";
import FeaturedEbooks from "@/components/FeaturedEbooks";
import TopWriters from "@/components/TopWriters";

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${baseUrl}/api/public/home`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.ebooks) setBooks(data.ebooks.slice(0, 6));
        if (data?.topWriters) setWriters(data.topWriters.slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="bg-base-100 min-h-screen text-base-content overflow-x-hidden transition-colors duration-300">
      <Hero />
      <EbookGenres />
      <FeaturedEbooks books={books} loading={loading} />
      <TopWriters writers={writers} loading={loading} />
    </main>
  );
}