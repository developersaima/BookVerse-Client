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
} from "react-icons/fa6";
import { BiCategory } from "react-icons/bi";
import EbookSkeleton from "@/components/loading/EbookSkeleton";
import { FaRegCalendar, FaRegCheckCircle } from "react-icons/fa";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const fetchApi = async (endpoint, options = {}) => {
  const res = await fetch(`${API_BASE}${endpoint}`, options);
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
};

const ActionButton = ({ condition, text, onClick, disabled = false, icon: Icon, className = "" }) => {
  if (!condition) return null;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full sm:w-auto px-6 py-3.5 font-bold rounded-xl flex items-center justify-center gap-2 text-sm md:text-base transition-all active:scale-[0.98] ${className}`}
    >
      {Icon && <Icon />} {text}
    </button>
  );
};

const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${className}`}>
    {children}
  </span>
);

export default function EbookDetailsPage({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [bookmarkPending, setBookmarkPending] = useState(false);

  const { data: session, isPending: authPending } = authClient.useSession();
  const currentUser = session?.user;

  useEffect(() => {
    if (authPending) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchApi(`/api/ebooks/${id}`);
        if (!data || Object.keys(data).length === 0) return setError(true);
        setEbook(data);

        if (currentUser) {
          const [dashboard, bookmarks] = await Promise.all([
            fetchApi("/api/user/dashboard").catch(() => ({})),
            fetchApi("/api/bookmarks").catch(() => [])
          ]);
          setHasPurchased(dashboard?.purchases?.some(p => p.ebookId === id) || false);
          setIsBookmarked(bookmarks?.some(b => b._id === id) || false);
        }
      } catch (err) {
        setError(true);
      } {
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
      const data = await fetchApi("/api/bookmarks/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ebookId: id }),
      });
      setIsBookmarked(!isBookmarked);
      toast.success(data.message === "Added" ? "Added to bookmarks!" : "Removed from bookmarks!");
    } catch {
      toast.error("Failed to update bookmark.");
    } finally {
      setBookmarkPending(false);
    }
  };

  const handlePurchase = async () => {
    if (!currentUser) {
      toast.error("Please login to purchase this ebook!");
      return router.push("/login");
    }
    if (currentUser.email === ebook?.writerEmail) {
      return toast.error("Writers cannot purchase their own ebooks!");
    }
    window.location.href = `/api/checkout-session?ebookId=${id}`;
  };

  if (loading || authPending) return <EbookSkeleton />;

  if (error || !ebook) {
    return (
      <div className="min-h-screen bg-green-50/40 flex flex-col justify-center items-center px-4">
        <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-2xl shadow-xl border border-red-100">
          <div className="text-red-500 text-5xl font-light">!</div>
          <h2 className="text-2xl font-bold text-green-950">Ebook Not Found</h2>
          <p className="text-green-700 text-sm">The ebook you are looking for might have been removed.</p>
          <Link href="/" className="bg-green-600 hover:bg-green-700 text-white inline-block px-6 py-2.5 rounded-xl font-medium">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isWriter = currentUser?.email === ebook.writerEmail;
  const isSold = ebook.status?.toLowerCase() === "sold";
  const hasAccess = hasPurchased || isWriter;
  const formattedDate = ebook.createdAt 
    ? new Date(ebook.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) 
    : new Date().toLocaleDateString();

  return (
    <div className="min-h-screen  py-8 px-4 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-green-700 hover:text-green-950 font-semibold text-sm group">
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Explore
          </Link>
          <button
            onClick={handleBookmark}
            disabled={bookmarkPending}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              isBookmarked ? "bg-green-600 text-white border-green-600 shadow-md shadow-green-600/10" : "bg-white text-green-800 border-green-200 hover:bg-green-50"
            }`}
          >
            {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
            {isBookmarked ? "Bookmarked" : "Bookmark Later"}
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-green-100 overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-10">
          
          <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center">
            <div className="w-full aspect-[3/4] max-w-[320px] rounded-2xl overflow-hidden shadow-2xl border border-green-100 relative group bg-green-50">
              <img src={ebook.coverImage || ebook.image} alt={ebook.title} className="w-full h-full object-cover" />
              {isSold && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                  <span className="bg-amber-500 text-white font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider">Sold Out</span>
                </div>
              )}
            </div>
            <div className="w-full max-w-[320px] grid grid-cols-2 gap-3 mt-6">
              <div className="bg-green-50/60 border border-green-100/80 rounded-xl p-3 text-center">
                <span className="block text-[10px] text-green-600 font-bold uppercase tracking-wider mb-0.5">Status</span>
                <span className={`font-bold text-xs uppercase ${isSold ? "text-amber-600" : "text-emerald-600"}`}>
                  {isSold ? "Sold" : "Available"}
                </span>
              </div>
              <div className="bg-green-50/60 border border-green-100/80 rounded-xl p-3 text-center">
                <span className="block text-[10px] text-green-600 font-bold uppercase tracking-wider mb-0.5">Format</span>
                <span className="font-bold text-green-900 text-xs">Digital PDF</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <BiCategory size={14} /> {ebook.genre}
              </Badge>

              <div className="space-y-1">
                <h1 className="text-2xl md:text-4xl font-extrabold text-green-950 leading-tight">{ebook.title}</h1>
                <p className="text-sm md:text-base text-green-700 font-medium inline-flex items-center gap-1.5">
                  <FaUser size={13} className="text-green-600" /> By{" "}
                  <Link href={`/browse?search=${encodeURIComponent(ebook.writerName)}`} className="text-green-600 font-bold hover:text-green-800 hover:underline">
                    {ebook.writerName}
                  </Link>
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-green-900">Ebook Description</h3>
                <div className="relative bg-green-50/30 rounded-2xl p-4 border border-green-100/50">
                  <p className="text-green-800/90 text-sm md:text-base leading-relaxed">{ebook.description}</p>
                  {!hasAccess && (
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent flex items-end justify-center pb-2">
                      <span className="text-xs font-semibold text-green-700 bg-white px-3 py-1.5 rounded-full border border-green-100 shadow-sm flex items-center gap-1">
                        <FaLock size={11} /> Purchase to unlock full content
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-xs text-green-600 font-medium flex items-center gap-1.5 pt-1">
                <FaRegCalendar /> Uploaded on: {formattedDate}
              </div>
            </div>

            <div className="bg-green-50/60 border border-green-100/80 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="block text-xs font-semibold text-green-700 uppercase tracking-wider mb-0.5">Price</span>
                <span className="text-3xl font-black text-green-950">${ebook.price}</span>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <ActionButton 
                  condition={hasPurchased} 
                  text="Already Purchased" 
                  icon={FaRegCheckCircle} 
                  className="bg-emerald-600 text-white shadow-md shadow-emerald-600/10" 
                />
                <ActionButton 
                  condition={!hasPurchased && isWriter} 
                  text="Your Own Ebook" 
                  disabled={true} 
                  className="bg-green-300 text-green-700 cursor-not-allowed" 
                />
                <ActionButton 
                  condition={!hasPurchased && !isWriter} 
                  text="Purchase Access" 
                  onClick={handlePurchase} 
                  disabled={isSold} 
                  icon={FaBookOpen} 
                  className="bg-green-600 hover:bg-green-700 text-white disabled:bg-green-300 disabled:cursor-not-allowed shadow-md shadow-green-600/10 min-w-[160px]" 
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}