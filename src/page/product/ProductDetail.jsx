import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../../firebase/FirebaseConfig';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Loader from '../../components/Loader'

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewError, setReviewError] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  // Auth state watcher
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currUser) => {
      setUser(currUser);

      if (currUser) {
        const userRef = doc(db, 'users', currUser.uid);
        const userSnap = await getDoc(userRef);
        setIsAdmin(userSnap.exists() && userSnap.data().admin === true);
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct(data);
          setReviews(data.reviews || []);
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        setError('Error fetching product.');
      }
    };

    fetchProduct();
  }, [id]);

  // Handle Add to Cart
  const handleAddToCart = async () => {
    setAdding(true);
    setError('');
    setSuccessMsg('');

    const currUser = auth.currentUser;

    if (!currUser) {
      setError('⚠ Please login to add items to the cart.');
      setAdding(false);
      return;
    }

    if (product.sizes?.length > 0 && !selectedSize) {
      setError('⚠ Please select a size before adding to cart.');
      setAdding(false);
      return;
    }

    try {
      const userRef = doc(db, 'users', currUser.uid);
      const userSnap = await getDoc(userRef);

      const image =
        Array.isArray(product.images) && product.images.length > 0
          ? product.images[0]
          : product.image ;

      const price =
        typeof product.finalPrice !== 'undefined' && product.finalPrice !== null
          ? parseFloat(product.finalPrice)
          : parseFloat(product.price);

      const cartItem = {
        id,
        title: product.title,
        image,
        price,
        quantity: 1,
        size: selectedSize || null,
      };

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const cart = userData.cart || [];
        const index = cart.findIndex((item) => item.id === id && item.size === selectedSize);


        if (index !== -1) {
          cart[index].quantity += 1;
          await updateDoc(userRef, { cart });
        } else {
          await updateDoc(userRef, {
            cart: [...cart, cartItem],
          });
        }
      } else {
        await setDoc(userRef, {
          uid: currUser.uid,
          email: currUser.email,
          cart: [cartItem],
        });
      }

      setSuccessMsg('✅ Product added to cart!');
    } catch (err) {
      console.error('Cart error:', err);
      setError('❌ Failed to add product to cart.');
    }

    setAdding(false);
  };

  const handleEdit = () => {
    navigate(`/product/edit/${id}`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setReviewError('Please login to submit a review.');
      return;
    }

    if (!reviewText.trim()) {
      setReviewError('Review text is required.');
      return;
    }

    if (reviewRating < 1 || reviewRating > 5) {
      setReviewError('Rating between 1 to 5 is required.');
      return;
    }

    setReviewSubmitting(true);

    try {
      const reviewObj = {
        uid: user.uid,
        name: user.displayName || user.email || 'Anonymous',
        photo: user.photoURL || '',
        rating: reviewRating,
        createdAt: new Date().toISOString(),
        text: reviewText,
      };

      await updateDoc(doc(db, 'products', id), {
        reviews: arrayUnion(reviewObj),
      });

      setReviews((prev) => [reviewObj, ...prev]);
      setReviewText('');
      setReviewRating(0);
    } catch (err) {
      setReviewError('Failed to submit review.');
    }

    setReviewSubmitting(false);
  };

  const handleDeleteReview = async (createdAt) => {
    if (!user || !window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const productRef = doc(db, 'products', id);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) return;

      const currentReviews = productSnap.data().reviews || [];

      const updatedReviews = currentReviews.filter(
        (rev) => rev.createdAt !== createdAt || rev.uid !== user.uid
      );

      await updateDoc(productRef, {
        reviews: updatedReviews,
      });

      setReviews(updatedReviews);
    } catch (err) {
      console.error("❌ Failed to delete review:", err);
    }
  };


  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  if (!product) {
    return <Loader/>
  }

  const productImage =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : product.image ;

  const displayPrice =
    product.finalPrice !== undefined && product.finalPrice !== null
      ? product.finalPrice
      : product.price;

  return (
    <section className="py-10 px-4 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-10 bg-white p-6 shadow rounded-lg mb-10">
        {/* Image & Rating */}
        <div>
          {/* 🖼 Multi-Image Viewer with Dot Indicators */}
{Array.isArray(product.images) && product.images.length > 0 ? (
  <div className="relative">
    <img
      src={product.images[currentImageIndex]}
      alt={product.title}
      className="w-full h-96 object-cover rounded transition-all duration-300"
    />
{/* Optional ←/→ Arrows */}
{product.images.length > 1 && (
  <>
    <button
      onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black"
    >
      ‹
    </button>
    <button
      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % product.images.length)}
      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black"
    >
      ›
    </button>
  </>
)}


    {/* 🔵 Dot Indicators */}
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
      {product.images.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentImageIndex(index)}
          className={`w-3 h-3 rounded-full transition-all duration-200 ${
            currentImageIndex === index
              ? "bg-black"
              : "bg-gray-300 hover:bg-gray-500"
          }`}
          aria-label={`View image ${index + 1}`}
        />
      ))}
    </div>
  </div>
) : (
  <img
    src={product.image}
    alt={product.title}
    className="w-full h-96 object-cover rounded"
  />
)}

          {product.rating?.rate && (
            <div className="mt-4 flex items-center gap-3">
              <span className="flex items-center text-yellow-500 font-bold text-lg">
                {product.rating.rate} <FaStar className="ml-1" />
              </span>
              <span className="text-sm text-gray-500">{product.rating.count || 0} reviews</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-2xl font-bold text-gray-900">₹{displayPrice}</span>
              {product.originalPrice && product.discountPercent && (
                <>
                  <span className="line-through text-gray-400">₹{product.originalPrice}</span>
                  <span className="text-green-600 font-medium">{product.discountPercent}% off</span>
                </>
              )}
            </div>

            {product.category && (
              <div className="text-sm text-gray-600 mb-2">Category: {product.category}</div>
            )}

            {product.sizes && product.sizes.length > 0 && (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">Select Size:</label>
    <div className="flex flex-wrap gap-2">
      {product.sizes.map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => {
            setSelectedSize(size);
            if (error) setError(""); // clear error on pick
          }}
          className={`px-4 py-2 border rounded ${
            selectedSize === size
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-800 border-gray-300'
          } hover:border-black transition`}
        >
          {size}
        </button>
      ))}
    </div>
    {/* Show red warning directly below sizes if size not selected */}
    {error === '⚠ Please select a size before adding to cart.' && (
      <p className="text-red-600 text-xs mt-1">{error}</p>
    )}
  </div>
)}



            {product.description && (
              <p className="text-gray-700 mt-4">{product.description}</p>
            )}

            {product.specifications && product.specifications.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-1">Specifications:</h4>
                <ul className="list-disc list-inside text-gray-700 text-sm">
                  {product.specifications.map((spec, index) =>
                    spec.key && spec.value ? (
                      <li key={index}>
                        <strong>{spec.key}:</strong> {spec.value}
                      </li>
                    ) : null
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-6">
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={adding}
              onClick={handleAddToCart}
              className="w-full py-3 bg-black text-white font-semibold rounded shadow hover:bg-gray-800 transition disabled:opacity-50"
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </motion.button>

            {successMsg && <p className="text-green-600 text-sm mt-2">{successMsg}</p>}
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

            {isAdmin && (
              <button
                onClick={handleEdit}
                className="w-full mt-3 py-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700"
              >
                ✏️ Edit Product
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white p-6 shadow rounded-lg">
        <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>

        {/* Review Form */}
        <div className="mb-6">
          {user ? (
            <form onSubmit={handleReviewSubmit}>
              <div className="flex items-center mb-3">
                <span className="mr-2 text-sm font-medium text-gray-700">Your Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className={`cursor-pointer w-6 h-6 ${reviewRating >= star ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                  />
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full border p-3 rounded resize-none mb-3"
                rows="3"
                placeholder="Write your review here..."
              />
              {reviewError && <p className="text-red-500 text-sm mb-2">{reviewError}</p>}
              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                disabled={reviewSubmitting}
                className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition disabled:opacity-50"
              >
                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
              </motion.button>
            </form>
          ) : (
            <p className="text-gray-600">Login to submit a review.</p>
          )}
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-sm">No reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {reviews
              .slice()
              .reverse()
              .map((rev, i) => (
                <li key={i} className="bg-gray-50 p-4 rounded shadow flex gap-4">
                  <img
                    src={rev.photo || '/user-icon.svg'}
                    alt={rev.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">{rev.name}</span>
                      {[...Array(rev.rating)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 w-4 h-4" />
                      ))}
                    </div>
                    {(user && (rev.uid === user.uid || isAdmin)) && (
                      <button
                        onClick={() => handleDeleteReview(rev.createdAt)}
                        className="ml-2 text-red-500 text-xs hover:underline"
                      >
                        🗑️ Delete
                      </button>
                    )}

                    <small className="text-gray-400 block mb-1">
                      {new Date(rev.createdAt).toLocaleString()}
                    </small>
                    <p className="text-sm text-gray-700">{rev.text}</p>
                  </div>
                </li>
              ))}
          </ul>
        )}
        
      </div>
    </section>
  );
}
