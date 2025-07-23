import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PageNotFound = () => (
  <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
    {/* Blobs Animated Background */}
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1.6, opacity: 0.18 }}
      transition={{ duration: 1.2, delay: 0.2, type: "spring" }}
      className="absolute left-[-120px] top-[-90px] w-[375px] h-[375px] z-0"
      style={{
        background:
          "radial-gradient(circle, rgba(109,40,217,0.19) 0%, rgba(96,165,250,0.21) 75%)",
        borderRadius: "50%"
      }}
    />
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1.3, opacity: 0.13 }}
      transition={{ duration: 1.5, delay: 0.3, type: "spring" }}
      className="absolute right-[-80px] bottom-[-60px] w-[250px] h-[250px] z-0"
      style={{
        background:
          "radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(129,140,248,0.15) 80%)",
        borderRadius: "50%"
      }}
    />

    {/* 404 Illustration */}
    <motion.div
      initial={{ y: 70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", bounce: 0.3, duration: 0.9 }}
      className="relative z-10"
    >
      <svg
        width="130"
        height="130"
        viewBox="0 0 260 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-4"
      >
        <circle cx="130" cy="130" r="125" fill="#f1f5f9" />
        <ellipse cx="130" cy="200" rx="70" ry="20" fill="#e0e7ef" />
        <text x="60" y="125" fontSize="55" fontWeight="bold" fill="#6366f1">4</text>
        <g>
          <ellipse
            cx="130"
            cy="125"
            rx="32"
            ry="32"
            fill="#a5b4fc"
            stroke="#6366f1"
            strokeWidth="8"
          />
          <ellipse
            cx="130"
            cy="130"
            rx="10"
            ry="9"
            fill="#fff"
            stroke="#6366f1"
            strokeWidth="5"
          />
          <circle cx="130" cy="138" r="2" fill="#6366f1" />
        </g>
        <text x="155" y="125" fontSize="55" fontWeight="bold" fill="#6366f1">4</text>
      </svg>
    </motion.div>

    {/* Main Texts */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="relative z-10 flex flex-col items-center text-center"
    >
      <h1 className="text-5xl sm:text-6xl font-extrabold text-indigo-600 drop-shadow mb-4 tracking-tight">
        Oops!
      </h1>
      <p className="text-xl sm:text-2xl text-gray-600 max-w-xl mb-8 font-medium">
        The page you’re looking for isn’t here. <br className="hidden sm:block" />
        Maybe you mistyped the address, or the page has moved.
      </p>
      <Link
        to="/"
        className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg transition-transform hover:scale-105 hover:bg-indigo-700 font-semibold text-base"
      >
        Go Home
      </Link>
    </motion.div>
  </div>
);

export default PageNotFound;
