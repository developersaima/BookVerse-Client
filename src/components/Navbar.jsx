"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { LuBookOpenText } from "react-icons/lu";

const Navbar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Ebooks", href: "/browse" },
    ...(user ? [{ name: "Dashboard", href: `/dashboard` }] : []),
  ];

  const isActive = (href) => pathname === href;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      setDropdownOpen(false);
      setMobileOpen(false);
    } catch (error) {
      toast.error("Something went wrong during logout");
    }
  };

  return (
    <div className="navbar bg-green-50 shadow-md px-4 md:px-8 sticky top-0 z-50">
      <div className="navbar-start">
        <button
          className="btn btn-ghost lg:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </button>

        <Link
          href="/"
          className="btn btn-ghost text-2xl font-bold flex items-center gap-1"
        >
          <LuBookOpenText className="text-green-700 mt-1" />
          <span>
            <span className="text-green-600">Book</span>
            <span className="text-green-900">Verse</span>
          </span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2 font-medium">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={
                  isActive(link.href)
                    ? "bg-green-600 text-white rounded-lg hover:bg-green-700"
                    : "text-green-800 hover:text-green-600"
                }
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="btn btn-ghost btn-circle avatar border border-green-200"
            >
              <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center overflow-hidden relative">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt="user"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="font-bold text-green-800">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 z-[100] w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2">
                <div className="px-3 py-3 border-b border-gray-50 mb-1">
                  <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold tracking-wider text-green-700 bg-green-50 rounded-full uppercase">
                    {user?.role || "Member"}
                  </span>
                </div>

                <ul className="text-sm text-gray-700 space-y-0.5">
                  <li>
                    <Link 
                      href="/dashboard" 
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/dashboard/profile" 
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Profile Settings
                    </Link>
                  </li>
                  
                  <div className="my-1 border-t border-gray-100" />
                  
                  <li>
                    <button 
                      onClick={handleLogout} 
                      className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <Link
              href="/login"
              className="btn btn-sm btn-ghost text-green-800"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="btn btn-sm bg-green-600 text-white border-none hover:bg-green-700"
            >
              Register
            </Link>
          </div>
        )}
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div 
            className="absolute inset-0 bg-black/40 transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          
          <div className="absolute left-0 top-0 h-full w-72 bg-white p-4 shadow-xl flex flex-col z-10">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
              <h2 className="font-bold text-green-800 text-lg">Menu</h2>
              <button 
                className="btn btn-sm btn-circle btn-ghost" 
                onClick={() => setMobileOpen(false)}
              >
                ✕
              </button>
            </div>

            <ul className="menu gap-2 text-base">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={
                      isActive(link.href)
                        ? "bg-green-600 text-white font-medium"
                        : "text-gray-700"
                    }
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

              {user && (
                <>
                  <div className="divider my-2"></div>
                  <li>
                    <Link href="/dashboard/profile" className="text-gray-700">Profile</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="text-red-600 hover:bg-red-50">
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;