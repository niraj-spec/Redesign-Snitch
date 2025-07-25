import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaShoppingCart,
  FaSearch,
  FaBars,
  FaTimes,
  FaCommentAlt,
  FaPlay,
  FaPause
} from 'react-icons/fa';
import {
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot
} from 'firebase/firestore';
import { auth, db } from '../firebase/FirebaseConfig';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [admin, setadmin] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [showMessages, setShowMessages] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const navigate = useNavigate();

  // Auth & Admin Role
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        setadmin(userSnap.data()?.admin || false);

        // Cart Count
        const unsubscribeCart = onSnapshot(userRef, (docSnap) => {
          setCartCount(docSnap.exists() ? (docSnap.data().cart || []).length : 0);
        });

        // Messages
        const messageSnap = await getDocs(collection(db, 'messages'));
        const userMessages = messageSnap.docs
          .map(doc => doc.data())
          .filter(msg => msg.userId === currentUser.uid);
        setMessages(userMessages);

        return () => unsubscribeCart();
      } else {
        setUser(null);
        setadmin(false);
        setCartCount(0);
        setMessages([]);
      }
    });

    return () => unsub();
  }, []);

  // All products for search
  useEffect(() => {
    const fetchProducts = async () => {
      const querySnap = await getDocs(collection(db, 'products'));
      const items = querySnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllProducts(items);
    };
    fetchProducts();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (value.trim()) {
      const filtered = allProducts
        .filter(p => p.title.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (id) => {
    setSearchOpen(false);
    setSearchText('');
    setSuggestions([]);
    navigate(`/product/${id}`);
  };

  const searchVariants = {
    open: { height: '100px', opacity: 1 },
    closed: { height: 0, opacity: 0 }
  };

  const logoutHandler = async () => {
    await signOut(auth);
    setUser(null);
    setadmin(false);
  };

  useEffect(() => {
    // Use a sample flute music URL (ensure it's royalty-free or your own)
    audioRef.current = new Audio('/song.mp3');
    audioRef.current.loop = true;

    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!user) {
      alert('Please login to play music.');
      return;
    }

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  // When audio ends naturally, update isPlaying state
  useEffect(() => {
    if (!audioRef.current) return;

    const onEnded = () => setIsPlaying(false);
    audioRef.current.addEventListener('ended', onEnded);

    return () => {
      audioRef.current?.removeEventListener('ended', onEnded);
    };
  }, []);

  // Bar animation styles
  const barStyle = {
    width: '4px',
    height: '20px',
    margin: '0 2px',
    backgroundColor: 'green',
    display: 'inline-block',
    animation: 'barMove 1s infinite',
    animationTimingFunction: 'ease-in-out',
  };

  const barStyleDelays = [
    { animationDelay: '0s' },
    { animationDelay: '0.2s' },
    { animationDelay: '0.4s' },
    { animationDelay: '0.6s' },
  ];

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-gray-900 relative group">
              SNITCH
              <span className="block h-[2px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-6 items-center text-sm font-medium">
              <Link to="/new" className="text-gray-700 hover:text-black">NEW</Link>
              <Link to="/product" className="text-gray-700 hover:text-black">SHOP</Link>
              <Link to="/about" className="text-gray-700 hover:text-black">ABOUT</Link>
              <Link to="/studio" className="text-gray-700 hover:text-black">STUDIO</Link>
              <Link to="/order" className="text-gray-700 hover:text-black">YOUR ORDER</Link>

              {admin && (
                <>
                  <Link to="/admin" className="text-gray-700 hover:text-black">ADMIN</Link>
                  <Link to="/create-product" className="text-gray-700 hover:text-black">CREATE PRODUCT</Link>
                </>
              )}

              {!user && (
                <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
              )}
            </div>

            {/* Add Music Play Button on right side */}
            <div className="flex items-center space-x-3 ml-4">
              <button
  onClick={togglePlay}
  className="p-2 rounded-md flex items-center space-x-2"
  title={user ? (isPlaying ? 'Pause Music' : 'Play Music') : 'Login to play music'}
>
  {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
</button>


            </div>


            {/* Right icons */}
            <div className="flex space-x-4 items-center">
              <button onClick={() => setShowMessages(!showMessages)} className="text-gray-700 hover:text-black p-2">
                <FaCommentAlt className="w-5 h-5" />
              </button>

              <button onClick={() => setSearchOpen(!searchOpen)} className="text-gray-700 hover:text-black p-2">
                <FaSearch className="w-5 h-5" />
              </button>

              <Link to="/cart" className="text-gray-700 hover:text-black relative p-2">
                <FaShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 text-xs bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden text-gray-700 hover:text-black p-2"
              >
                {isOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search dropdown */}
        <motion.div
          variants={searchVariants}
          initial="closed"
          animate={searchOpen ? 'open' : 'closed'}
          transition={{ type: 'tween', duration: 0.3 }}
          className="bg-white border-y"
        >
          <div className="max-w-7xl mx-auto px-4 py-4 relative">
            <input
              type="text"
              value={searchText}
              onChange={handleSearchChange}
              autoFocus
              placeholder="Search products..."
              className="w-full p-3 border border-gray-300 rounded"
            />
            {suggestions.length > 0 && (
              <div className="absolute bg-white shadow rounded w-full top-full left-0 z-40 max-h-60 overflow-y-auto">
                {suggestions.map((product) => (
                  <div
                    key={product.id}
                    className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => handleSuggestionClick(product.id)}
                  >
                    {product.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* MOBILE MENU */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0 }}
          className="md:hidden overflow-hidden"
        >
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link to="/" className="block text-gray-700 hover:text-black">HOME</Link>
            <Link to="/product" className="block text-gray-700 hover:text-black">SHOP</Link>
            <Link to="/about" className="block text-gray-700 hover:text-black">ABOUT</Link>
            <Link to="/studio" className="block text-gray-700 hover:text-black">STUDIO</Link>
            <Link to="/order" className="block text-gray-700 hover:text-black">YOUR ORDER</Link>

            {admin && (
              <>
                <Link to="/admin" className="block text-gray-700 hover:text-black">ADMIN</Link>
                <Link to="/create-product" className="block text-gray-700 hover:text-black">CREATE PRODUCT</Link>
              </>
            )}

            {!user && (
              <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                Login
              </Link>
            )}

          </div>
        </motion.div>
      </nav>

      {/* Message sidebar */}
      {showMessages && (
        <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 border-l px-4 py-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">📩 Messages</h2>
            <button onClick={() => setShowMessages(false)} className="text-2xl text-gray-600 hover:text-red-600">
              &times;
            </button>
          </div>

          {messages.length === 0 ? (
            <p className="text-gray-500">No messages found.</p>
          ) : (
            <ul className="space-y-3">
              {messages.map((msg, i) => (
                <li key={i} className="bg-gray-100 p-3 rounded">{msg.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}

    </>
  );
};

export default Navbar;
