"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HeroSection = () => {
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
    }
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-green-50 px-4 py-20">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="w-full max-w-5xl h-[500px]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="flex flex-col items-center justify-center text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-10"
            >
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-green-950">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-green-800/80 max-w-2xl mx-auto mb-10">
                {slide.desc}
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/browse" className="btn bg-green-600 text-white hover:bg-green-700 border-none btn-lg">
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

export default HeroSection;