import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/FirebaseConfig'; // ✅ import auth too
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const password = watch('password');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const togglePassword = () => setShowPassword((p) => !p);
  const toggleConfirm = () => setShowConfirm((p) => !p);

 const onSubmit = async (data) => {
  try {
    const { confirmPassword, ...userData } = data;

    // ✅ 1. Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );

    const user = userCredential.user;

    // ✅ 2. Set display name in Firebase Auth
    await updateProfile(user, {
      displayName: userData.name,
    });

    // ✅ 3. Save user info in Firestore with empty cart
    const userInfo = {
      uid: user.uid,
      name: userData.name,
      email: userData.email,
      createdAt: new Date(),
      cart: [], // 👈 very important - user's own isolated cart
    };

    await addDoc(collection(db, 'users'), userInfo);

    toast.success('✅ Registration successful!');
    reset();
  } catch (error) {
    console.error("❌ Error:", error);
    
    toast.error("Registration failed: " + error.message);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-100 flex flex-col justify-center items-center p-4">
      <img
        src="https://illustrations.popsy.co/gray/web-design.svg"
        alt="Welcome"
        className="w-48 md:w-60 mb-6 transition-transform duration-300 hover:scale-105"
      />
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-700 mb-2">Welcome to Your Website</h1>
      <p className="text-gray-500 mb-6 text-center">Register below to get started.</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg space-y-5 transition-all"
      >
        {/* Full Name */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Full Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            placeholder="John Doe"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Invalid email address',
              },
            })}
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded"
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block mb-1 font-medium text-gray-700">Password</label>
          <input
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Minimum 6 characters' },
            })}
            type={showPassword ? 'text' : 'password'}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded"
            placeholder="•••••••"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute top-9 right-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FiEyeOff size={20}/> : <FiEye size={20}/>}
          </button>
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
          <input
            {...register('confirmPassword', {
              required: 'Confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
            type={showConfirm ? 'text' : 'password'}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded"
            placeholder="•••••••"
          />
          <button
            type="button"
            onClick={toggleConfirm}
            className="absolute top-9 right-3 text-gray-500 hover:text-gray-700"
          >
            {showConfirm ? <FiEyeOff size={20}/> : <FiEye size={20}/>}
          </button>
          {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-transform hover:scale-105"
        >
          Register
        </button>
      </form>
    </div>
  );
}
