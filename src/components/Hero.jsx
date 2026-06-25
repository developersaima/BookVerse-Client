"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] py-14 flex flex-col items-center justify-center text-center px-4 bg-base-100">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="badge badge-neutral gap-2 p-4 mb-6"
      >
        ✨ Welcome to BookVerse
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-5xl md:text-7xl font-extrabold mb-6 max-w-4xl leading-tight"
      >
        Discover & Read <br />
        <span className="text-primary">Original Ebooks</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-lg md:text-xl text-base-content/70 max-w-2xl mb-10"
      >
        Explore captivating stories from talented writers around the world. 
        Find your next favorite read and support independent creators.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex gap-4"
      >
        <Link href="/browse" className="btn btn-primary btn-lg px-8">
          Browse Ebooks
        </Link>
        <Link href="/stories" className="btn btn-outline btn-lg px-8">
          Explore Stories
        </Link>
      </motion.div>

    </section>
  );
};

export default HeroSection;