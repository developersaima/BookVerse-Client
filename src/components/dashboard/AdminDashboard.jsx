"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminDashboard({ activeTab }) {
  const [metrics, setMetrics] = useState({ totalUsers: 0, totalWriters: 0, totalSold: 0, totalRevenue: 0 });
  const [users, setUsers] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard-data`)
      .then((res) => res.json())
      .then((d) => {
        setMetrics(d.metrics);
        setUsers(d.users || []);
        setEbooks(d.ebooks || []);
        setTransactions(d.transactions || []);
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/role/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) toast.success("Role updated successfully!");
    } catch {
      toast.error("Failed to update role");
    }
  };

  const handleUserDelete = async (id) => {
    if (!confirm("Delete user accounts instantly?")) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/delete/${id}`, { method: "DELETE" });
      window.location.reload();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleToggleEbookStatus = async (id, currentStatus) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/ebooks/toggle/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: currentStatus === "published" ? "unpublished" : "published" })
      });
      window.location.reload();
    } catch {
      toast.error("Failed to alter status");
    }
  };

  if (loading) return <div className="loading loading-spinner text-emerald-600 block mx-auto my-20"></div>;

  return (
    <div className="space-y-6">
      {activeTab === "home" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
              <span className="text-slate-500 text-sm font-semibold">Total Readers</span>
              <h3 className="text-3xl font-black text-slate-800 mt-1">{metrics.totalUsers}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
              <span className="text-slate-500 text-sm font-semibold">Total Writers</span>
              <h3 className="text-3xl font-black text-slate-800 mt-1">{metrics.totalWriters}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
              <span className="text-slate-500 text-sm font-semibold">Ebooks Sold</span>
              <h3 className="text-3xl font-black text-emerald-600 mt-1">{metrics.totalSold}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
              <span className="text-slate-500 text-sm font-semibold">Gross Revenue</span>
              <h3 className="text-3xl font-black text-slate-800 mt-1">${metrics.totalRevenue}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs h-64 flex items-center justify-center text-slate-400">
              [Monthly Sales Trend Chart Container Placeholder]
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs h-64 flex items-center justify-center text-slate-400">
              [Genre Distribution Pie Chart Container Placeholder]
            </div>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100"><h2 className="text-xl font-bold text-slate-800">User Directory Control</h2></div>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="font-semibold">{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <select defaultValue={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)} className="select select-bordered select-xs">
                        <option value="reader">Reader</option>
                        <option value="writer">Writer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => handleUserDelete(u._id)} className="btn btn-xs btn-error text-white">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "ebooks" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100"><h2 className="text-xl font-bold text-slate-800">Global Book Management</h2></div>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th>Title</th>
                  <th>Writer</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ebooks.map((b) => (
                  <tr key={b._id}>
                    <td className="font-bold">{b.title}</td>
                    <td>{b.writerName}</td>
                    <td>${b.price}</td>
                    <td><span className={`badge text-white ${b.status === "published" ? "badge-success" : "badge-warning"}`}>{b.status}</span></td>
                    <td className="space-x-2">
                      <button onClick={() => handleToggleEbookStatus(b._id, b.status)} className="btn btn-xs btn-neutral">{b.status === "published" ? "Unpublish" : "Publish"}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "transactions" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100"><h2 className="text-xl font-bold text-slate-800">Master Transaction Ledger</h2></div>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th>Transaction ID</th>
                  <th>Type</th>
                  <th>User Email</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td className="font-mono text-xs text-slate-600">{t.id}</td>
                    <td className="capitalize font-semibold">{t.type}</td>
                    <td>{t.email}</td>
                    <td className="font-bold text-slate-800">${t.amount}</td>
                    <td>{new Date(t.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}