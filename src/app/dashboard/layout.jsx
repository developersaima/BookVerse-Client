import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import React from "react";
import Link from "next/link";
import {
  FaBook,
  FaHistory,
  FaUser,
  FaBookmark,
  FaBookOpen,
  FaPlusCircle,
  FaDollarSign,
  FaUsers,
  FaExchangeAlt,
  FaChartPie,
  FaHome,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { LuBookOpenText } from "react-icons/lu";

export default async function DashBoardLayout({ children, searchParams }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  const currentUser = session?.user;
  const role = currentUser?.role || "user";
  
  // Get current tab from URL
  const tab = (await searchParams)?.tab || "profile";
  
  const menuItems = {
    user: [
      { id: "profile", label: "Profile Management", icon: FaUser },
      { id: "history", label: "Purchase History", icon: FaHistory },
      { id: "ebooks", label: "My Ebooks", icon: FaBookOpen },
      { id: "bookmarks", label: "Bookmarks", icon: FaBookmark },
    ],
    writer: [
      { id: "manage", label: "Manage Ebooks", icon: FaBook },
      { id: "add", label: "Add Ebook", icon: FaPlusCircle },
      { id: "sales", label: "Sales History", icon: FaDollarSign },
      { id: "bookmarks", label: "Bookmarks", icon: FaBookmark },
    ],
    admin: [
      { id: "home", label: "Dashboard", icon: FaChartPie },
      { id: "users", label: "Manage Users", icon: FaUsers },
      { id: "ebooks", label: "All Ebooks", icon: FaBook },
      { id: "transactions", label: "Transactions", icon: FaExchangeAlt },
    ],
  };

  const currentMenu = menuItems[role] || menuItems.user;

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: "badge-error",
      writer: "badge-warning",
      user: "badge-info",
    };
    return colors[role] || "badge-ghost";
  };

  const getRoleDisplayName = (role) => {
    const names = {
      admin: "Administrator",
      writer: "Writer",
      user: "Reader",
    };
    return names[role] || role;
  };

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-slate-50">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <nav className="navbar w-full bg-white border-b border-slate-200 px-4 py-3 justify-between shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <label
              htmlFor="dashboard-drawer"
              className="btn btn-square btn-ghost lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-slate-800">
                {currentMenu.find((item) => item.id === tab)?.label || "Dashboard"}
              </h1>
              <p className="text-xs text-slate-500">
                Welcome back, {currentUser?.name || "User"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="btn btn-sm btn-ghost gap-2 text-slate-600 hover:text-emerald-600"
            >
              <FaHome className="text-sm" /> 
              <span className="hidden sm:inline">Home</span>
            </Link>
            
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-sm avatar placeholder">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  {currentUser?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              </label>
              <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow-lg bg-white rounded-box w-52 border border-slate-200">
                <li className="menu-title">
                  <span className="text-xs">{currentUser?.email}</span>
                </li>
                <li>
                  <Link href="/profile" className="gap-2">
                    <FaUser className="text-sm" /> Profile
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="gap-2">
                    <FaCog className="text-sm" /> Settings
                  </Link>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <button className="gap-2 text-red-600 hover:bg-red-50">
                    <FaSignOutAlt className="text-sm" /> Sign Out
                  </button>
                </li>
              </ul>
            </div>
            
            <span className={`badge ${getRoleBadgeColor(role)} font-bold text-xs px-3 py-2.5 hidden sm:inline-flex`}>
              {getRoleDisplayName(role)}
            </span>
          </div>
        </nav>

        {/* Mobile Breadcrumb */}
        <div className="sm:hidden px-4 py-2 bg-white border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">
            {currentMenu.find((item) => item.id === tab)?.label || "Dashboard"}
          </h2>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-6 lg:p-8 grow">{children}</div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-40">
        <label
          htmlFor="dashboard-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex flex-col w-72 min-h-full bg-gradient-to-b from-slate-900 to-slate-800 text-slate-300 border-r border-slate-700 shadow-2xl">
          {/* Brand */}
          <div className="p-6 border-b border-slate-700/50">
            <Link
              href="/"
              className="btn btn-ghost text-2xl font-black flex items-center gap-2 px-0 hover:bg-transparent"
            >
              <LuBookOpenText className="text-emerald-500 text-3xl" />
              <span className="tracking-tight text-white">
                Book<span className="text-emerald-500">Verse</span>
              </span>
            </Link>
            <div className="mt-3 flex items-center gap-2">
              <span className={`badge ${getRoleBadgeColor(role)} font-bold text-xs px-3 py-2`}>
                {getRoleDisplayName(role)}
              </span>
              <span className="text-xs text-slate-400">
                {currentUser?.name || "User"}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <ul className="menu w-full px-3 py-4 grow gap-1">
            {currentMenu.map((item) => {
              const Icon = item.icon;
              const isActive = tab === item.id;
              
              return (
                <li key={item.id}>
                  <Link
                    href={`/dashboard?tab=${item.id}`}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                      ${isActive 
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                        : "hover:bg-slate-700/50 hover:text-white"
                      }
                    `}
                  >
                    <Icon className={`size-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-lg"></span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* User Info */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-slate-800/50">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                {currentUser?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {currentUser?.name || "User"}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {currentUser?.email || "No email"}
                </p>
              </div>
            </div>
            <div className="text-center text-xs text-slate-500 mt-3">
              &copy; 2026 BookVerse • v2.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}