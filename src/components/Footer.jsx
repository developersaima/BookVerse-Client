"use client";

import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { LuBookOpenText } from 'react-icons/lu';

const Footer = () => {
  return (
    <footer className="w-full bg-base-200/60 border-t border-base-content/5 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        
        {/* Brand Section */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-base-content">
            <LuBookOpenText className="text-[#00a851] text-2xl" />
            <span>Book<span className="text-[#00a851]">Verse</span></span>
          </Link>
          <p className="text-sm text-base-content/60 max-w-sm font-medium leading-relaxed">
            Discover & Read Original Ebooks.<br />
            Created by Saima Akter
          </p>
          <div className="flex gap-4 mt-2 text-base-content/40">
            <Link href="#" className="hover:text-[#00a851] transition-colors"><FaFacebook size={20} /></Link>
            <Link href="#" className="hover:text-[#00a851] transition-colors"><FaTwitter size={20} /></Link>
            <Link href="#" className="hover:text-[#00a851] transition-colors"><FaInstagram size={20} /></Link>
            <Link href="#" className="hover:text-[#00a851] transition-colors"><FaLinkedin size={20} /></Link>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="md:col-span-3 flex flex-col gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-base-content/40 mb-1">Quick Links</span>
          <Link href="/about" className="text-sm font-semibold text-base-content/70 hover:text-[#00a851] transition-colors w-fit">About</Link>
          <Link href="/contact" className="text-sm font-semibold text-base-content/70 hover:text-[#00a851] transition-colors w-fit">Contact</Link>
          <Link href="/privacy" className="text-sm font-semibold text-base-content/70 hover:text-[#00a851] transition-colors w-fit">Privacy Policy</Link>
        </div>

        {/* Newsletter Section */}
        <div className="md:col-span-4 flex flex-col gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-base-content/40 mb-1">Newsletter</span>
          <p className="text-xs text-base-content/60 font-medium">Enter your email address to get the latest updates.</p>
          <div className="form-control w-full max-w-sm mt-1">
            <div className="relative flex items-center w-full">
              <input 
                type="email" 
                placeholder="username@site.com" 
                className="input input-bordered w-full h-11 pr-24 text-sm rounded-xl bg-base-100 border-base-content/10 focus:border-[#00a851] focus:outline-none" 
              />
              <button className="absolute right-1 px-4 h-9 bg-[#00a851] text-white hover:bg-[#008f44] text-xs font-bold tracking-wide rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Copyright Bottom */}
      <div className="w-full border-t border-base-content/5 py-6 px-6 flex justify-center text-center text-xs font-semibold text-base-content/40">
        <p>Copyright © {new Date().getFullYear()} - All rights reserved by Saima Akter</p>
      </div>
    </footer>
  );
};

export default Footer;