import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer p-10 bg-green-50 text-green-900 mt-auto grid grid-cols-1 md:grid-cols-3 border-t border-green-100">
      <div>
        <span className="footer-title text-green-700">BookVerse</span>
        <p className="text-green-800">
          Discover & Read Original Ebooks<br />
          Created by Saima Akter
        </p>
        <div className="grid grid-flow-col gap-4 mt-4 text-green-600">
          <Link href="#"><FaFacebook size={24} /></Link>
          <Link href="#"><FaTwitter size={24} /></Link>
          <Link href="#"><FaInstagram size={24} /></Link>
          <Link href="#"><FaLinkedin size={24} /></Link>
        </div>
      </div>

      <div>
        <span className="footer-title text-green-700">Quick Links</span>
        <Link href="/about" className="link link-hover text-green-800">About</Link>
        <Link href="/contact" className="link link-hover text-green-800">Contact</Link>
        <Link href="/privacy" className="link link-hover text-green-800">Privacy Policy</Link>
      </div>

      <div>
        <span className="footer-title text-green-700">Newsletter</span>
        <div className="form-control w-80">
          <label className="label">
            <span className="label-text text-green-800">Enter your email address</span>
          </label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="username@site.com" 
              className="input input-bordered w-full pr-16 bg-white border-green-200 focus:border-green-600" 
            />
            <button className="btn bg-green-600 text-white hover:bg-green-700 absolute top-0 right-0 rounded-l-none border-none">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="w-full text-center mt-8 pt-4 border-t border-green-100 col-span-3 flex justify-center text-green-700">
        <p>Copyright © {new Date().getFullYear()} - All rights reserved by Saima Akter</p>
      </div>
    </footer>
  );
};

export default Footer;