"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  const user = null;
  const role = 'user';

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Browse Ebooks', href: '/browse' },
    { name: 'Dashboard', href: `/dashboard/${role}` },
  ];

  const isActive = (href) => pathname === href;

  return (
    <div className="navbar bg-base-100 shadow-md px-4 sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={isActive(link.href) ? 'text-primary font-bold' : ''}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-2xl font-bold text-primary">BookVerse</Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link 
                href={link.href} 
                className={`font-medium ${isActive(link.href) ? 'bg-primary text-white' : 'hover:text-primary'}`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end">
        {user ? (
          <button className="btn btn-sm btn-outline btn-error">Logout</button>
          
          
        ) : (
          <div><Link href="/login" className="btn btn-sm btn-gost">Login</Link>
          <Link href="/register" className="btn btn-sm btn-primary ms-2">Register</Link></div>
        )}
      </div>
    </div>
  );
};

export default Navbar;