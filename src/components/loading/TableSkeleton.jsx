"use client";
import React from "react";

export default function TableSkeleton() {
  return (
    <div className="w-full overflow-x-auto border border-base-content/10 rounded-2xl bg-base-100 p-4">
      <table className="table w-full">
        <thead>
          <tr>
            {[...Array(4)].map((_, i) => (
              <th key={i}><div className="skeleton h-4 w-20 bg-base-200" /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b border-base-content/5">
              <td><div className="skeleton h-10 w-10 rounded-xl bg-base-200" /></td>
              <td><div className="skeleton h-4 w-32 bg-base-200" /></td>
              <td><div className="skeleton h-4 w-24 bg-base-200" /></td>
              <td><div className="skeleton h-8 w-20 rounded-lg bg-base-200" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}