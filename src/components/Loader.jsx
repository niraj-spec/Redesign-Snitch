// src/components/CartLoader.jsx
import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center text-gray-600">
      <motion.div
        className="text-indigo-600"
        animate={{
          x: [0, 50, -50, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 1.2,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      >
        <FaShoppingCart className="text-6xl sm:text-7xl" />
      </motion.div>

      <motion.h2
        className="mt-6 text-xl sm:text-2xl font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.8, 1] }}
        transition={{
          repeat: Infinity,
          duration: 1.8,
          delay: 0.2,
        }}
      >
        Loading Your Data...<p className="text-sm text-gray-400 mt-1">Please wait a moment ⚡</p>
      </motion.h2>

      
    </div>
  );
}
