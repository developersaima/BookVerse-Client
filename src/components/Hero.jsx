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
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1600&q=80",
      gradient: "from-emerald-900/60 to-emerald-800/40",
    },
    {
      title: "Share Your Stories",
      desc: "Empower your voice and share your unique tales with a global community of readers.",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1600&q=80",
      gradient: "from-blue-900/60 to-indigo-800/40",
    },
    {
      title: "Join BookVerse Today",
      desc: "Connect with talented writers and find your next favorite page-turner.",
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600&q=80",
      gradient: "from-amber-900/60 to-rose-800/40",
    },
  ];

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-base-100 px-4  border-b border-base-content/5 transition-colors duration-300 overflow-hidden">
      <style>{`
        .swiper-button-next, .swiper-button-prev { 
          color: white !important; 
          background: rgba(0,0,0,0.3);
          width: 48px !important;
          height: 48px !important;
          border-radius: 50% !important;
          backdrop-filter: blur(4px);
          transition: all 0.3s ease;
        }
        .swiper-button-next:hover, .swiper-button-prev:hover {
          background: rgba(0,168,81,0.8);
          transform: scale(1.1);
        }
        .swiper-button-next::after, .swiper-button-prev::after {
          font-size: 18px !important;
          font-weight: bold;
        }
        .swiper-pagination-bullet { 
          background: rgba(255,255,255,0.5) !important;
          width: 10px !important;
          height: 10px !important;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active { 
          background: #00a851 !important;
          width: 28px !important;
          border-radius: 8px !important;
        }
        .swiper-pagination {
          bottom: 30px !important;
        }
        .slide-content {
          position: relative;
          z-index: 2;
        }
        .slide-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
        }
        .slide-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transform: scale(1.05);
          transition: transform 8s ease;
        }
        .swiper-slide-active .slide-bg {
          transform: scale(1);
        }
      `}</style>

      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="w-full max-w-7xl h-[550px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative overflow-hidden">
            {/* Background Image */}
            <div 
              className="slide-bg"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            
            {/* Gradient Overlay */}
            <div className={`slide-overlay bg-gradient-to-r ${slide.gradient}`} />
            
            {/* Additional Overlay for Depth */}
            <div className="slide-overlay bg-black/20" />

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="slide-content relative z-10 flex flex-col items-center justify-center text-center h-full p-6 md:p-10"
            >
              {/* Decorative Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-4 inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
              >
                <span className="text-xs font-semibold text-white tracking-widest uppercase">
                  {index === 0 ? "📚 Featured" : index === 1 ? "✍️ Community" : "🌟 Join Now"}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 text-white drop-shadow-2xl tracking-tight leading-tight max-w-4xl"
              >
                {slide.title.includes("Ebooks") ? (
                  <>
                    Explore Original{" "}
                    <span className="text-[#00a851] bg-white/10 backdrop-blur-sm px-4 py-1 rounded-2xl inline-block">Ebooks</span>
                  </>
                ) : slide.title.includes("BookVerse") ? (
                  <>
                    Join <span className="text-[#00a851] bg-white/10 backdrop-blur-sm px-4 py-1 rounded-2xl inline-block">BookVerse</span> Today
                  </>
                ) : (
                  slide.title
                )}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-base md:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto mb-8 font-medium drop-shadow-lg"
              >
                {slide.desc}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link
                  href="/browse"
                  className="px-8 py-4 bg-[#00a851] text-white hover:bg-[#008f44] font-bold text-sm tracking-wide rounded-xl shadow-2xl shadow-[#00a851]/30 transition-all duration-300 hover:scale-105 hover:shadow-[#00a851]/50 flex items-center gap-2 group"
                >
                  <span>Browse Ebooks</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/about"
                  className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 font-bold text-sm tracking-wide rounded-xl border border-white/30 transition-all duration-300 hover:scale-105"
                >
                  Learn More
                </Link>
              </motion.div>

              {/* Floating Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="absolute bottom-8 left-8 right-8 flex justify-center gap-6 md:gap-12 text-white/80"
              >
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-white">10K+</p>
                  <p className="text-xs uppercase tracking-wider text-white/60">Ebooks</p>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-white">5K+</p>
                  <p className="text-xs uppercase tracking-wider text-white/60">Writers</p>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-white">50K+</p>
                  <p className="text-xs uppercase tracking-wider text-white/60">Readers</p>
                </div>
              </motion.div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;