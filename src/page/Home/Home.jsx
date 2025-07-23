import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where,limit } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { db } from '../../firebase/FirebaseConfig';
import { useNavigate } from 'react-router-dom'; // ✅ added

// Components
import Hero from './Hero';
import MarqueeLetters from '../../components/MarqueeComponent';
import ProductList from '../product/ProductList';
import BrandStory from './BrandStory';
import Footer from '../../components/Footer';
import UserProfile from '../Users/UserProfile';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ for button navigation

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
  try {
    const q = query(
      collection(db, 'products'),
      where('isFeatured', '==', true),
      limit(6) // 🔥 Limit right at query level
    );
    const querySnapshot = await getDocs(q);

    const products = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || null,
      };
    });

    setFeatured(products);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching products:", error);
    setLoading(false);
  }
};


    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-black border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // ✅ Show only first 6 products on homepage
  const limitedFeatured = featured.slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      <main>
        <Hero />
        <MarqueeLetters />

        {/* ✅ Show only max 6 featured products */}
        <ProductList products={limitedFeatured} />

        {/* ✅ "View More" Button if there are more than 6 */}
        {featured.length > 6 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-2 text-sm font-semibold text-white bg-black hover:bg-gray-800 transition-colors rounded"
            >
              View More Products
            </button>
          </div>
        )}

        <BrandStory />
        <UserProfile />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
