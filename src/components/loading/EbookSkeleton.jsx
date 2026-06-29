"use client";
import React from "react";

export default function EbookSkeleton() {
  return (
    <div className="min-h-screen bg-base-200 py-8 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="skeleton h-10 w-36 bg-base-200 rounded-xl" />
          <div className="flex items-center gap-2">
            <div className="skeleton h-9 w-20 bg-base-200 rounded-xl" />
            <div className="skeleton h-9 w-28 bg-base-200 rounded-xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden sticky top-24">
              <div className="aspect-[3/4] bg-base-200">
                <div className="skeleton w-full h-full" />
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-base-200 rounded-lg p-3 text-center">
                      <div className="skeleton h-3 w-10 mx-auto mb-1" />
                      <div className="skeleton h-4 w-12 mx-auto" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 xl:col-span-9">
            <div className="bg-base-100 rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="skeleton h-6 w-20 bg-base-200 rounded-full" />
                    <div className="skeleton h-6 w-24 bg-base-200 rounded-full" />
                  </div>
                  <div className="skeleton h-12 w-3/4 bg-base-200 rounded" />
                  <div className="flex items-center gap-3">
                    <div className="skeleton w-10 h-10 rounded-full" />
                    <div>
                      <div className="skeleton h-4 w-32 bg-base-200 rounded" />
                      <div className="skeleton h-3 w-16 bg-base-200 rounded mt-1" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="skeleton h-9 w-16 bg-base-200 rounded-xl" />
                  <div className="skeleton h-9 w-16 bg-base-200 rounded-xl" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="skeleton h-5 w-32 bg-base-200 rounded" />
                <div className="skeleton h-5 w-28 bg-base-200 rounded" />
                <div className="skeleton h-5 w-36 bg-base-200 rounded" />
              </div>

              <div className="divider" />

              <div>
                <div className="skeleton h-4 w-24 bg-base-200 rounded mb-3" />
                <div className="bg-base-200 rounded-xl p-5 space-y-2">
                  <div className="skeleton h-4 w-full bg-base-300 rounded" />
                  <div className="skeleton h-4 w-11/12 bg-base-300 rounded" />
                  <div className="skeleton h-4 w-10/12 bg-base-300 rounded" />
                  <div className="skeleton h-4 w-full bg-base-300 rounded" />
                  <div className="skeleton h-4 w-9/12 bg-base-300 rounded" />
                </div>
              </div>

              <div className="divider" />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-base-200 rounded-2xl p-6">
                <div>
                  <div className="skeleton h-3 w-16 bg-base-300 rounded mb-1" />
                  <div className="skeleton h-8 w-32 bg-base-300 rounded" />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <div className="skeleton h-12 w-40 bg-base-300 rounded-xl" />
                  <div className="skeleton h-12 w-32 bg-base-300 rounded-xl" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="skeleton h-4 w-32 bg-base-200 rounded" />
                <div className="skeleton h-4 w-4 bg-base-200 rounded-full" />
                <div className="skeleton h-4 w-44 bg-base-200 rounded" />
                <div className="skeleton h-4 w-4 bg-base-200 rounded-full" />
                <div className="skeleton h-4 w-48 bg-base-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}