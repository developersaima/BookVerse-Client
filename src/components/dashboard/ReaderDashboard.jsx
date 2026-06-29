"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { 
  FaBookOpen, 
  FaHistory, 
  FaUser, 
  FaBookmark,
  FaEdit,
  FaTimes,
  FaEnvelope,
  FaCalendarAlt,
  FaUserTag,
  FaCheckCircle,
  FaShoppingBag,
  FaCamera,
  FaSpinner,
} from "react-icons/fa";
import { BiHistory } from "react-icons/bi";
import { authClient } from "@/lib/auth-client";

const API_BASE =  process.env.NEXT_PUBLIC_URL;

export default function ReaderDashboard({ activeTab, user: initialUser }) {
  const [data, setData] = useState({ purchases: [], bookmarks: [] });
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    image: "",
  });
  const [updating, setUpdating] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [user, setUser] = useState(initialUser);

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/api/user/dashboard`, {
        headers,
      });
      if (res.ok) {
        const dashboardData = await res.json();
        setData({
          purchases: dashboardData.purchases || [],
          bookmarks: dashboardData.purchasedEbooks || [],
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
      setEditForm({
        name: user.name || "",
        image: user.image || "",
      });
    }
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
        { method: "POST", body: formData }
      );

      if (!res.ok) throw new Error("Image upload failed");

      const data = await res.json();
      if (!data.success) throw new Error("Image upload failed");

      const imageUrl = data.data.url;
      setEditForm({ ...editForm, image: imageUrl });
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

 const handleEditSubmit = async (e) => {
  e.preventDefault();

  if (!editForm.name.trim()) {
    toast.error("Name is required");
    return;
  }

  setUpdating(true);
  try {
    const { error } = await authClient.updateUser({
      name: editForm.name.trim(),
      image: editForm.image || "",
    }, {
      onSuccess: () => {
        toast.success("Profile updated successfully!");
        setIsEditModalOpen(false);
        setUpdating(false);
        
        // Update local user state
        if (user) {
          setUser({ 
            ...user, 
            name: editForm.name.trim(), 
            image: editForm.image || "" 
          });
        }
        
        window.location.reload();
      },
      onError: (ctx) => {
        console.error("Update error:", ctx);
        toast.error(ctx?.error?.message || "Failed to update profile");
        setUpdating(false);
      },
    });

    if (error) {
      console.error("Update error:", error);
      toast.error(error.message || "Failed to update profile");
      setUpdating(false);
    }
  } catch (error) {
    console.error("Update error:", error);
    toast.error(error.message || "Failed to update profile");
    setUpdating(false);
  }
};
  const getUserInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const getInitialAvatar = () => {
    if (user?.image) {
      return (
        <img 
          src={user.image} 
          alt={user.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentElement.innerHTML = `<span class="text-4xl font-bold text-white">${getUserInitials(user?.name)}</span>`;
          }}
        />
      );
    }
    return (
      <span className="text-4xl font-bold text-white">
        {getUserInitials(user?.name)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <span className="loading loading-spinner loading-lg text-emerald-600"></span>
        <p className="text-base-content/60 text-sm">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activeTab === "profile" && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden">
            <div className="relative h-32 bg-gradient-to-r from-emerald-500 to-emerald-600">
              <div className="absolute -bottom-12 left-6">
                <div className="w-24 h-24 rounded-2xl border-4 border-base-100 bg-base-200 flex items-center justify-center shadow-lg overflow-hidden">
                  {getInitialAvatar()}
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute top-4 right-4 btn btn-sm bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
              >
                <FaEdit className="mr-1" /> Edit Profile
              </button>
            </div>

            <div className="pt-14 pb-6 px-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-base-content">{user?.name || "User"}</h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="badge badge-success badge-sm text-white capitalize">{user?.role || "Reader"}</span>
                    <span className="text-xs text-base-content/40">
                      Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                    {user?.emailVerified && (
                      <span className="badge badge-ghost badge-sm gap-1">
                        <FaCheckCircle className="text-emerald-500" /> Verified
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-center px-3 py-2 bg-base-200/50 rounded-xl">
                    <p className="text-2xl font-bold text-base-content">{data.purchases?.length || 0}</p>
                    <p className="text-xs text-base-content/40">Purchases</p>
                  </div>
                  <div className="text-center px-3 py-2 bg-base-200/50 rounded-xl">
                    <p className="text-2xl font-bold text-base-content">{data.bookmarks?.length || 0}</p>
                    <p className="text-xs text-base-content/40">Bookmarks</p>
                  </div>
                </div>
              </div>

              <div className="divider"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-base-200/50">
                    <FaUser className="text-base-content/40 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-base-content/40 font-medium uppercase tracking-wider">Full Name</p>
                      <p className="text-base font-medium text-base-content break-words">{user?.name || "Not set"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-base-200/50">
                    <FaEnvelope className="text-base-content/40 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-base-content/40 font-medium uppercase tracking-wider">Email Address</p>
                      <p className="text-base font-medium text-base-content break-words">{user?.email || "Not set"}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-base-200/50">
                    <FaUserTag className="text-base-content/40 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-base-content/40 font-medium uppercase tracking-wider">Account Type</p>
                      <p className="text-base font-medium text-base-content capitalize">{user?.role || "Reader"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-base-200/50">
                    <FaCalendarAlt className="text-base-content/40 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-base-content/40 font-medium uppercase tracking-wider">Joined</p>
                      <p className="text-base font-medium text-base-content break-words">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }) : "Not available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-base-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
                <BiHistory className="text-emerald-600" /> Purchase History
              </h2>
              <p className="text-sm text-base-content/40">View all your purchased ebooks</p>
            </div>
            <span className="badge badge-ghost">{data.purchases?.length || 0} purchases</span>
          </div>

          {data.purchases?.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-base-200 flex items-center justify-center">
                <FaShoppingBag className="w-10 h-10 text-base-content/30" />
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-2">No purchases yet</h3>
              <p className="text-base-content/60 max-w-md mx-auto">
                Start exploring our collection and purchase your first ebook today!
              </p>
              <Link href="/browse" className="btn btn-success text-white mt-4">
                Browse Ebooks
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-base-200/50">
                    <th>Ebook Name</th>
                    <th>Writer</th>
                    <th className="text-right">Price</th>
                    <th>Purchase Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.purchases.map((purchase, index) => (
                    <tr key={index} className="hover:bg-base-200/30 transition-colors">
                      <td>
                        <div className="flex items-center gap-3">
                          {purchase.coverImage ? (
                            <img 
                              src={purchase.coverImage} 
                              alt={purchase.ebookTitle} 
                              className="w-10 h-14 rounded-lg object-cover border border-base-200"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-10 h-14 rounded-lg bg-base-200 flex items-center justify-center border border-base-200">
                              <FaBookOpen className="w-5 h-5 text-base-content/30" />
                            </div>
                          )}
                          <span className="font-medium text-base-content">{purchase.ebookTitle || "Unknown"}</span>
                        </div>
                      </td>
                      <td>{purchase.writerName || "Unknown"}</td>
                      <td className="text-right font-semibold text-emerald-600">
                        ${purchase.amount?.toFixed(2) || "0.00"}
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <span className="text-sm text-base-content/80">
                            {purchase.date ? new Date(purchase.date).toLocaleDateString() : "N/A"}
                          </span>
                          <span className="text-xs text-base-content/40">
                            {purchase.date ? new Date(purchase.date).toLocaleTimeString() : ""}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-success text-white gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          Purchased
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "ebooks" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-base-content flex items-center gap-2">
                <FaBookOpen className="text-emerald-600" /> Your Library
              </h2>
              <p className="text-sm text-base-content/40">All your purchased ebooks in one place</p>
            </div>
            <span className="badge badge-ghost">{data.purchases?.length || 0} books</span>
          </div>

          {data.purchases?.length === 0 ? (
            <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm p-16 text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-base-200 flex items-center justify-center">
                <FaBookOpen className="w-12 h-12 text-base-content/30" />
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-2">Your library is empty</h3>
              <p className="text-base-content/60 max-w-md mx-auto">
                Purchase ebooks to build your digital library and start reading!
              </p>
              <Link href="/browse" className="btn btn-success text-white mt-4">
                Explore Ebooks
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data.purchases.map((book, index) => (
                <div key={index} className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300 border border-base-200 overflow-hidden group">
                  <figure className="relative aspect-[3/4] overflow-hidden bg-base-200">
                    {book.coverImage ? (
                      <img 
                        src={book.coverImage} 
                        alt={book.ebookTitle} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "/placeholder-cover.jpg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaBookOpen className="w-16 h-16 text-base-content/20" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className="badge badge-success text-white gap-1">
                        <FaCheckCircle className="w-3 h-3" /> Owned
                      </span>
                    </div>
                  </figure>
                  <div className="card-body p-4">
                    <h3 className="card-title text-base font-bold line-clamp-1 text-base-content">
                      {book.ebookTitle || "Unknown Title"}
                    </h3>
                    <p className="text-sm text-base-content/60 line-clamp-1">
                      {book.writerName || "Unknown Author"}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-emerald-600">
                        ${book.amount?.toFixed(2) || "0.00"}
                      </span>
                      <span className="text-xs text-base-content/40">
                        {book.date ? new Date(book.date).toLocaleDateString() : ""}
                      </span>
                    </div>
                    <div className="card-actions mt-3">
                      <Link 
                        href={`/ebooks/${book.ebookId}`} 
                        className="btn btn-success text-white btn-sm w-full group-hover:scale-105 transition-transform"
                      >
                        <FaBookOpen className="mr-1" /> Read Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "bookmarks" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-base-content flex items-center gap-2">
                <FaBookmark className="text-emerald-600" /> Saved Bookmarks
              </h2>
              <p className="text-sm text-base-content/40">Your favorite ebooks collection</p>
            </div>
            <span className="badge badge-ghost">{data.bookmarks?.length || 0} bookmarks</span>
          </div>

          {data.bookmarks?.length === 0 ? (
            <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm p-16 text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-base-200 flex items-center justify-center">
                <FaBookmark className="w-12 h-12 text-base-content/30" />
              </div>
              <h3 className="text-xl font-semibold text-base-content mb-2">No bookmarks yet</h3>
              <p className="text-base-content/60 max-w-md mx-auto">
                Discover ebooks and bookmark your favorites for later reading.
              </p>
              <Link href="/browse" className="btn btn-success text-white mt-4">
                Browse Ebooks
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data.bookmarks.map((book) => (
                <div key={book._id} className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300 border border-base-200 overflow-hidden group">
                  <figure className="relative aspect-[3/4] overflow-hidden bg-base-200">
                    {book.coverImage ? (
                      <img 
                        src={book.coverImage} 
                        alt={book.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "/placeholder-cover.jpg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaBookmark className="w-16 h-16 text-base-content/20" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className="badge badge-primary text-white gap-1">
                        <FaBookmark className="w-3 h-3" /> Saved
                      </span>
                    </div>
                  </figure>
                  <div className="card-body p-4">
                    <h3 className="card-title text-base font-bold line-clamp-1 text-base-content">
                      {book.title || "Unknown Title"}
                    </h3>
                    <p className="text-sm text-base-content/60 line-clamp-1">
                      {book.writerName || "Unknown Author"}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-emerald-600">
                        ${book.price?.toFixed(2) || "0.00"}
                      </span>
                      <span className="badge badge-ghost text-xs">{book.genre || "N/A"}</span>
                    </div>
                    <div className="card-actions mt-3">
                      <Link 
                        href={`/ebooks/${book._id}`} 
                        className="btn btn-outline btn-success btn-sm w-full group-hover:scale-105 transition-transform"
                      >
                        <FaBookOpen className="mr-1" /> View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-base-100 rounded-2xl shadow-2xl max-w-md w-full border border-base-200 overflow-hidden">
            <div className="p-6 border-b border-base-200 flex justify-between items-center bg-gradient-to-r from-emerald-50 to-teal-50">
              <h3 className="text-xl font-bold text-base-content flex items-center gap-2">
                <FaEdit className="text-emerald-600" /> Edit Profile
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="btn btn-ghost btn-sm btn-square"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
              <div className="flex flex-col items-center gap-3">
                <div className="avatar placeholder relative group">
                  <div className="w-24 h-24 rounded-full bg-emerald-600 text-white flex items-center justify-center text-3xl font-bold overflow-hidden">
                    {editForm.image ? (
                      <img 
                        src={editForm.image} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = getUserInitials(editForm.name || user?.name);
                        }}
                      />
                    ) : (
                      getUserInitials(editForm.name || user?.name)
                    )}
                  </div>
                  <label 
                    htmlFor="imageUpload" 
                    className="absolute bottom-0 right-0 btn btn-circle btn-success btn-sm text-white cursor-pointer"
                  >
                    {imageUploading ? <FaSpinner className="animate-spin" /> : <FaCamera />}
                  </label>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={imageUploading}
                  />
                </div>
                <p className="text-xs text-base-content/40">Click the camera icon to upload a new photo</p>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Full Name <span className="text-error">*</span></span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="input input-bordered w-full focus:input-success"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>

              {editForm.image && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Image URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    className="input input-bordered w-full focus:input-success"
                    value={editForm.image}
                    onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  />
                  <label className="label">
                    <span className="label-text-alt text-base-content/40">You can also paste a direct image URL</span>
                  </label>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="btn btn-success text-white flex-1"
                  disabled={updating || imageUploading}
                >
                  {updating ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="mr-2" /> Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}