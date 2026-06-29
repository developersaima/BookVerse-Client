"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { FaBook, FaPlusCircle, FaDollarSign, FaBookmark } from "react-icons/fa";

export default function WriterDashboard({ user }) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "manage";
  
  const [allEbooks, setAllEbooks] = useState([]);
  const [writerEbooks, setWriterEbooks] = useState([]);
  const [sales, setSales] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    id: "",
    title: "",
    description: "",
    price: "",
    genre: "",
    coverImage: "",
    language: "",
    isbn: "",
    pageCount: "",
  });
  const [imgUploading, setImgUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const getAuthHeaders = async () => {
    try {
      const { data: tokenData } = await authClient.token();
      if (!tokenData?.token) {
        throw new Error("No authentication token found");
      }
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenData.token}`,
      };
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("Authentication failed. Please login again.");
      throw error;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeaders();
      
      console.log("Fetching all ebooks...");
      
      // Fetch all ebooks
      const ebooksRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ebooks`, {
        headers,
        method: "GET",
      });

      console.log("Ebooks response status:", ebooksRes.status);
      
      if (!ebooksRes.ok) {
        const errorText = await ebooksRes.text();
        console.error("Ebooks fetch error:", errorText);
        throw new Error(`Failed to fetch ebooks: ${ebooksRes.status}`);
      }

      const ebooksData = await ebooksRes.json();
      console.log("All ebooks data:", ebooksData);
      
      // Get all ebooks from response
      let allEbooksList = [];
      if (Array.isArray(ebooksData)) {
        allEbooksList = ebooksData;
      } else if (ebooksData.data && Array.isArray(ebooksData.data)) {
        allEbooksList = ebooksData.data;
      } else if (ebooksData.ebooks && Array.isArray(ebooksData.ebooks)) {
        allEbooksList = ebooksData.ebooks;
      } else {
        allEbooksList = [];
        console.warn("Unexpected ebooks response format:", ebooksData);
      }

      setAllEbooks(allEbooksList);

      // Filter ebooks for current writer
      console.log("Current user email:", user?.email);
      console.log("Current user name:", user?.name);
      
      const filteredEbooks = allEbooksList.filter(ebook => {
        const emailMatch = ebook.writerEmail === user?.email;
        const nameMatch = ebook.writerName === user?.name;
        const hasWriterEmail = ebook.writerEmail;
        
        console.log(`Ebook "${ebook.title}":`, {
          ebookWriterEmail: ebook.writerEmail,
          userEmail: user?.email,
          emailMatch,
          nameMatch,
          hasWriterEmail
        });
        
        return emailMatch || (nameMatch && !hasWriterEmail);
      });

      console.log("Filtered ebooks for writer:", filteredEbooks);
      setWriterEbooks(filteredEbooks);

      // Fetch sales
      try {
        const salesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/writer/sales`, {
          headers,
          method: "GET",
        });
        
        if (salesRes.ok) {
          const salesData = await salesRes.json();
          setSales(Array.isArray(salesData) ? salesData : []);
        } else {
          console.warn("Sales fetch failed:", salesRes.status);
          setSales([]);
        }
      } catch (err) {
        console.warn("Sales fetch error:", err);
        setSales([]);
      }

      // Fetch bookmarks with proper authentication
      try {
        console.log("Fetching bookmarks...");
        const bookmarksRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookmarks`, {
          headers,
          method: "GET",
        });
        
        console.log("Bookmarks response status:", bookmarksRes.status);
        
        if (bookmarksRes.ok) {
          const bookmarksData = await bookmarksRes.json();
          console.log("Bookmarks data received:", bookmarksData);
          setBookmarks(Array.isArray(bookmarksData) ? bookmarksData : []);
        } else {
          const errorText = await bookmarksRes.text();
          console.error("Bookmarks fetch error:", errorText);
          setBookmarks([]);
        }
      } catch (err) {
        console.warn("Bookmarks fetch error:", err);
        setBookmarks([]);
      }

    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message || "Failed to load data");
      toast.error(error.message || "Failed to load dashboard data");
      setWriterEbooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImgUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
        { method: "POST", body: formData }
      );
      if (!res.ok) {
        throw new Error("Image upload failed");
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error("Image upload failed");
      }
      setForm({ ...form, coverImage: data.data.url });
      toast.success("Cover image uploaded successfully!");
    } catch (error) {
      toast.error(error.message || "Image upload failed");
    } finally {
      setImgUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!form.price || parseFloat(form.price) < 0) {
      toast.error("Valid price is required");
      return;
    }
    if (!form.genre) {
      toast.error("Genre is required");
      return;
    }

    setSubmitting(true);
    const url = form.id ? `/api/ebooks/${form.id}` : "/api/ebooks";
    const method = form.id ? "PUT" : "POST";

    try {
      const headers = await getAuthHeaders();
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        genre: form.genre,
        coverImage: form.coverImage || "",
        language: form.language || "",
        isbn: form.isbn || "",
        pageCount: form.pageCount ? parseInt(form.pageCount) : 0,
        writerEmail: user?.email,
        writerName: user?.name,
      };

      console.log(`Submitting ${method} request to ${url}`, payload);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${form.id ? "update" : "add"} ebook`);
      }

      const result = await res.json();
      console.log("Submit success:", result);
      
      toast.success(form.id ? "Ebook updated successfully!" : "Ebook published successfully!");
      resetForm();
      await fetchData();
      
      // Navigate back to manage tab
      const urlObj = new URL(window.location.href);
      urlObj.searchParams.set("tab", "manage");
      window.history.pushState({}, "", urlObj);
      
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.message || "Action failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ebooks/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete ebook");
      }

      toast.success(`"${title}" deleted successfully!`);
      await fetchData();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || "Delete failed");
    }
  };

  const handleEdit = (ebook) => {
    setForm({
      id: ebook._id,
      title: ebook.title || "",
      description: ebook.description || "",
      price: ebook.price || "",
      genre: ebook.genre || "",
      coverImage: ebook.coverImage || "",
      language: ebook.language || "",
      isbn: ebook.isbn || "",
      pageCount: ebook.pageCount || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    const url = new URL(window.location.href);
    url.searchParams.set("tab", "add");
    window.history.pushState({}, "", url);
  };

  const resetForm = () => {
    setForm({
      id: "",
      title: "",
      description: "",
      price: "",
      genre: "",
      coverImage: "",
      language: "",
      isbn: "",
      pageCount: "",
    });
  };

  const handleRemoveBookmark = async (ebookId) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookmarks/toggle`, {
        method: "POST",
        headers,
        body: JSON.stringify({ ebookId }),
      });

      if (!res.ok) {
        throw new Error("Failed to remove bookmark");
      }

      const data = await res.json();
      toast.success("Bookmark removed!");
      // Refresh bookmarks
      await fetchData();
    } catch (error) {
      console.error("Remove bookmark error:", error);
      toast.error(error.message || "Failed to remove bookmark");
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      "available": { color: "success", label: "Available" },
      "In Stock": { color: "success", label: "In Stock" },
      "sold": { color: "error", label: "Sold Out" },
      "Sold Out": { color: "error", label: "Sold Out" },
    };
    const mapped = statusMap[status] || { color: "warning", label: status || "Unknown" };
    return <span className={`badge badge-${mapped.color} font-medium`}>{mapped.label}</span>;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <span className="loading loading-spinner loading-lg text-green-600"></span>
        <p className="text-gray-500">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="alert alert-error max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Error: {error}</span>
        </div>
        <button onClick={fetchData} className="btn btn-success text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Manage Tab - My Ebooks */}
      {activeTab === "manage" && (
        <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-base-200 flex justify-between items-center bg-gradient-to-r from-base-200 to-green-50/30">
            <div>
              <h2 className="text-lg font-semibold text-base-content flex items-center gap-2">
                <FaBook className="text-green-600" />
                My Ebooks
              </h2>
              <p className="text-sm text-base-content/60">Manage your published ebooks</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="badge badge-ghost">{writerEbooks.length} ebooks</span>
              <button
                onClick={() => {
                  resetForm();
                  const url = new URL(window.location.href);
                  url.searchParams.set("tab", "add");
                  window.history.pushState({}, "", url);
                }}
                className="btn btn-sm btn-success text-white"
              >
                <FaPlusCircle className="mr-1" /> Add New
              </button>
            </div>
          </div>

          {writerEbooks.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-2">No ebooks yet</h3>
              <p className="text-base-content/60 mb-6 max-w-md mx-auto">
                Start your writing journey by publishing your first ebook. Your readers are waiting!
              </p>
              <button
                onClick={() => {
                  resetForm();
                  const url = new URL(window.location.href);
                  url.searchParams.set("tab", "add");
                  window.history.pushState({}, "", url);
                }}
                className="btn btn-success text-white"
              >
                <FaPlusCircle className="mr-2" />
                Add Your First Ebook
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th className="w-16">Cover</th>
                    <th>Title</th>
                    <th>Genre</th>
                    <th className="text-right">Price</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {writerEbooks.map((ebook) => (
                    <tr key={ebook._id}>
                      <td>
                        {ebook.coverImage ? (
                          <img
                            src={ebook.coverImage}
                            alt={ebook.title}
                            className="w-12 h-16 rounded-lg object-cover border border-base-200"
                          />
                        ) : (
                          <div className="w-12 h-16 rounded-lg bg-base-200 flex items-center justify-center border border-base-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="font-medium">{ebook.title}</div>
                        <div className="text-xs text-base-content/60 truncate max-w-xs">{ebook.description}</div>
                      </td>
                      <td>
                        <span className="badge badge-ghost">{ebook.genre}</span>
                      </td>
                      <td className="text-right font-semibold text-green-600">
                        ${parseFloat(ebook.price).toFixed(2)}
                      </td>
                      <td>{getStatusBadge(ebook.status)}</td>
                      <td>
                        <div className="flex gap-1 justify-center">
                          <button
                            onClick={() => handleEdit(ebook)}
                            className="btn btn-sm btn-ghost text-blue-600 hover:bg-blue-50"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(ebook._id, ebook.title)}
                            className="btn btn-sm btn-ghost text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          <Link
                            href={`/ebooks/${ebook._id}`}
                            className="btn btn-sm btn-ghost text-green-600 hover:bg-green-50"
                            title="View"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Tab */}
      {activeTab === "add" && (
        <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-base-200 bg-gradient-to-r from-green-50 to-teal-50">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
                {form.id ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Ebook
                  </>
                ) : (
                  <>
                    <FaPlusCircle className="text-green-600" />
                    Add New Ebook
                  </>
                )}
              </h2>
              {form.id && (
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    const url = new URL(window.location.href);
                    url.searchParams.set("tab", "manage");
                    window.history.pushState({}, "", url);
                  }}
                  className="btn btn-ghost btn-sm"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Title <span className="text-error">*</span></span>
                </label>
                <input
                  type="text"
                  placeholder="Enter ebook title"
                  required
                  className="input input-bordered w-full focus:input-success"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Genre <span className="text-error">*</span></span>
                </label>
                <select
                  className="select select-bordered w-full focus:select-success"
                  required
                  value={form.genre}
                  onChange={(e) => setForm({ ...form, genre: e.target.value })}
                >
                  <option value="">Select Genre</option>
                  <option value="fiction">Fiction</option>
                  <option value="non-fiction">Non-Fiction</option>
                  <option value="sci-fi">Sci-Fi</option>
                  <option value="fantasy">Fantasy</option>
                  <option value="mystery">Mystery</option>
                  <option value="romance">Romance</option>
                  <option value="thriller">Thriller</option>
                  <option value="horror">Horror</option>
                  <option value="technical">Technical</option>
                  <option value="academic">Academic</option>
                  <option value="children">Children</option>
                  <option value="comics">Comics</option>
                  <option value="history">History</option>
                  <option value="philosophy">Philosophy</option>
                  <option value="psychology">Psychology</option>
                  <option value="self-help">Self-Help</option>
                  <option value="business">Business</option>
                  <option value="science">Science</option>
                  <option value="health">Health</option>
                  <option value="cooking">Cooking</option>
                  <option value="travel">Travel</option>
                  <option value="art">Art</option>
                  <option value="poetry">Poetry</option>
                  <option value="drama">Drama</option>
                  <option value="biography">Biography</option>
                  <option value="memoir">Memoir</option>
                  <option value="essays">Essays</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Price <span className="text-error">*</span></span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required
                  className="input input-bordered w-full focus:input-success"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Language</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., English"
                  className="input input-bordered w-full focus:input-success"
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">ISBN</span>
                </label>
                <input
                  type="text"
                  placeholder="ISBN number"
                  className="input input-bordered w-full focus:input-success"
                  value={form.isbn}
                  onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Page Count</span>
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Number of pages"
                  className="input input-bordered w-full focus:input-success"
                  value={form.pageCount}
                  onChange={(e) => setForm({ ...form, pageCount: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Description <span className="text-error">*</span></span>
              </label>
              <textarea
                placeholder="Write a detailed description of your ebook"
                required
                className="textarea textarea-bordered w-full h-32 focus:textarea-success"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Cover Image</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full sm:flex-1"
                  onChange={handleImgUpload}
                  disabled={imgUploading}
                />
                {imgUploading && (
                  <span className="loading loading-spinner loading-sm text-green-600"></span>
                )}
                {form.coverImage && (
                  <div className="flex items-center gap-3">
                    <img
                      src={form.coverImage}
                      alt="Cover preview"
                      className="w-16 h-20 object-cover rounded border border-base-200 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, coverImage: "" })}
                      className="btn btn-ghost btn-xs text-error"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-base-200 flex gap-3">
              <button
                type="submit"
                className="btn btn-success text-white flex-1"
                disabled={submitting || imgUploading}
              >
                {submitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    {form.id ? "Updating..." : "Publishing..."}
                  </>
                ) : imgUploading ? (
                  <>
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Uploading Image...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {form.id ? "Update Ebook" : "Publish Ebook"}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  const url = new URL(window.location.href);
                  url.searchParams.set("tab", "manage");
                  window.history.pushState({}, "", url);
                }}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sales Tab */}
      {activeTab === "sales" && (
        <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-base-200 flex justify-between items-center bg-gradient-to-r from-amber-50 to-yellow-50/30">
            <div>
              <h2 className="text-lg font-semibold text-base-content flex items-center gap-2">
                <FaDollarSign className="text-amber-600" />
                Sales History
              </h2>
              <p className="text-sm text-base-content/60">Track your ebook sales and revenue</p>
            </div>
            <span className="badge badge-ghost">{sales.length} transactions</span>
          </div>

          {sales.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-2">No sales yet</h3>
              <p className="text-base-content/60 max-w-md mx-auto">
                Once readers purchase your ebooks, you'll see the sales history here.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Ebook</th>
                      <th>Buyer</th>
                      <th>Date</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale, index) => (
                      <tr key={index}>
                        <td>
                          <div className="font-medium">{sale.ebookTitle}</div>
                          <div className="text-xs text-base-content/60">ID: {sale.transactionId}</div>
                        </td>
                        <td>
                          <div className="font-medium">{sale.buyerName}</div>
                          <div className="text-xs text-base-content/60">{sale.buyerEmail}</div>
                        </td>
                        <td>
                          {new Date(sale.date).toLocaleDateString()} 
                          <span className="text-xs text-base-content/60 block">{new Date(sale.date).toLocaleTimeString()}</span>
                        </td>
                        <td className="text-right font-semibold text-green-600">
                          ${parseFloat(sale.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-base-200 bg-base-200/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-base-content/60">Total Revenue</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${sales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Bookmarks Tab */}
      {activeTab === "bookmarks" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
              <FaBookmark className="text-purple-600" />
              Bookmarked Ebooks
            </h2>
            <span className="badge badge-ghost">{bookmarks.length} bookmarks</span>
          </div>
          
          {bookmarks.length === 0 ? (
            <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-2">No bookmarks yet</h3>
              <p className="text-base-content/60 mb-6">Discover ebooks and bookmark your favorites for later reading.</p>
              <Link href="/browse" className="btn btn-success text-white">
                Browse Ebooks
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bookmarks.map((ebook) => (
                <div key={ebook._id} className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow border border-base-200 overflow-hidden">
                  <figure className="h-52 overflow-hidden relative">
                    <img
                      src={ebook.coverImage || "/placeholder-cover.jpg"}
                      alt={ebook.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "/placeholder-cover.jpg";
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span className="badge badge-ghost bg-base-100/90">{ebook.genre}</span>
                    </div>
                    <button
                      className="absolute top-2 left-2 btn btn-ghost btn-xs bg-base-100/90 hover:bg-base-100"
                      onClick={() => handleRemoveBookmark(ebook._id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                    </button>
                  </figure>
                  <div className="card-body p-4">
                    <h3 className="card-title text-base font-bold line-clamp-1">{ebook.title}</h3>
                    <p className="text-sm text-base-content/60 line-clamp-2 h-10">{ebook.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xl font-bold text-green-600">${parseFloat(ebook.price).toFixed(2)}</span>
                      <span className="badge badge-ghost">{ebook.writerName || "Unknown Author"}</span>
                    </div>
                    <div className="card-actions mt-3">
                      <Link href={`/ebooks/${ebook._id}`} className="btn btn-success text-white btn-sm w-full">
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}