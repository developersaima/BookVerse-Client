"use client"
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React from "react";
import { FaSignOutAlt } from "react-icons/fa";

const DashboardSignOutButton = () => {
    const router=useRouter()
  return (
    <button
      onClick={async () => {
        // Sign out logic here
        await signOut();
        router.push("/login")
      }}
      className="gap-2 text-error hover:bg-error/10"
    >
      <FaSignOutAlt className="text-sm" /> Sign Out
    </button>
  );
};

export default DashboardSignOutButton;
