"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaBookOpen, FaHistory, FaUser, FaBookmark } from "react-icons/fa6";
import { BiHistory } from "react-icons/bi";

export default function ReaderDashboard({ activeTab, user }) {
  const [data, setData] = useState({ purchases: [], bookmarks: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/dashboard-data`)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading loading-spinner text-emerald-600 block mx-auto my-20"></div>;

  return (
    <div className="space-y-6">
      {activeTab === "profile" && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs max-w-2xl">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><FaUser /> Profile Info</h2>
          <div className="space-y-3">
            <p><span className="font-semibold text-slate-500">Name:</span> {user.name}</p>
            <p><span className="font-semibold text-slate-500">Email:</span> {user.email}</p>
            <p><span className="font-semibold text-slate-500">Account Type:</span> Reader</p>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100"><h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><BiHistory /> Purchase History</h2></div>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th>Ebook Name</th>
                  <th>Writer</th>
                  <th>Price</th>
                  <th>Purchase Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.purchases.map((p, i) => (
                  <tr key={i}>
                    <td className="font-bold">{p.ebookName}</td>
                    <td>{p.writerName}</td>
                    <td>${p.price}</td>
                    <td>{new Date(p.date).toLocaleDateString()}</td>
                    <td><span className="badge badge-success text-white">{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "ebooks" && (
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><FaBookOpen /> Your Library</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.purchases.map((book, i) => (
              <div key={i} className="bg-white border rounded-2xl overflow-hidden shadow-xs">
                <img src={book.coverImage} alt={book.title} className="w-full aspect-[3/4] object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-slate-800 line-clamp-1">{book.title}</h3>
                  <Link href={`/ebooks/${book.ebookId}`} className="btn btn-sm btn-emerald w-full mt-3 text-white">Read Details</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "bookmarks" && (
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><FaBookmark /> Saved Bookmarks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.bookmarks.map((book, i) => (
              <div key={i} className="bg-white border rounded-2xl overflow-hidden shadow-xs">
                <img src={book.coverImage} alt={book.title} className="w-full aspect-[3/4] object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-slate-800 line-clamp-1">{book.title}</h3>
                  <Link href={`/ebooks/${book._id}`} className="btn btn-sm btn-outline btn-emerald w-full mt-3">View Ebook</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}