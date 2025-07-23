import React, { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

// Replace this with data from Firebase and normalize it
const firebasecategories = ["Casual Wear","Shirt", "T-Shirt", "Jeans", "Perfume", "Shorts" ];
const categories = firebasecategories.map((cat) => cat.toLowerCase());

const prices = [
  { label: "₹0–₹500", min: 0, max: 500 },
  { label: "₹500–₹1,000", min: 500, max: 1000 },
  { label: "₹1,000–₹5,000", min: 1000, max: 5000 },
  { label: "Over ₹5,000", min: 5000, max: 999999 },
];

const ratings = [4, 3, 2];
const discounts = [10, 25, 50];

const ProductFilter = ({
  selectedCategory,
  selectedPrice,
  selectedRating,
  selectedDiscount,
  setSelectedCategory,
  setSelectedPrice,
  setSelectedRating,
  setSelectedDiscount,
}) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  return (
    <div className="w-full md:w-64 p-4 bg-white shadow-md rounded-md mb-4 md:mb-0 md:mr-6">
      <h2 className="text-lg font-semibold mb-4 hidden md:block">Filter Products</h2>

      {/* ==== Category Section ==== */}
      <div className="mb-5">
        <h3 className="text-sm font-medium mb-2">Category</h3>

        {/* Clear Button */}
        <button
          className="text-sm text-blue-600 mb-2"
          onClick={() => setSelectedCategory("")}
        >
          Clear Category
        </button>

        {/* Mobile Horizontal Scrollable Category */}
        <div className="flex md:flex-col overflow-x-auto md:overflow-visible space-x-3 md:space-x-0 md:space-y-2 scrollbar-hide">
          {categories.map((cat) => (
           <button
  key={cat}
  onClick={() => setSelectedCategory(cat)}
  className={`
    min-w-[110px] px-3 py-2 text-sm text-center border rounded-md cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis
    ${selectedCategory === cat
      ? 'bg-black text-white border-black'
      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
  `}
>

              {cat.toUpperCase()}
            </button>
          ))}

          {/* More Filters Button for Mobile */}
          <button
            onClick={() => setShowMoreFilters((prev) => !prev)}
            className="min-w-[100px] flex items-center justify-center px-3 py-2 text-sm border rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200"
          >
            <FiPlus className="mr-1" />
            More Filters
          </button>
        </div>
      </div>

      {/* ==== Additional Filters: Shown by toggle OR always on desktop ==== */}
      <div className={`${showMoreFilters ? "block" : "hidden"} md:block`}>
        {/* Price */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Price</h3>
          {prices.map((p) => (
            <label key={p.label} className="flex items-center space-x-2 text-gray-700 mb-1">
              <input
                type="radio"
                name="price"
                checked={selectedPrice?.label === p.label}
                onChange={() => setSelectedPrice(p)}
              />
              <span>{p.label}</span>
            </label>
          ))}
          <button onClick={() => setSelectedPrice(null)} className="text-sm text-blue-600 mt-1">Clear</button>
        </div>

        {/* Ratings */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Customer Rating</h3>
          {ratings.map((r) => (
            <label key={r} className="flex items-center space-x-2 text-gray-700 mb-1">
              <input
                type="radio"
                name="rating"
                checked={selectedRating === r}
                onChange={() => setSelectedRating(r)}
              />
              <span>{r}★ & up</span>
            </label>
          ))}
          <button onClick={() => setSelectedRating(0)} className="text-sm text-blue-600 mt-1">Clear</button>
        </div>

        {/* Discounts */}
        <div className="mb-2">
          <h3 className="text-sm font-medium mb-2">Discount</h3>
          {discounts.map((d) => (
            <label key={d} className="flex items-center space-x-2 text-gray-700 mb-1">
              <input
                type="radio"
                name="discount"
                checked={selectedDiscount === d}
                onChange={() => setSelectedDiscount(d)}
              />
              <span>{d}% or more</span>
            </label>
          ))}
          <button onClick={() => setSelectedDiscount(0)} className="text-sm text-blue-600 mt-1">Clear</button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
