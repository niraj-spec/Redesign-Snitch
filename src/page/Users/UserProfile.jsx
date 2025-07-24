import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaShoppingCart,
  FaBoxOpen,
  FaUserCircle,
  FaUser,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/FirebaseConfig";

const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      setIsOpen(false);
      navigate("/");
    } catch (err) {
      alert("Logout failed. Please try again.");
    }
  };

  // Hide if not logged in
  if (!currentUser) return null;

  return (
    <div className="relative z-50">
      {/* Floating User Icon -- visible only on mobile as a bottom button */}
      <motion.button
        className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 p-3 sm:p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg focus:outline-none ring-2 ring-purple-300"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.96 }}
        aria-label="Open user profile"
      >
        <FaUserCircle size={28} className="sm:hidden" />
        <FaUserCircle size={32} className="hidden sm:block" />
      </motion.button>

      {/* Slide-up Panel for User Profile */}
      {isOpen && (
        <motion.div
          className="fixed inset-x-0 bottom-0 mx-auto max-w-full w-full sm:max-w-md sm:right-5 sm:bottom-24 sm:rounded-2xl bg-white/90 border-t sm:border border-white/60 shadow-2xl backdrop-blur-lg sm:backdrop-blur-xl p-6 sm:p-8 transition-all z-[60]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.35, type: "spring" }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <FaUser
                size={72}
                className="rounded-full border-4 border-white text-indigo-500 bg-white/60"
              />
              <div className="text-base sm:text-lg font-semibold text-gray-800">
                {currentUser.displayName || "User"}
              </div>
              <div className="text-xs sm:text-sm text-gray-700">{currentUser.email}</div>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full mt-3">
              <Link
                to="/"
                className="flex flex-col items-center text-indigo-700 hover:text-indigo-400"
              >
                <FaHome size={22} />
                <span className="text-xs mt-1 font-medium">Home</span>
              </Link>
              <Link
                to="/cart"
                className="flex flex-col items-center text-green-600 hover:text-green-400"
              >
                <FaShoppingCart size={22} />
                <span className="text-xs mt-1 font-medium">Cart</span>
              </Link>
              <Link
                to="/product"
                className="flex flex-col items-center text-indigo-600 hover:text-indigo-400"
              >
                <FaBoxOpen size={22} />
                <span className="text-xs mt-1 font-medium">Products</span>
              </Link>
            </div>

            <Link
              to="/user/user-info"
              className="block w-full text-center text-indigo-800 underline underline-offset-4 hover:text-indigo-500 text-xs sm:text-sm mt-2"
              onClick={() => setIsOpen(false)}
            >
              Update &amp; Delete Account
            </Link>

            <button
              onClick={logoutHandler}
              className="w-full mt-4 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold shadow hover:bg-red-700 transition text-sm sm:text-base"
            >
              Log Out
            </button>
          </div>

          {/* Close button visible only on mobile popout */}
          <button
            className="absolute top-2 right-4 text-gray-400 hover:text-indigo-500 text-xl sm:hidden"
            onClick={() => setIsOpen(false)}
            aria-label="Close profile menu"
          >
            ✕
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default UserProfile;
