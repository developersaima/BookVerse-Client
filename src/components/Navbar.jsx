"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { LuBookOpenText } from "react-icons/lu";
import { FiSun, FiMoon } from "react-icons/fi";

const Navbar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const user = session?.user;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Ebooks", href: "/browse" },
    ...(user ? [{ name: "Dashboard", href: `/dashboard` }] : []),
  ];

  const isActive = (href) => pathname === href;

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="navbar bg-base-100/80 backdrop-blur-md border-b border-base-content/5 px-4 md:px-8 sticky top-0 z-50 transition-colors duration-300">
      <div className="navbar-start">
        <button
          className="btn btn-ghost btn-sm btn-circle lg:hidden text-base-content/80"
          onClick={() => setMobileOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
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
          className="btn btn-ghost text-xl font-black flex items-center gap-2 px-2 hover:bg-transparent"
        >
          <LuBookOpenText className="text-[#00a851] text-2xl" />
          <span className="tracking-tight text-base-content">
            Book<span className="text-[#00a851]">Verse</span>
          </span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1.5 text-sm font-bold tracking-wide">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={
                  isActive(link.href)
                    ? "bg-[#00a851] text-white rounded-xl hover:bg-[#008f44] px-4 py-2"
                    : "text-base-content/70 hover:text-[#00a851] hover:bg-base-200/50 rounded-xl px-4 py-2 transition-all"
                }
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end gap-3">
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl border border-base-content/10 bg-base-200/30 hover:bg-base-200 hover:border-primary/20 text-base-content/70 hover:text-[#00a851] transition-all"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
          </button>
        )}

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="btn btn-ghost btn-circle avatar border border-base-content/10 hover:border-[#00a851]/30 transition-all focus:bg-transparent"
            >
              <div className="w-9 h-9 rounded-full bg-base-300 flex items-center justify-center overflow-hidden relative">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt="user"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="font-extrabold text-sm text-base-content/80">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2.5 z-[100] w-64 bg-base-100 rounded-2xl shadow-xl border border-base-content/10 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3.5 py-3 border-b border-base-content/5 mb-1.5">
                  <p className="font-bold text-base-content truncate text-sm">{user?.name}</p>
                  <p className="text-xs text-base-content/50 truncate mt-0.5">{user?.email}</p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 text-[9px] font-extrabold tracking-widest text-[#00a851] bg-[#00a851]/10 rounded-md uppercase">
                    {user?.role || "Member"}
                  </span>
                </div>

                <ul className="text-xs font-bold tracking-wide text-base-content/80 space-y-0.5">
                  <li>
                    <Link 
                      href="/dashboard" 
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-base-200/60 hover:text-[#00a851] transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/dashboard/profile" 
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-base-200/60 hover:text-[#00a851] transition-colors"
                    >
                      Profile Settings
                    </Link>
                  </li>
                  
                  <div className="my-1 border-t border-base-content/5" />
                  
                  <li>
                    <button 
                      onClick={handleLogout} 
                      className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-error hover:bg-error/10 transition-colors"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-bold tracking-wide text-base-content/80 hover:text-[#00a851] rounded-xl transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-xs font-bold tracking-wide text-white bg-[#00a851] hover:bg-[#008f44] rounded-xl transition-all shadow-xs"
            >
              Register
            </Link>
          </div>
        )}
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          
          <div className="absolute left-0 top-0 h-full w-72 bg-base-100 p-5 shadow-2xl flex flex-col z-10 border-r border-base-content/5 animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-base-content/5">
              <h2 className="font-black text-base-content text-base uppercase tracking-wider">Navigation</h2>
              <button 
                className="btn btn-sm btn-circle btn-ghost text-base-content/60" 
                onClick={() => setMobileOpen(false)}
              >
                ✕
              </button>
            </div>

            {user && (
              <div className="flex items-center gap-3 px-2 py-3 bg-base-200/40 rounded-2xl mb-4 border border-base-content/5">
                <div className="w-10 h-10 rounded-full bg-base-300 overflow-hidden relative flex items-center justify-center border border-base-content/10">
                  {user?.image ? (
                    <Image src={user.image} alt="user" fill className="object-cover" />
                  ) : (
                    <span className="font-black text-sm text-base-content/70">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="truncate max-w-[170px]">
                  <p className="text-xs font-bold text-base-content truncate">{user?.name}</p>
                  <span className="inline-block px-1.5 py-0.5 text-[8px] font-extrabold tracking-wider text-[#00a851] bg-[#00a851]/10 rounded-md uppercase mt-0.5">
                    {user?.role || "Member"}
                  </span>
                </div>
              </div>
            )}

            <ul className="menu menu-vertical p-0 gap-1 text-sm font-bold tracking-wide text-base-content/70">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={
                      isActive(link.href)
                        ? "bg-[#00a851] text-white rounded-xl py-2.5 px-4"
                        : "hover:text-[#00a851] hover:bg-base-200/60 rounded-xl py-2.5 px-4 transition-all"
                    }
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

              {user && (
                <>
                  <div className="my-2 border-t border-base-content/5" />
                  <li>
                    <Link href="/dashboard/profile" className="hover:text-[#00a851] hover:bg-base-200/60 rounded-xl py-2.5 px-4 transition-all">
                      Profile Settings
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="text-error hover:bg-error/10 rounded-xl py-2.5 px-4 transition-all mt-2">
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