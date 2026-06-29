"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function DashboardNav({ menuItems }) {
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get("tab") || "profile";

  return (
    <nav className="flex-1 overflow-y-auto p-4">
      <ul className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          
          return (
            <li key={item.id}>
              <Link
                href={`/dashboard?tab=${item.id}`}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 group
                  ${isActive 
                    ? "bg-primary/10 text-primary shadow-sm" 
                    : "text-base-content/60 hover:bg-base-200 hover:text-base-content"
                  }
                `}
              >
                {Icon && <Icon className={`
                  text-lg transition-colors flex-shrink-0
                  ${isActive 
                    ? "text-primary" 
                    : "text-base-content/40 group-hover:text-base-content/60"
                  }
                `} />}
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-6 rounded-full bg-primary shadow-lg shadow-primary/30"></span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}