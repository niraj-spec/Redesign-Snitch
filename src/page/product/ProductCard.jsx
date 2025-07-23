import React from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

// Utility to render rating stars (full, half, empty)
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

// Price calculation
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

  const handleAddToCart = async () => {
    // Your add-to-cart dispatch or logic
    // dispatch(addToCartAction(product));
  };

  const firstImage =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : product.image || '/api/placeholder/300x400';

  const secondImage =
    Array.isArray(product.images) && product.images.length > 1
      ? product.images[1]
      : null;

  const showDiscount = product.discountPercent > 0;

  const finalPrice = calculateFinalPrice(product);

  const rating = parseFloat(product.rating?.rate || 0);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="group cursor-pointer rounded-lg overflow-hidden bg-white border border-gray-200"
    >
      {/* Product Images */}
      <div className="relative overflow-hidden h-64 w-full">
        <img
          src={firstImage}
          alt={product.title}
          className="absolute w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
        />
        {/* Second image on hover (if available) */}
        {secondImage && (
          <img
            src={secondImage}
            alt="Alt View"
            className="absolute w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        )}

        {/* Cart Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition duration-300"
        >
          <FaShoppingCart className="w-4 h-4 text-gray-800" />
        </motion.button>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-1">
        <h3 className="text-sm uppercase font-semibold text-gray-900 truncate">{product.title}</h3>

        {/* Rating */}
        <div className="flex items-center text-xs">
          {renderStars(rating)}
          <span className="ml-2 text-gray-500">{rating.toFixed(1)}</span>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2 text-sm font-medium pt-1">
          <span className="text-gray-900 font-bold">₹{finalPrice}</span>
          {showDiscount && (
            <>
              <span className="line-through text-gray-400">₹{product.originalPrice}</span>
              <span className="text-green-600 font-semibold">{product.discountPercent}% off</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
