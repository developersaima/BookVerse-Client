"use client";

import React from "react";
import { FiSearch, FiSliders } from "react-icons/fi";

export default function FilterControls({ filters, onFilterChange }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  const genres = ["Fiction", "Mystery", "Romance", "Sci-Fi", "Fantasy", "Horror", "Biography"];

  return (
    <div className="bg-base-200/40 border border-base-content/5 rounded-2xl p-5 md:p-6 transition-colors duration-300">
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-base-content/5">
        <FiSliders className="text-[#00a851] text-lg" />
        <h2 className="font-black text-sm uppercase tracking-wider text-base-content">Filter Engine</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Search */}
        <div className="form-control w-full">
          <label className="label py-1 text-xs font-bold tracking-wide uppercase text-base-content/60">Search</label>
          <div className="relative flex items-center w-full">
            <FiSearch className="absolute left-3.5 text-base-content/40 text-base" />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleInputChange}
              placeholder="Title or author name..."
              className="input input-bordered w-full pl-10 h-11 text-sm rounded-xl bg-base-100 border-base-content/10 focus:border-[#00a851] focus:outline-none"
            />
          </div>
        </div>

        {/* Genre */}
        <div className="form-control w-full">
          <label className="label py-1 text-xs font-bold tracking-wide uppercase text-base-content/60">Genre</label>
          <select
            name="genre"
            value={filters.genre}
            onChange={handleInputChange}
            className="select select-bordered w-full h-11 text-sm rounded-xl bg-base-100 border-base-content/10 focus:border-[#00a851] focus:outline-none"
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g} value={g.toLowerCase()}>{g}</option>
            ))}
          </select>
        </div>

        {/* Availability */}
        <div className="form-control w-full">
          <label className="label py-1 text-xs font-bold tracking-wide uppercase text-base-content/60">Availability</label>
          <select
            name="availability"
            value={filters.availability}
            onChange={handleInputChange}
            className="select select-bordered w-full h-11 text-sm rounded-xl bg-base-100 border-base-content/10 focus:border-[#00a851] focus:outline-none"
          >
            <option value="">Any Status</option>
            <option value="in stock">In Stock</option>
            <option value="sold out">Sold Out</option>
          </select>
        </div>

        {/* Sorting */}
        <div className="form-control w-full">
          <label className="label py-1 text-xs font-bold tracking-wide uppercase text-base-content/60">Sort By</label>
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleInputChange}
            className="select select-bordered w-full h-11 text-sm rounded-xl bg-base-100 border-base-content/10 focus:border-[#00a851] focus:outline-none"
          >
            <option value="newest">Newest Arrival</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Price Range Slider & Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-base-content/5">
        <div className="form-control w-full">
          <label className="label py-1 text-xs font-bold tracking-wide uppercase text-base-content/60">Min Price ($)</label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleInputChange}
            placeholder="0"
            min="0"
            className="input input-bordered w-full h-11 text-sm rounded-xl bg-base-100 border-base-content/10 focus:border-[#00a851] focus:outline-none"
          />
        </div>
        <div className="form-control w-full">
          <label className="label py-1 text-xs font-bold tracking-wide uppercase text-base-content/60">Max Price ($)</label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleInputChange}
            placeholder="9999"
            min="0"
            className="input input-bordered w-full h-11 text-sm rounded-xl bg-base-100 border-base-content/10 focus:border-[#00a851] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}