import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import React from "react";
import DashboardLayoutClient from "@/components/dashboard/DashboardLayoutClient";

export default async function DashBoardLayout({ children }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const currentUser = session?.user;

  return <DashboardLayoutClient user={currentUser}>{children}</DashboardLayoutClient>;
}