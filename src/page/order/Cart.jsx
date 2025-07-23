import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaShoppingCart,
} from "react-icons/fa";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase/FirebaseConfig";
import Loader from "../../components/Loader";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate()

  
  // 🧠 Listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchCartItems(currentUser.uid);
      } else {
        setUser(null);
        setCartItems([]);
        setFetching(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // 💾 Fetch user's cart
  const fetchCartItems = async (uid) => {
    setFetching(true);
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setCartItems(userSnap.data().cart || []);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("❌ Error fetching cart:", err);
      setCartItems([]);
    }
    setFetching(false);
  };

  // 🔄 Update quantity
  const handleQuantityChange = async (id, type, size) => {
  if (!user) return;
  let updated = cartItems.map((item) => {
    if (item.id === id && item.size === size) {
      let q = item.quantity;
      if (type === "inc") q++;
      if (type === "dec") q--;
      return { ...item, quantity: q };
    }
    return item;
  });
  updated = updated.filter((item) => item.quantity > 0);
  const userRef = doc(db, "users", user.uid);
  await updateDoc(userRef, { cart: updated });
  setCartItems(updated);
};



  // 🗑 Remove item
  const handleRemove = async (id) => {
    if (!user) return;
    const updated = cartItems.filter((item) => item.id !== id);
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { cart: updated });
    setCartItems(updated);
  };

  // 🧹 Clear cart
  const handleClearCart = async () => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { cart: [] });
    setCartItems([]);
  };

  // 🧮 Totals
  const totalQuantity = cartItems.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cartItems.reduce(
    (s, i) => s + i.quantity * Number(i.price || 0),
    0
  );

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  // 🕐 Loading state
  if (fetching) {
    return <Loader/>;
  }

  // 🔒 User not logged in
  if (!user) {
    return (
      <div className="py-20 text-center">
        <FaShoppingCart className="text-gray-300 text-6xl mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-500">Please log in to see your cart</h2>
        <Link
          to="/login"
          className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  // 🧺 Empty Cart UX
  if (cartItems.length === 0) {
    return (
      <motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="py-16 text-center max-w-xl mx-auto px-4"
      >
        <FaShoppingCart className="text-indigo-400 text-7xl mx-auto mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty!</h2>
        <p className="text-gray-500 mb-4">Browse products to get started.</p>
        <Link
          to="/products"
          className="inline-block px-7 py-3 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 active:scale-95 transition-all"
        >
          Shop Now
        </Link>
      </motion.div>
    );
  }

  // 🧾 Cart List + Summary
  return (
    <motion.section
      variants={fadeUp}
      initial="initial"
      animate="animate"
      className="max-w-4xl mx-auto px-3 py-8"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">🛒 Your Cart</h1>
        <button
          className="text-red-600 hover:text-red-800 text-sm font-semibold underline"
          onClick={handleClearCart}
        >
          Clear All
        </button>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-5">
        {cartItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.015 }}
            className="flex items-center bg-white border p-4 rounded-lg shadow-md"
          >
            {/* Image */}
            <img
              src={item.image}
              alt={item.title}
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded mr-3"
            />

            {/* Info */}
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-900">{item.title}</div>
              <div className="text-xs text-gray-500">
  ₹{Number(item.price).toFixed(2)}
  {item.size && (
    <span className="ml-2 text-gray-600">| Size: <strong>{item.size}</strong></span>
  )}
</div>

            </div>

            {/* Quantity */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(item.id, "dec")}
                className="text-gray-700 px-2 py-1 border rounded hover:bg-gray-100"
              >
                <FaMinus />
              </button>
              <span className="font-semibold">{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.id, "inc")}
                className="text-gray-700 px-2 py-1 border rounded hover:bg-gray-100"
              >
                <FaPlus />
              </button>
            </div>

            {/* Line Total */}
            <div className="text-sm font-bold w-20 text-center">
              ₹{(Number(item.price) * item.quantity).toFixed(2)}
            </div>

            {/* Remove */}
            <button
              onClick={() => handleRemove(item.id)}
              className="ml-2 text-red-500 hover:text-red-700"
              title="Remove Item"
            >
              <FaTrash />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-10 border-t pt-6">
        <div className="flex justify-between text-md mb-2 font-medium">
          <span>Total Items:</span>
          <span>{totalQuantity}</span>
        </div>
        <div className="flex justify-between text-xl font-bold text-gray-800">
          <span>Total Price:</span>
          <span>₹{Number(totalPrice).toFixed(2)}</span>
        </div>

        <button
  onClick={() => navigate("/payment", { state: { cartItems } })}
  className="mt-6 w-full bg-indigo-600 text-white py-3 rounded shadow hover:bg-indigo-700 font-semibold active:scale-95 transition"
>
  Proceed to Checkout
</button>

      </div>
    </motion.section>
  );
}
