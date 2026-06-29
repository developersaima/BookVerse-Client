"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { authClient } from "@/lib/auth-client";

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

export default function AdminDashboard({ activeTab }) {
  const [metrics, setMetrics] = useState({
    totalReaders: 0,
    totalWriters: 0,
    totalSold: 0,
    totalRevenue: 0,
  });
  const [users, setUsers] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [genreData, setGenreData] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal States
  const [deleteModal, setDeleteModal] = useState({ open: false, type: "", id: "", name: "" });
  const [roleModal, setRoleModal] = useState({ open: false, userId: "", currentRole: "" });
  const [statusModal, setStatusModal] = useState({ open: false, ebookId: "", currentStatus: "" });

  const getAuthHeaders = async () => {
    try {
      const { data: tokenData } = await authClient.token();
      if (!tokenData?.token) throw new Error("No authentication token found");
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenData.token}`,
      };
    } catch (error) {
      console.error("Auth error:", error);
      throw error;
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeaders();

      const [analyticsRes, usersRes, ebooksRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/ebooks`, { headers }),
      ]);

      if (!analyticsRes.ok) throw new Error("Failed to fetch analytics");

      const analytics = await analyticsRes.json();

      setMetrics({
        totalReaders: analytics.totalUsers || 0,
        totalWriters: analytics.totalWriters || 0,
        totalSold: analytics.totalEbooksSold || 0,
        totalRevenue: analytics.totalRevenue || 0,
      });

      if (analytics.genreChart && analytics.genreChart.length > 0) {
        const formatted = analytics.genreChart.map((item) => ({
          name: item._id || "Other",
          value: item.count || 0,
        }));
        setGenreData(formatted);
      } else {
        setGenreData([{ name: "No Data", value: 1 }]);
      }

      if (analytics.monthlySales && analytics.monthlySales.length > 0) {
        setMonthlySales(analytics.monthlySales);
      } else {
        setMonthlySales([
          { month: "Jan", sales: 0 },
          { month: "Feb", sales: 0 },
          { month: "Mar", sales: 0 },
          { month: "Apr", sales: 0 },
          { month: "May", sales: 0 },
          { month: "Jun", sales: 0 },
        ]);
      }

      if (analytics.allTransactions) {
        setTransactions(analytics.allTransactions);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(Array.isArray(usersData) ? usersData : []);
      }

      if (ebooksRes.ok) {
        const ebooksData = await ebooksRes.json();
        setEbooks(Array.isArray(ebooksData) ? ebooksData : []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(error.message);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteConfirm = async () => {
    const { type, id, name } = deleteModal;
    setActionLoading(true);
    try {
      const headers = await getAuthHeaders();
      let endpoint = "";
      if (type === "user") {
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${id}`;
      } else {
        endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/ebooks/${id}`;
      }

      const res = await fetch(endpoint, { method: "DELETE", headers });

      if (res.ok) {
        toast.success(`${type === "user" ? "User" : "Ebook"} deleted successfully!`);
        if (type === "user") {
          setUsers(users.filter((u) => u._id !== id));
        } else {
          setEbooks(ebooks.filter((b) => b._id !== id));
        }
        await fetchDashboardData();
        setDeleteModal({ open: false, type: "", id: "", name: "" });
      } else {
        const error = await res.json();
        toast.error(error.message || `Failed to delete ${type}`);
      }
    } catch (error) {
      toast.error(`Failed to delete ${type}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRoleChange = async () => {
    const { userId, newRole } = roleModal;
    setActionLoading(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (res.ok) {
        toast.success("Role updated successfully!");
        setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
        await fetchDashboardData();
        setRoleModal({ open: false, userId: "", newRole: "" });
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to update role");
      }
    } catch (error) {
      toast.error("Failed to update role");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    const { ebookId, currentStatus } = statusModal;
    setActionLoading(true);
    try {
      const headers = await getAuthHeaders();
      const newStatus = currentStatus === "published" || currentStatus === "available" || currentStatus === "In Stock"
        ? "unpublished"
        : "published";

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/ebooks/${ebookId}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.ok) {
        toast.success(`Ebook ${newStatus === "published" ? "published" : "unpublished"}`);
        setEbooks(ebooks.map((b) => (b._id === ebookId ? { ...b, status: newStatus } : b)));
        await fetchDashboardData();
        setStatusModal({ open: false, ebookId: "", currentStatus: "" });
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <span className="loading loading-spinner loading-lg text-emerald-600"></span>
        <p className="text-base-content/60 text-sm">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <div className="alert alert-error max-w-md">
          <span>Error: {error}</span>
        </div>
        <button onClick={fetchDashboardData} className="btn btn-success text-white">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activeTab === "home" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <div className="bg-base-100 p-6 rounded-2xl border border-base-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-base-content/60 text-xs font-semibold uppercase tracking-wider">Total Readers</span>
                  <h3 className="text-3xl font-bold text-base-content mt-1">{metrics.totalReaders}</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-base-200/50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-base-content/40">Active readers on platform</span>
              </div>
            </div>

            <div className="bg-base-100 p-6 rounded-2xl border border-base-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-base-content/60 text-xs font-semibold uppercase tracking-wider">Total Writers</span>
                  <h3 className="text-3xl font-bold text-base-content mt-1">{metrics.totalWriters}</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-base-200/50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-base-content/40">Active content creators</span>
              </div>
            </div>

            <div className="bg-base-100 p-6 rounded-2xl border border-base-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-base-content/60 text-xs font-semibold uppercase tracking-wider">Ebooks Sold</span>
                  <h3 className="text-3xl font-bold text-emerald-600 mt-1">{metrics.totalSold}</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-base-content/40">Total copies purchased</span>
              </div>
            </div>

            <div className="bg-base-100 p-6 rounded-2xl border border-base-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-base-content/60 text-xs font-semibold uppercase tracking-wider">Gross Revenue</span>
                  <h3 className="text-3xl font-bold text-emerald-600 mt-1">${metrics.totalRevenue.toFixed(2)}</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-base-content/40">Total platform earnings</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-base-100 p-6 rounded-2xl border border-base-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-base-content">Monthly Sales Trend</h3>
                <span className="text-xs text-base-content/40">Last 6 months</span>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlySales}>
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                    <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} fill="url(#salesGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-base-100 p-6 rounded-2xl border border-base-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-base-content">Genre Distribution</h3>
                <span className="text-xs text-base-content/40">By category</span>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={genreData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                      {genreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-base-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-base-content">User Management</h2>
              <p className="text-sm text-base-content/40">Manage all registered users</p>
            </div>
            <span className="badge badge-ghost">{users.length} users</span>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="bg-base-200/50">
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-base-200/30 transition-colors">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center">
                            <span className="text-sm font-bold uppercase">{user.name?.charAt(0) || "U"}</span>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-base-content">{user.name}</div>
                          <div className="text-xs text-base-content/40">ID: {user._id?.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-base-content/80">{user.email}</td>
                    <td>
                      <select
                        defaultValue={user.role || "reader"}
                        onChange={(e) => setRoleModal({ open: true, userId: user._id, newRole: e.target.value })}
                        className="select select-bordered select-sm w-32 bg-base-100"
                        disabled={actionLoading}
                      >
                        <option value="reader">Reader</option>
                        <option value="writer">Writer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => setDeleteModal({ open: true, type: "user", id: user._id, name: user.name })}
                        className="btn btn-sm btn-error text-white gap-1 hover:scale-105 transition-transform"
                        disabled={actionLoading}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ebooks Tab */}
      {activeTab === "ebooks" && (
        <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-base-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-base-content">Ebook Management</h2>
              <p className="text-sm text-base-content/40">Manage all ebooks on the platform</p>
            </div>
            <span className="badge badge-ghost">{ebooks.length} ebooks</span>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="bg-base-200/50">
                  <th>Title</th>
                  <th>Author</th>
                  <th className="text-right">Price</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ebooks.map((ebook) => (
                  <tr key={ebook._id} className="hover:bg-base-200/30 transition-colors">
                    <td>
                      <div className="flex items-center gap-3">
                        {ebook.coverImage ? (
                          <img src={ebook.coverImage} alt={ebook.title} className="w-12 h-16 rounded-lg object-cover border border-base-200" />
                        ) : (
                          <div className="w-12 h-16 rounded-lg bg-base-200 flex items-center justify-center border border-base-200">
                            <svg className="w-6 h-6 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-base-content">{ebook.title}</div>
                          <div className="text-xs text-base-content/40">{ebook.genre}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="text-sm text-base-content">{ebook.writerName || "Unknown"}</span>
                        <span className="text-xs text-base-content/40">{ebook.writerEmail}</span>
                      </div>
                    </td>
                    <td className="text-right font-bold text-emerald-600">${ebook.price?.toFixed(2) || "0.00"}</td>
                    <td>
                      <span className={`badge ${ebook.status === "published" || ebook.status === "available" || ebook.status === "In Stock" ? "badge-success" : ebook.status === "sold" || ebook.status === "Sold Out" ? "badge-error" : "badge-warning"} gap-1`}>
                        {ebook.status === "published" || ebook.status === "available" || ebook.status === "In Stock" ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                        ) : null}
                        {ebook.status || "Unknown"}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => setStatusModal({ open: true, ebookId: ebook._id, currentStatus: ebook.status })}
                          className={`btn btn-sm ${ebook.status === "published" || ebook.status === "available" || ebook.status === "In Stock" ? "btn-warning" : "btn-success"} text-white gap-1 hover:scale-105 transition-transform`}
                          disabled={actionLoading}
                        >
                          {ebook.status === "published" || ebook.status === "available" || ebook.status === "In Stock" ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, type: "ebook", id: ebook._id, name: ebook.title })}
                          className="btn btn-sm btn-error text-white gap-1 hover:scale-105 transition-transform"
                          disabled={actionLoading}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === "transactions" && (
        <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-base-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-base-content">Transaction History</h2>
              <p className="text-sm text-base-content/40">All platform transactions</p>
            </div>
            <span className="badge badge-ghost">{transactions.length} transactions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="bg-base-200/50">
                  <th>Transaction ID</th>
                  <th>Type</th>
                  <th>User</th>
                  <th className="text-right">Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={transaction._id || transaction.id || index} className="hover:bg-base-200/30 transition-colors">
                    <td>
                      <span className="font-mono text-xs bg-base-200 px-2 py-1 rounded">
                        {transaction.transactionId || transaction.id || `TXN-${index + 1}`}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${transaction.type === "purchase" ? "badge-success" : "badge-info"} gap-1`}>
                        {transaction.type || "N/A"}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="text-sm text-base-content">{transaction.buyerName || transaction.userName || "N/A"}</span>
                        <span className="text-xs text-base-content/40">{transaction.buyerEmail || transaction.email || "N/A"}</span>
                      </div>
                    </td>
                    <td className="text-right font-bold text-emerald-600">${transaction.amount?.toFixed(2) || "0.00"}</td>
                    <td>
                      <div className="flex flex-col">
                        <span className="text-sm text-base-content/80">
                          {transaction.date ? new Date(transaction.date).toLocaleDateString() : "N/A"}
                        </span>
                        <span className="text-xs text-base-content/40">
                          {transaction.date ? new Date(transaction.date).toLocaleTimeString() : ""}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-base-100 rounded-2xl shadow-2xl max-w-md w-full border border-base-200 overflow-hidden">
            <div className="p-6 border-b border-base-200 bg-gradient-to-r from-red-50 to-rose-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-base-content">Confirm Delete</h3>
                  <p className="text-sm text-base-content/60">This action cannot be undone</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-base-content/70 text-center">
                Are you sure you want to delete <span className="font-semibold text-base-content">"{deleteModal.name}"</span>?
              </p>
            </div>
            <div className="p-6 border-t border-base-200 bg-base-200/30 flex gap-3">
              <button onClick={() => setDeleteModal({ open: false, type: "", id: "", name: "" })} className="btn btn-ghost flex-1">
                Cancel
              </button>
              <button onClick={handleDeleteConfirm} className="btn btn-error text-white flex-1" disabled={actionLoading}>
                {actionLoading ? <span className="loading loading-spinner loading-sm"></span> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {roleModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-base-100 rounded-2xl shadow-2xl max-w-md w-full border border-base-200 overflow-hidden">
            <div className="p-6 border-b border-base-200 bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-base-content">Change Role</h3>
                  <p className="text-sm text-base-content/60">Update user permissions</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-base-content/70 text-center mb-4">
                Change role to <span className="font-semibold text-emerald-600">"{roleModal.newRole}"</span>?
              </p>
            </div>
            <div className="p-6 border-t border-base-200 bg-base-200/30 flex gap-3">
              <button onClick={() => setRoleModal({ open: false, userId: "", newRole: "" })} className="btn btn-ghost flex-1">
                Cancel
              </button>
              <button onClick={handleRoleChange} className="btn btn-success text-white flex-1" disabled={actionLoading}>
                {actionLoading ? <span className="loading loading-spinner loading-sm"></span> : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {statusModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-base-100 rounded-2xl shadow-2xl max-w-md w-full border border-base-200 overflow-hidden">
            <div className="p-6 border-b border-base-200 bg-gradient-to-r from-amber-50 to-yellow-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-base-content">Change Status</h3>
                  <p className="text-sm text-base-content/60">Update ebook visibility</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-base-content/70 text-center">
                {statusModal.currentStatus === "published" || statusModal.currentStatus === "available" || statusModal.currentStatus === "In Stock" ? "Unpublish" : "Publish"} this ebook?
              </p>
            </div>
            <div className="p-6 border-t border-base-200 bg-base-200/30 flex gap-3">
              <button onClick={() => setStatusModal({ open: false, ebookId: "", currentStatus: "" })} className="btn btn-ghost flex-1">
                Cancel
              </button>
              <button onClick={handleStatusToggle} className="btn btn-warning text-white flex-1" disabled={actionLoading}>
                {actionLoading ? <span className="loading loading-spinner loading-sm"></span> : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}