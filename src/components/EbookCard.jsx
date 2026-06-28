"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiUser, FiTag, FiShoppingBag } from "react-icons/fi";

export default function EbookCard({ book }) {
  const { _id, title, writerName, genre, price, coverImage, status } = book;
  const isInStock = status?.toLowerCase() === "in stock" || status?.toLowerCase() === "available";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col h-full border border-base-content/10 bg-base-100 hover:border-[#00a851]/40 hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300"
    >
      <figure className="aspect-[4/5] bg-base-200 overflow-hidden relative w-full">
        <Image
          src={coverImage || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e"}
          alt={title}
          fill
          sizes="(max-w-7xl) 33vw, 50vw"
          className="object-cover group-hover:scale-102 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 z-10">
          <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-wider uppercase shadow-xs ${
            isInStock ? "bg-[#00a851] text-white" : "bg-error text-error-content"
          }`}>
            {status || "In Stock"}
          </span>
        </div>
      </figure>

      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-[#00a851] bg-[#00a851]/10 px-2.5 py-0.5 rounded-md">
            <FiTag /> {genre}
          </span>
          <h3 className="text-base font-black mt-3 text-base-content group-hover:text-[#00a851] transition-colors truncate" title={title}>
            {title}
          </h3>
          <p className="text-xs text-base-content/60 mt-1 flex items-center gap-1.5">
            <FiUser className="shrink-0" /> <span className="truncate">By {writerName || "Anonymous"}</span>
          </p>
        </div>

        <div className="flex justify-between items-center mt-5 pt-4 border-t border-base-content/5">
          <span className="text-lg font-black text-base-content">${price}</span>
          <Link
            href={`/ebooks/${_id}`}
            className="px-4 py-2 text-xs font-bold tracking-wider uppercase text-white bg-[#00a851] hover:bg-[#008f44] rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <FiShoppingBag /> Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}