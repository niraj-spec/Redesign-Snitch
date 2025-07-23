import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";

const UnauthWrapper = ({ children }) => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, [auth]);

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 text-lg">
        Checking authentication...
      </div>
    );
  }

  if (!user) {
    // User is NOT authenticated: show "Go login first" prompt
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="text-2xl font-bold text-gray-800 mb-2">Login Required</div>
        <div className="mb-4 text-gray-600">You must be logged in to use this feature.</div>
        <Link
          to="/login"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md font-semibold shadow hover:bg-blue-700"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  // User is authenticated: show wrapped content
  return children;
};

export default UnauthWrapper;
