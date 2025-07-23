import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../firebase/FirebaseConfig"; // ✅ adjust path to your config
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate(); 
  const [firebaseError, setFirebaseError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    setFirebaseError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // ✅ Save to localStorage
      localStorage.setItem("user", JSON.stringify({
        email: user.email,
        uid: user.uid,
      }));

      toast.success("✅ Logged in successfully!");
      reset();

      
       navigate("/");
    } catch (error) {
      console.error("Firebase login error:", error);

      if (error.code === "auth/user-not-found") {
        setFirebaseError("❌ User not found. Please register first.");
      } else if (error.code === "auth/wrong-password") {
        setFirebaseError("❌ Incorrect password.");
      } else {
        setFirebaseError("❌ Login failed. Please try again.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      toast.success('👋 Logged out!');
      
    } catch (error) {
      console.error("Logout error:", error);
      toast.error('❌ Logout failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      {/* 👋 Welcome Image */}
      <img
        src="https://illustrations.popsy.co/gray/astronaut-light.svg"
        alt="Welcome back"
        className="w-48 md:w-60 mb-6 transition-transform duration-300 hover:scale-105"
      />

      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">Welcome Back</h1>
      <p className="text-gray-500 mb-6 text-center">Login to access your dashboard</p>

      {/* 💻 Login Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl space-y-5"
      >
        {/* Firebase Error */}
        {firebaseError && (
          <p className="text-red-600 text-center text-sm font-medium">
            {firebaseError}
          </p>
        )}

        {/* Email */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Email</label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Invalid email address",
              },
            })}
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block font-semibold text-gray-700 mb-1">Password</label>
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters required",
              },
            })}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 transition"
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow-lg transform hover:scale-105 transition"
        >
          Login
        </button>

        {/* Optional Logout */}
        {localStorage.getItem("user") && (
          <button
            type="button"
            onClick={handleLogout}
            className="w-full mt-2 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold rounded transition"
          >
            Logout
          </button>
        )}

        {/* ⏩ Register Link */}
        <div className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register here
          </a>
        </div>
      </form>
    </div>
  );
}
