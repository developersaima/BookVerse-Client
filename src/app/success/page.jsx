"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";
import { FaCheckCircle, FaSpinner, FaHome, FaBookOpen, FaShoppingBag } from "react-icons/fa";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SuccessPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("processing");
  const [ebookData, setEbookData] = useState(null);

  const ebookId = searchParams.get("ebookId");
  const amount = searchParams.get("amount");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const savePayment = async () => {
      try {
        if (!session?.user?.email || !ebookId || !amount) {
          toast.error("Missing payment information");
          setStatus("error");
          return;
        }

        // Step 1: Get auth token
        const { data: tokenData } = await authClient.token();

        // Step 2: Fetch ebook details
        const ebookRes = await fetch(`${API_BASE}/api/ebooks/${ebookId}`);
        if (!ebookRes.ok) {
          throw new Error("Failed to fetch ebook details");
        }
        const ebook = await ebookRes.json();
        setEbookData(ebook);

        // Step 3: Send to backend
        const response = await fetch(`${API_BASE}/api/payments/success`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData?.token}`,
          },
          body: JSON.stringify({
            transactionId: sessionId || `TXN-${Date.now()}`,
            ebookId: ebookId,
            amount: Number(amount),
            ebookTitle: ebook.title,
            writerEmail: ebook.writerEmail,
            writerName: ebook.writerName,
            coverImage: ebook.coverImage || "",
            genre: ebook.genre || "",
            buyerName: session.user.name,
            buyerEmail: session.user.email,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to save purchase");
        }

        setStatus("success");
        toast.success("Purchase successful! 🎉");
      } catch (err) {
        console.error("Payment error:", err);
        setStatus("error");
        toast.error(err.message || "Failed to save purchase");
      }
    };

    if (session?.user?.email && ebookId && amount) {
      savePayment();
    }
  }, [session, ebookId, amount, sessionId]);

  // Loading state
  if (status === "processing") {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="relative">
            <div className="w-24 h-24 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
              <FaSpinner className="text-4xl text-emerald-600 animate-spin" />
            </div>
            <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-4 border-emerald-200 animate-ping opacity-20"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-base-content">Processing Your Purchase</h2>
            <p className="text-base-content/60 mt-2">
              Please wait while we confirm your payment and add the ebook to your library.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="loading loading-dots loading-sm text-emerald-600"></span>
            <span className="text-sm text-base-content/40">This may take a few moments</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (status === "error") {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md bg-base-100 p-8 rounded-2xl shadow-xl border border-error/20">
          <div className="w-20 h-20 mx-auto rounded-full bg-error/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-error">Payment Failed</h2>
            <p className="text-base-content/60 mt-2">
              Something went wrong. Please try again or contact support.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link href="/browse" className="btn btn-primary flex-1">
              <FaShoppingBag className="mr-2" /> Browse Ebooks
            </Link>
            <Link href="/" className="btn btn-ghost flex-1">
              <FaHome className="mr-2" /> Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center space-y-6 max-w-lg w-full bg-base-100 p-8 md:p-10 rounded-2xl shadow-xl border border-emerald-200/50">
        <div className="relative">
          <div className="w-24 h-24 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
            <FaCheckCircle className="text-5xl text-emerald-600" />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-emerald-400/20 animate-ping"></div>
        </div>

        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-base-content">
            Payment Successful! 🎉
          </h2>
          <p className="text-base-content/60 mt-2">
            Thank you for your purchase! Your ebook is now available in your library.
          </p>
        </div>

        {ebookData && (
          <div className="bg-base-200/50 rounded-xl p-4 border border-base-200">
            <div className="flex items-center gap-4">
              {ebookData.coverImage && (
                <img 
                  src={ebookData.coverImage} 
                  alt={ebookData.title} 
                  className="w-16 h-20 rounded-lg object-cover border border-base-200"
                  onError={(e) => {
                    e.target.src = "/placeholder-cover.jpg";
                  }}
                />
              )}
              <div className="text-left">
                <p className="text-sm text-base-content/60">Ebook Purchased</p>
                <p className="text-lg font-semibold text-base-content">
                  {ebookData.title || "Unknown Title"}
                </p>
                <p className="text-sm text-base-content/60">
                  by {ebookData.writerName || "Unknown Author"}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-base-200 rounded-xl p-4 text-left space-y-2 border border-base-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-base-content/60">Amount Paid</span>
            <span className="text-lg font-bold text-emerald-600">
              ${Number(amount).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-base-content/60">Status</span>
            <span className="badge badge-success text-white gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              Completed
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-base-content/60">Transaction ID</span>
            <span className="text-xs font-mono text-base-content/40">
              {sessionId?.slice(0, 16) || ebookId?.slice(-8) || "N/A"}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
          <Link
            href="/dashboard?tab=ebooks"
            className="btn btn-success text-white flex-1 group hover:scale-105 transition-transform"
          >
            <FaBookOpen className="mr-2 group-hover:rotate-12 transition-transform" />
            View in Library
          </Link>
          <Link
            href="/browse"
            className="btn btn-ghost flex-1 group hover:bg-base-200"
          >
            <FaShoppingBag className="mr-2 group-hover:scale-110 transition-transform" />
            Browse More
          </Link>
        </div>

      
      </div>
    </div>
  );
}