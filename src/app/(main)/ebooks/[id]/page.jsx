"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import {
  FaArrowLeft,
  FaBookOpen,
  FaUser,
  FaBookmark,
  FaRegBookmark,
  FaLock,
  FaDownload,
  FaShare,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaRegStar,
  FaEye,
  FaCalendarAlt,
  FaTag,
  FaLanguage,
} from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import EbookSkeleton from "@/components/loading/EbookSkeleton";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

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
    throw error;
  }
};

export default function EbookDetailsPage({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [bookmarkPending, setBookmarkPending] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const { data: session, isPending: authPending } = authClient.useSession();
  const currentUser = session?.user;

  // Function to fetch bookmark status
  const fetchBookmarkStatus = async () => {
    if (!currentUser) return;

    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/api/bookmarks`, { headers });

      if (res.ok) {
        const bookmarks = await res.json();
        const isBookmarkedNow =
          Array.isArray(bookmarks) && bookmarks.some((b) => b._id === id);
        setIsBookmarked(isBookmarkedNow);
        return isBookmarkedNow;
      }
    } catch (err) {
      console.error("Error fetching bookmark status:", err);
    }
    return false;
  };

  useEffect(() => {
    if (authPending) return;

    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch ebook details
        const res = await fetch(`${API_BASE}/api/ebooks/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch ebook");
        }
        const data = await res.json();
        if (!data || Object.keys(data).length === 0) {
          setError(true);
          setLoading(false);
          return;
        }
        setEbook(data);

        if (currentUser) {
          try {
            const headers = await getAuthHeaders();

            // Fetch dashboard and bookmarks in parallel
            const [dashboardRes, bookmarksRes] = await Promise.all([
              fetch(`${API_BASE}/api/user/dashboard`, { headers }),
              fetch(`${API_BASE}/api/bookmarks`, { headers }),
            ]);

            let dashboard = {};
            let bookmarks = [];

            if (dashboardRes.ok) {
              dashboard = await dashboardRes.json();
            }

            if (bookmarksRes.ok) {
              bookmarks = await bookmarksRes.json();
            }

            setHasPurchased(
              dashboard?.purchases?.some((p) => p.ebookId === id) || false,
            );
            const isBookmarkedNow =
              Array.isArray(bookmarks) && bookmarks.some((b) => b._id === id);
            setIsBookmarked(isBookmarkedNow);
          } catch (err) {
            console.error("Error fetching user data:", err);
          }
        }
      } catch (err) {
        console.error("Error loading ebook:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, currentUser, authPending]);

  const handleBookmark = async () => {
    if (!currentUser) {
      toast.error("Please login to bookmark this ebook!");
      return router.push("/login");
    }

    try {
      setBookmarkPending(true);
      const headers = await getAuthHeaders();

      const res = await fetch(`${API_BASE}/api/bookmarks/toggle`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ ebookId: id }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update bookmark");
      }

      const data = await res.json();

      // Toggle the bookmark state locally
      const newBookmarkState = !isBookmarked;
      setIsBookmarked(newBookmarkState);

      toast.success(
        data.message === "Added"
          ? "Added to bookmarks!"
          : "Removed from bookmarks!",
      );

      // Fetch fresh bookmark status from server to ensure consistency
      await fetchBookmarkStatus();
    } catch (error) {
      console.error("Bookmark error:", error);
      toast.error(error.message || "Failed to update bookmark.");
    } finally {
      setBookmarkPending(false);
    }
  };

 // handlePurchase

const handlePurchase = async () => {
  // FIRST save ebook data
  localStorage.setItem(
    "checkoutEbook",
    JSON.stringify({
      _id: ebook._id,
      title: ebook.title,
      price: ebook.price,
      writerEmail: ebook.writerEmail,
      writerName: ebook.writerName,
    })
  );

  // THEN stripe request
  const response = await fetch(
    "/api/checkout_sessions",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        ebookId: ebook._id,
      }),
    }
  );

  const data = await response.json();

  window.location.href = data.url;
};
  const handleShare = async () => {
    try {
      await navigator.share({
        title: ebook.title,
        text: `Check out "${ebook.title}" by ${ebook.writerName}`,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading || authPending) return <EbookSkeleton />;

  if (error || !ebook) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col justify-center items-center px-4">
        <div className="text-center space-y-4 max-w-md bg-base-100 p-8 rounded-2xl shadow-xl">
          <div className="text-error text-5xl font-light">!</div>
          <h2 className="text-2xl font-bold text-base-content">
            Ebook Not Found
          </h2>
          <p className="text-base-content/70 text-sm">
            The ebook you are looking for might have been removed.
          </p>
          <Link href="/" className="btn btn-success btn-wide text-white">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isWriter = currentUser?.email === ebook.writerEmail;
  const isSold =
    ebook.status?.toLowerCase() === "sold" || ebook.status === "Sold Out";
  const hasAccess = hasPurchased || isWriter;
  const formattedDate = ebook.createdAt
    ? new Date(ebook.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="btn btn-ghost gap-2 hover:bg-green-50 hover:text-green-700"
          >
            <FaArrowLeft /> Back to Explore
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="btn btn-ghost btn-sm gap-2 hover:bg-green-50 hover:text-green-700"
            >
              <FaShare /> Share
            </button>
            <button
              onClick={handleBookmark}
              disabled={bookmarkPending}
              className={`btn btn-sm gap-2 ${isBookmarked ? "btn-success text-white" : "btn-ghost hover:bg-green-50 hover:text-green-700"}`}
            >
              {bookmarkPending ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : isBookmarked ? (
                <FaBookmark />
              ) : (
                <FaRegBookmark />
              )}
              {bookmarkPending
                ? "Processing..."
                : isBookmarked
                  ? "Bookmarked"
                  : "Bookmark"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="card bg-base-100 shadow-xl overflow-hidden sticky top-24">
              <figure className="relative aspect-[3/4] bg-base-200">
                <img
                  src={
                    ebook.coverImage || ebook.image || "/placeholder-cover.jpg"
                  }
                  alt={ebook.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder-cover.jpg";
                  }}
                />
                {isSold && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                    <span className="badge badge-error gap-2 text-lg font-bold px-6 py-4">
                      Sold Out
                    </span>
                  </div>
                )}
                {!isSold && (
                  <div className="absolute top-4 left-4">
                    <span className="badge badge-success gap-1 text-white">
                      <FaEye /> Available
                    </span>
                  </div>
                )}
              </figure>
              <div className="card-body p-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-base-200 rounded-lg p-3 text-center">
                    <span className="block text-xs text-base-content/60 font-medium uppercase tracking-wider">
                      Status
                    </span>
                    <span
                      className={`font-bold ${isSold ? "text-error" : "text-success"}`}
                    >
                      {isSold ? "Sold Out" : "In Stock"}
                    </span>
                  </div>
                  <div className="bg-base-200 rounded-lg p-3 text-center">
                    <span className="block text-xs text-base-content/60 font-medium uppercase tracking-wider">
                      Format
                    </span>
                    <span className="font-bold text-base-content">Digital</span>
                  </div>
                  <div className="bg-base-200 rounded-lg p-3 text-center">
                    <span className="block text-xs text-base-content/60 font-medium uppercase tracking-wider">
                      Pages
                    </span>
                    <span className="font-bold text-base-content">
                      {ebook.pageCount || "N/A"}
                    </span>
                  </div>
                  <div className="bg-base-200 rounded-lg p-3 text-center">
                    <span className="block text-xs text-base-content/60 font-medium uppercase tracking-wider">
                      Language
                    </span>
                    <span className="font-bold text-base-content">
                      {ebook.language || "English"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 xl:col-span-9">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="badge badge-success gap-1 text-white">
                        <BiCategory /> {ebook.genre}
                      </span>
                      {ebook.isbn && (
                        <span className="badge badge-ghost gap-1">
                          <FaTag /> ISBN: {ebook.isbn}
                        </span>
                      )}
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-base-content leading-tight">
                      {ebook.title}
                    </h1>

                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center">
                          <span className="text-sm font-bold">
                            {ebook.writerName?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <Link
                          href={`/browse?search=${encodeURIComponent(ebook.writerName)}`}
                          className="font-semibold text-base-content hover:text-green-700 transition-colors"
                        >
                          {ebook.writerName}
                        </Link>
                        <p className="text-xs text-base-content/60">Author</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="btn btn-ghost btn-sm gap-2 hover:bg-green-50 hover:text-green-700">
                      <FaRegStar /> Rate
                    </button>
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className="btn btn-ghost btn-sm gap-2 hover:bg-green-50 hover:text-green-700"
                    >
                      {isLiked ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 py-2 text-sm text-base-content/60">
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt /> {formattedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaEye /> 1.2k views
                  </span>
                  <span className="flex items-center gap-1">
                    <FaStar className="text-yellow-500" /> 4.5 (24 ratings)
                  </span>
                </div>

                <div className="divider"></div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/60 mb-3">
                    Description
                  </h3>
                  <div className="relative bg-base-200 rounded-xl p-5">
                    <p className="text-base-content/80 leading-relaxed whitespace-pre-wrap">
                      {ebook.description}
                    </p>
                    {!hasAccess && (
                      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-base-200 to-transparent flex items-end justify-center pb-3">
                        <span className="text-xs font-semibold text-base-content/70 bg-base-100 px-4 py-2 rounded-full border shadow-sm flex items-center gap-2">
                          <FaLock size={12} /> Purchase to unlock full content
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {ebook.language && (
                  <div className="flex items-center gap-2 text-sm">
                    <FaLanguage className="text-base-content/60" />
                    <span className="text-base-content/70">
                      Language:{" "}
                      <span className="font-medium text-base-content">
                        {ebook.language}
                      </span>
                    </span>
                  </div>
                )}

                <div className="divider"></div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-green-50 rounded-2xl p-6 border border-green-100">
                  <div>
                    <span className="block text-xs font-semibold text-green-700 uppercase tracking-wider">
                      Price
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-green-700">
                        ${ebook.price}
                      </span>
                      {ebook.originalPrice && (
                        <span className="text-sm text-base-content/40 line-through">
                          ${ebook.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {hasPurchased && (
                      <button className="btn btn-success gap-2 flex-1 sm:flex-none text-white">
                        <FaDownload /> Download Now
                      </button>
                    )}

                    {isWriter && (
                      <button
                        className="btn btn-ghost gap-2 flex-1 sm:flex-none text-green-600 border-green-200 hover:bg-green-50"
                        disabled
                      >
                        <FaBookOpen /> Your Ebook
                      </button>
                    )}

                    {!hasPurchased && !isWriter && (
                      <button
                        onClick={handlePurchase}
                        disabled={isSold}
                        className={`btn btn-success gap-2 flex-1 sm:flex-none min-w-[200px] text-white ${isSold ? "btn-disabled" : "hover:bg-green-700"}`}
                      >
                        <FaBookOpen /> {isSold ? "Sold Out" : "Purchase Now"}
                      </button>
                    )}

                    {!hasPurchased && !isWriter && !isSold && (
                      <button
                        onClick={handleBookmark}
                        disabled={bookmarkPending}
                        className={`btn btn-outline gap-2 flex-1 sm:flex-none ${isBookmarked ? "btn-success text-white" : "hover:bg-green-50 hover:text-green-700"}`}
                      >
                        {bookmarkPending ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : isBookmarked ? (
                          <FaBookmark />
                        ) : (
                          <FaRegBookmark />
                        )}
                        {bookmarkPending
                          ? "Processing..."
                          : isBookmarked
                            ? "Bookmarked"
                            : "Save"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-base-content/40">
                  <span className="flex items-center gap-1">
                    <span className="text-green-600">✓</span> Secure transaction
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="text-green-600">✓</span> Instant access
                    after purchase
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="text-green-600">✓</span> 30-day money back
                    guarantee
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
