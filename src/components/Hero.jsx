"use client";

import React from "react";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";

const Hero = () => {
  const slides = [
    {
      title: "Explore Original Ebooks",
      desc: "Dive into a world of limitless imagination with our curated collection of digital stories.",
    },
    {
      title: "Share Your Stories",
      desc: "Empower your voice and share your unique tales with a global community of readers.",
    },
    {
      title: "Join BookVerse Today",
      desc: "Connect with talented writers and find your next favorite page-turner.",
    },
  ];

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-base-100 px-4 py-16 border-b border-base-content/5 transition-colors duration-300">
      <style>{`
        .swiper-button-next, .swiper-button-prev { color: #00a851 !important; }
        .swiper-pagination-bullet-active { background: #00a851 !important; }
        .swiper-pagination-bullet { background-color: var(--fallback-bc,oklch(var(--bc)/0.3)); }
      `}</style>

      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="w-full max-w-5xl h-[450px]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="flex flex-col items-center justify-center text-center bg-transparent"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-6 md:p-10 flex flex-col items-center justify-center h-full"
            >
              <h1 className="text-4xl md:text-6xl font-black mb-6 text-base-content tracking-tight">
                {slide.title.includes("Ebooks") ? (
                  <>
                    Explore Original{" "}
                    <span className="text-[#00a851]">Ebooks</span>
                  </>
                ) : slide.title.includes("BookVerse") ? (
                  <>
                    Join <span className="text-[#00a851]">BookVerse</span> Today
                  </>
                ) : (
                  slide.title
                )}
              </h1>

              <p className="text-base md:text-lg text-base-content/70 max-w-2xl mx-auto mb-10 font-medium">
                {slide.desc}
              </p>

              <div className="flex gap-4 justify-center">
                <Link
                  href="/browse"
                  className="px-7 py-3.5 bg-[#00a851] text-white hover:bg-[#008f44] font-bold text-sm tracking-wide rounded-xl shadow-lg shadow-[#00a851]/20 transition-all"
                >
                  Browse Ebooks
                </Link>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;
