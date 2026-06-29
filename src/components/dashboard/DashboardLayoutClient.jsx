"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  FaBars,
} from "react-icons/fa";
import { LuBookOpenText } from "react-icons/lu";
import ThemeToggle from "@/components/ThemeToggle";
import DashboardSignOutButton from "@/components/dashboard/DashboardSignOutButton";

const iconMap = {
  FaUser,
  FaHistory,
  FaBookOpen,
  FaBookmark,
  FaBook,
  FaPlusCircle,
  FaDollarSign,
  FaChartPie,
  FaUsers,
  FaExchangeAlt,
};

const menuConfig = {
  user: [
    { id: "profile", label: "Profile", icon: "FaUser" },
    { id: "history", label: "History", icon: "FaHistory" },
    { id: "ebooks", label: "My Ebooks", icon: "FaBookOpen" },
    { id: "bookmarks", label: "Bookmarks", icon: "FaBookmark" },
  ],
  writer: [
    { id: "manage", label: "My Ebooks", icon: "FaBook" },
    { id: "add", label: "Add Ebook", icon: "FaPlusCircle" },
    { id: "sales", label: "Sales", icon: "FaDollarSign" },
    { id: "bookmarks", label: "Bookmarks", icon: "FaBookmark" },
  ],
  admin: [
    { id: "home", label: "Overview", icon: "FaChartPie" },
    { id: "users", label: "Users", icon: "FaUsers" },
    { id: "ebooks", label: "Ebooks", icon: "FaBook" },
    { id: "transactions", label: "Transactions", icon: "FaExchangeAlt" },
  ],
};

const roleStyles = {
  admin: {
    badge: "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30",
    label: "Admin",
    dot: "bg-red-500",
  },
  writer: {
    badge: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30",
    label: "Writer",
    dot: "bg-amber-500",
  },
  user: {
    badge: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    label: "Reader",
    dot: "bg-emerald-500",
  },
};

export default function DashboardLayoutClient({ children, user }) {
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get("tab") || "profile";
  const role = user?.role || "user";
  const currentMenu = menuConfig[role] || menuConfig.user;
  const currentLabel = currentMenu.find((item) => item.id === currentTab)?.label || "Dashboard";
  const roleStyle = roleStyles[role] || roleStyles.user;

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        <header className="sticky top-0 z-30 bg-base-100/80 backdrop-blur-xl border-b border-base-300">
          <div className="flex items-center justify-between px-4 md:px-6 h-16">
            <div className="flex items-center gap-3">
              <label
                htmlFor="dashboard-drawer"
                className="btn btn-ghost btn-square lg:hidden"
              >
                <FaBars className="text-base-content/60 text-lg" />
              </label>
              <div>
                <h1 className="text-lg font-semibold text-base-content">
                  {currentLabel}
                </h1>
                <p className="text-xs text-base-content/60">
                  {user?.name || "User"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />

              <Link
                href="/"
                className="btn btn-ghost btn-sm gap-2 text-base-content/60 hover:text-emerald-600"
              >
                <FaHome /> <span className="hidden sm:inline">Home</span>
              </Link>

              <div className="dropdown dropdown-end">
                <button className="btn btn-ghost btn-sm avatar placeholder">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                </button>
                <ul className="dropdown-content z-50 menu p-2 shadow-xl bg-base-100 rounded-xl w-56 border border-base-300">
                  <li className="menu-title">
                    <span className="text-xs text-base-content/60">
                      {user?.email}
                    </span>
                  </li>
                 
                  <div className="divider my-1"></div>
                  <li>
                    <DashboardSignOutButton />
                  </li>
                </ul>
              </div>

              <span
                className={`badge ${roleStyle.badge} font-medium text-xs px-3 py-2 hidden sm:flex items-center gap-1.5`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${roleStyle.dot} animate-pulse`}
                ></span>
                {roleStyle.label}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>

      <aside className="drawer-side z-40">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

        <div className="flex flex-col w-72 h-full bg-base-100 border-r border-base-300 shadow-2xl">
          <div className="p-6 border-b border-base-300">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <LuBookOpenText className="text-emerald-500 text-3xl" />
              <span className="text-2xl font-black tracking-tight text-base-content">
                Book<span className="text-emerald-500">Verse</span>
              </span>
            </Link>

            <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-base-200/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-lg flex-shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-base-content truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-base-content/60 truncate">
                  {roleStyle.label}
                </p>
              </div>
              <span className={`w-2 h-2 rounded-full ${roleStyle.dot}`}></span>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {currentMenu.map((item) => {
                const Icon = iconMap[item.icon];
                const isActive = currentTab === item.id;

                return (
                  <li key={item.id}>
                    <Link
                      href={`/dashboard?tab=${item.id}`}
                      className={`
                        flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 group
                        ${
                          isActive
                            ? "bg-emerald-500/10 text-emerald-600 shadow-sm"
                            : "text-base-content/60 hover:bg-base-200 hover:text-base-content"
                        }
                      `}
                    >
                      {Icon && (
                        <Icon
                          className={`
                            text-lg transition-colors flex-shrink-0
                            ${
                              isActive
                                ? "text-emerald-600"
                                : "text-base-content/40 group-hover:text-base-content/60"
                            }
                          `}
                        />
                      )}
                      <span className="flex-1">{item.label}</span>
                      {isActive && (
                        <span className="w-1.5 h-6 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30"></span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-base-300">
            <div className="flex items-center justify-between">
              <span className="text-xs text-base-content/40">
                &copy; 2026 BookVerse
              </span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}