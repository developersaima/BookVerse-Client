"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from "../lib/auth-client";
import toast from "react-hot-toast";
import { LuBookOpenText } from "react-icons/lu"; 

const Navbar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const role = 'user';

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Browse Ebooks', href: '/browse' },
    { name: 'Dashboard', href: `/dashboard/${role}` },
  ];

  const isActive = (href) => pathname === href;

  const handleSignout = async () => {
    await signOut();
    toast.success("Log out successful");
  };

  return (
    <div className="navbar bg-green-50 shadow-md px-4 md:px-8 sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden p-1 mr-2 text-green-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white rounded-box w-52 border border-green-100">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={isActive(link.href) ? 'text-green-600 font-bold' : 'text-gray-700'}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        
        <Link href="/" className="btn btn-ghost text-2xl font-bold p-0 hover:bg-transparent flex items-center gap-1">
          <span className="text-green-700"><LuBookOpenText /></span>
          <span className="flex flex-row">
            <span className="text-green-600">Book</span><span className="text-green-900">Verse</span>
          </span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2 font-medium">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link 
                href={link.href} 
                className={isActive(link.href) ? 'bg-green-600 text-white' : 'text-green-800 hover:text-green-600'}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end gap-4">
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-green-200">
              <div className="w-9 h-9 relative rounded-full overflow-hidden bg-green-200 text-green-800 flex items-center justify-center">
                {user?.image ? (
                  <Image alt={user?.name || "User"} src={user.image} fill sizes="36px" className="object-cover" />
                ) : (
                  <span className="text-sm font-bold">{user?.name?.charAt(0).toUpperCase() || "U"}</span>
                )}
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow-md border border-green-100">
              <li>
                <div className="flex flex-col items-start">
                  <strong className="truncate w-full text-green-800">{user?.name}</strong>
                  <span className="text-xs text-gray-500 truncate w-full">{user?.email}</span>
                </div>
              </li>
              <div className="divider my-1"></div>
              <li><button onClick={handleSignout} className="text-red-600">Logout</button></li>
            </ul>
          </div>
        ) : (
          <div>
            <Link href="/login" className="btn btn-sm btn-ghost text-green-800">Login</Link>
            <Link href="/register" className="btn btn-sm bg-green-600 text-white border-none hover:bg-green-700 ms-2">Register</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;