import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer p-10 bg-base-200 text-base-content mt-auto grid grid-cols-1 md:grid-cols-3">
      <div>
        <span className="footer-title">BookVerse</span>
        <p>Discover & Read Original Ebooks<br />Created by Saima Akter</p>
        <div className="grid grid-flow-col gap-4 mt-4">
          <Link href="#"><FaFacebook size={24} /></Link>
          <Link href="#"><FaTwitter size={24} /></Link>
          <Link href="#"><FaInstagram size={24} /></Link>
          <Link href="#"><FaLinkedin size={24} /></Link>
        </div>
      </div>

      <div>
        <span className="footer-title">Quick Links</span>
        <Link href="/about" className="link link-hover">About</Link>
        <Link href="/contact" className="link link-hover">Contact</Link>
        <Link href="/privacy" className="link link-hover">Privacy Policy</Link>
      </div>

      <div>
        <span className="footer-title">Newsletter</span>
        <div className="form-control w-80">
          <label className="label">
            <span className="label-text">Enter your email address</span>
          </label>
          <div className="relative">
            <input type="text" placeholder="username@site.com" className="input input-bordered w-full pr-16" />
            <button className="btn btn-primary absolute top-0 right-0 rounded-l-none">Subscribe</button>
          </div>
        </div>
      </div>

      <div className="w-full text-center mt-8  pt-4 col-span-3 flex justify-center">
        <p className='text-center'>Copyright © {new Date().getFullYear()} - All rights reserved by Saima Akter</p>
      </div>
    </footer>
  );
};

export default Footer;