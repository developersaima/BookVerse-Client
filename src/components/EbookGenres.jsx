"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiBook, FiSearch, FiHeart, FiLayers, FiEye, FiActivity } from "react-icons/fi";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function EbookGenres() {
  const genres = [
    { name: "Fiction", slug: "fiction", icon: FiBook },
    { name: "Mystery", slug: "mystery", icon: FiSearch },
    { name: "Romance", slug: "romance", icon: FiHeart },
    { name: "Sci-Fi", slug: "sci-fi", icon: FiLayers },
    { name: "Fantasy", slug: "fantasy", icon: FiEye },
    { name: "Horror", slug: "horror", icon: FiActivity }
  ];

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-t border-base-content/5 transition-colors duration-300">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-base-content">
          Ebook <span className="text-[#00a851]">Genres</span>
        </h2>
        <div className="w-10 h-1 bg-[#00a851] mx-auto mt-3 rounded-full"></div>
      </div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {genres.map((genre) => {
          const IconComponent = genre.icon;
          return (
            <motion.a
              key={genre.slug}
              href={`/browse?category=${genre.slug}`}
              variants={fadeIn}
              whileHover={{ scale: 1.05, y: -4 }}
              className="flex flex-col items-center justify-center p-6 border border-base-content/10 bg-base-200/40 rounded-2xl text-center group hover:border-[#00a851]/30 hover:bg-base-100 hover:shadow-xl transition-all duration-300"
            >
              <IconComponent className="text-2xl mb-3 text-base-content/40 group-hover:text-[#00a851] group-hover:scale-110 transition-all duration-300" />
              <span className="text-sm font-bold text-base-content/80 group-hover:text-[#00a851] transition-colors">
                {genre.name}
              </span>
            </motion.a>
          );
        })}
      </motion.div>
    </section>
  );
}