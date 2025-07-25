import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaShoppingCart, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useDispatch } from "react-redux";

// Utility to render rating stars
const renderStars = (rating = 0) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-gray-300" />);
    }
  }
  return stars;
};

// Calculate final price considering discount
const calculateFinalPrice = (product) => {
  const original = parseFloat(product.originalPrice || product.price);
  const discount = parseFloat(product.discountPercent || 0);

  if (discount > 0) {
    const discounted = original - (original * discount) / 100;
    return discounted.toFixed(2);
  }

  return original.toFixed(2);
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [showSecondImage, setShowSecondImage] = useState(false);

  const handleAddToCart = async () => {
    // Your add-to-cart dispatch or logic
    // dispatch(addToCartAction(product));
  };

  const firstImage =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : product.image || "/api/placeholder/300x400";

  const secondImage =
    Array.isArray(product.images) && product.images.length > 1
      ? product.images[1]
      : null;

  const showDiscount = product.discountPercent > 0;
  const finalPrice = calculateFinalPrice(product);
  const rating = parseFloat(product.rating?.rate || 0);

  // Toggle image on mobile tap
  const handleImageToggle = () => {
    if (secondImage) setShowSecondImage((prev) => !prev);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="group cursor-pointer rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm"
      onClick={handleImageToggle}
      onTouchStart={() => {}} // Dummy to enable :active styles on iOS Safari
    >
      {/* Product Images */}
      <div className="relative overflow-hidden h-64 w-full rounded-t-lg">
        <img
          src={showSecondImage && secondImage ? secondImage : firstImage}
          alt={product.title}
          className="absolute w-full h-full object-cover transition-opacity duration-300"
        />
        {/* Desktop hover second image overlay */}
        {secondImage && !showSecondImage && (
          <img
            src={secondImage}
            alt={`${product.title} alternate view`}
            className="absolute w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          />
        )}

        {/* Cart Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent toggling image on cart button click
            handleAddToCart();
          }}
          className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition duration-300"
          aria-label="Add to Cart"
        >
          <FaShoppingCart className="w-4 h-4 text-gray-800" />
        </motion.button>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-1">
        <h3 className="text-sm uppercase font-semibold text-gray-900 truncate">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center text-xs">
          {renderStars(rating)}
          <span className="ml-2 text-gray-500">{rating.toFixed(1)}</span>
        </div>

        {/* Pricing */}
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium pt-1">
          {/* Price */}
          <span className="text-gray-900 font-bold">₹{finalPrice}</span>

          {/* Original price & Discount badge */}
          {showDiscount && (
            <>
              <span className="line-through text-gray-400">
                ₹{product.originalPrice}
              </span>
              <span className="text-green-600 font-semibold px-2 rounded bg-green-50 ml-2">
                {product.discountPercent}% off
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
