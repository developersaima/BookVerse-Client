import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ReaderDashboard from "@/components/dashboard/ReaderDashboard";
import WriterDashboard from "@/components/dashboard/WriterDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

export default async function DashboardPage({ searchParams }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const { tab } = await searchParams;
  const user = session.user;

  if (user.role === "admin") return <AdminDashboard activeTab={tab || "home"} user={user} />;
  if (user.role === "writer") return <WriterDashboard activeTab={tab || "manage"} user={user} />;
  return <ReaderDashboard activeTab={tab || "profile"} user={user} />;
}