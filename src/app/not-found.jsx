"use client";
import React from "react";
import Link from "next/link";
import { TbError404 } from "react-icons/tb";

export default function NotFound() {
  return (
    <main className="min-h-[85vh] w-full bg-base-100 text-base-content flex flex-col items-center justify-center px-6 text-center transition-colors duration-300">
      <div className="max-w-md flex flex-col items-center">
        <TbError404 className="text-8xl text-error bg-error/10 p-4 rounded-3xl mb-6 animate-bounce" />
        <h1 className="text-3xl font-black tracking-tight">Page Not Found</h1>
        <p className="text-sm text-base-content/60 mt-3 font-medium leading-relaxed">
          The page you are trying to access does not exist, has been removed, or the address was entered incorrectly.
        </p>
        <Link 
          href="/" 
          className="mt-8 px-6 py-3.5 bg-[#00a851] hover:bg-[#008f44] text-white font-bold text-xs tracking-wide rounded-xl shadow-lg shadow-[#00a851]/10 transition-all uppercase"
        >
          Go Back Home
        </Link>
      </div>
    </main>
  );
}