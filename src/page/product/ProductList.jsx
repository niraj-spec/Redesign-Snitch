import React, { useEffect, useRef, useState, useCallback } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase/FirebaseConfig";
import { motion } from "framer-motion";
import ProductFilter from "./ProductFilter";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const PRODUCTS_PER_PAGE = 8;

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



const calculateFinalPrice = (product) => {
  const original = parseFloat(product.originalPrice || product.price || 0);
  const discount = parseFloat(product.discountPercent || 0);

  if (discount > 0) {
    return (original - (original * discount) / 100).toFixed(2);
  }
  return original.toFixed(2);
};

const ProductList = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedDiscount, setSelectedDiscount] = useState(0);
  const [activeCard, setActiveCard] = useState(null);


  const observerRef = useRef();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAllProducts(list);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter logic
  useEffect(() => {
  let filtered = [...allProducts];

  // ✅ Normalize category match (case insensitive, trimmed)
  if (selectedCategory) {
    filtered = filtered.filter(
      (p) =>
        p.category?.toLowerCase().trim() === selectedCategory.toLowerCase().trim()
    );
  }

  // ✅ Fix: Use finalPrice not price
  if (selectedPrice) {
    filtered = filtered.filter(
      (p) =>
        p.finalPrice >= selectedPrice.min &&
        p.finalPrice <= selectedPrice.max
    );
  }

  // ✅ Fix: Ensure correct rating field
  if (selectedRating) {
    filtered = filtered.filter((p) => {
      const rate = parseFloat(p.averageRating || p.rating?.rate || 0);
      return rate >= selectedRating;
    });
  }

  // ✅ Apply discount filtering
  if (selectedDiscount) {
    filtered = filtered.filter(
      (p) => (p.discountPercent || 0) >= selectedDiscount
    );
  }

  setFilteredProducts(filtered);
  setDisplayedProducts(filtered.slice(0, PRODUCTS_PER_PAGE));
  setPage(1);
}, [
  selectedCategory,
  selectedPrice,
  selectedRating,
  selectedDiscount,
  allProducts,
]);


  // Lazy load when bottom reached
  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && displayedProducts.length < filteredProducts.length) {
          const nextPage = page + 1;
          const nextProducts = filteredProducts.slice(
            0,
            nextPage * PRODUCTS_PER_PAGE
          );
          setDisplayedProducts(nextProducts);
          setPage(nextPage);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [page, displayedProducts, filteredProducts, loading]
  );

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500 animate-pulse">
        Loading products...
      </div>
    );
  }

  const handleCardToggle = (productId) => {
    setActiveCard((prev) => (prev === productId ? null : productId));
  };

  return (
    <section className="py-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="md:flex">
          {/* Sidebar */}
          <div className="md:w-1/4 mb-6 md:mb-0">
            <ProductFilter
              selectedCategory={selectedCategory}
              selectedPrice={selectedPrice}
              selectedRating={selectedRating}
              selectedDiscount={selectedDiscount}
              setSelectedCategory={setSelectedCategory}
              setSelectedPrice={setSelectedPrice}
              setSelectedRating={setSelectedRating}
              setSelectedDiscount={setSelectedDiscount}
            />
          </div>

          {/* Product Grid */}
          <div className="w-full md:w-3/4">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-center">
                <p className="text-lg font-semibold text-gray-700">No products found</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  {selectedCategory || selectedPrice || selectedRating || selectedDiscount
                    ? "Filtered Products"
                    : "Best Sellers"}
                </h2>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                  {displayedProducts.map((product, index) => {
                    const firstImage =
                      Array.isArray(product.images) && product.images.length > 0
                        ? product.images[0]
                        : product.image;

                    const secondImage =
                      Array.isArray(product.images) && product.images.length > 1
                        ? product.images[1]
                        : null;

                    const hasDiscount = product.discountPercent > 0;
                    const price = calculateFinalPrice(product);
                    const rating = parseFloat(product.averageRating || product.rating?.rate || 0);
                    const isLastItem = displayedProducts.length === index + 1;

                    // Determine which image to show (mobile toggle or desktop hover)
                    // On desktop: show second image on hover via CSS
                    // On mobile: show second image if activeCard matches product id
                    return (
                      <motion.div
                        key={product.id}
                        ref={isLastItem ? lastProductRef : null}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white border rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                        onClick={() => {
                          if (secondImage) {
                            handleCardToggle(product.id);
                          }
                        }}
                      >
                        <Link to={`/product/${product.id}`} onClick={(e) => e.stopPropagation()}>
                          <div className="relative h-56 overflow-hidden rounded-t-lg">
                            <img
                              src={
                                // Show second image on desktop hover or on mobile active
                                (activeCard === product.id && secondImage) ? secondImage : firstImage || "/placeholder.png"
                              }
                              alt={product.title}
                              className="absolute w-full h-full object-cover transition-opacity duration-300"
                            />
                            {/* Desktop hover effect: layered images */}
                            {secondImage && (
                              <img
                                src={secondImage}
                                alt={product.title + " extra"}
                                className={`absolute w-full h-full object-cover opacity-0 hover:opacity-100 md:block hidden transition-opacity duration-300`}
                              />
                            )}
                          </div>

                          <div className="p-4 space-y-1">
                            <h3 className="text-sm font-semibold text-gray-800 truncate">
                              {product.title || "Untitled"}
                            </h3>

                            <div className="flex items-center text-xs">
                              {renderStars(rating)}
                              <span className="ml-2 text-gray-500">{rating?.toFixed(1)}</span>
                            </div>

                            <div className="font-medium text-sm flex items-center gap-2 pt-1">
                              <span className="text-gray-900 font-bold">₹{price}</span>
                              {hasDiscount && (
                                <>
                                  <span className="line-through text-gray-400 text-sm">
                                    ₹{product.originalPrice}
                                  </span>
                                  <span className="text-green-600 text-xs font-semibold">
                                    {product.discountPercent}% off
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                    
                  })}
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductList;
