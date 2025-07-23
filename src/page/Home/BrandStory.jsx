import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const images = [
  { src: '/Backstory.avif', alt: 'Early Days of Snitch' },
  { src: '/Backstory2.webp', alt: 'Product Development Phase' },
  { src: '/Backstory.avif', alt: 'Snitch on Shark Tank' },
  { src: '/Backstory.avif', alt: 'New Partner Synergy' },
];

const BrandStory = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* TEXT Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              A JOURNEY OF INNOVATION & STYLE
            </h2>
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900">
              The Snitch Story.
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Snitch began as a bold venture to revolutionize men’s fashion in India with a digital-first mindset.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The brand's defining moment came when it appeared on <strong>Shark Tank India Season 2</strong>.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today, with powerful partnerships and a loyal customer base, Snitch continues to redefine bold,
              accessible fashion for the modern man — and this is just the beginning.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-black text-white px-6 py-3 text-sm font-medium tracking-wide hover:bg-gray-800 transition-colors"
            >
              DISCOVER OUR JOURNEY
            </motion.button>
          </motion.div>

          {/* IMAGE SLIDER — Only show currentSlide */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg"
          >
            {
              images.map((image, index) => {
                if (index !== currentSlide) return null; // only current image
                return (
                  <img
                    key={index}
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className="absolute w-full h-full object-cover transition-opacity duration-700 ease-in-out opacity-100 z-10"
                  />
                );
              })
            }
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
