import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import {
  updateEmail,
  updatePassword,
  deleteUser,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { auth, db } from '../../firebase/FirebaseConfig';
import { toast } from 'react-toastify';

export default function UserInfo() {
  const { register, reset, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [user, setUser] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState('');

  // 🔐 Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        reset({
          email: currentUser.email,
          username: currentUser.displayName || '',
          password: '',
        });
      } else {
        setUser(null);
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [reset, navigate]);

  // ✅ Handle Update Email + Password
  const onUpdate = async (data) => {
    try {
      if (!user) return;

      const updateTasks = [];

      if (data.email && data.email !== user.email) {
        updateTasks.push(updateEmail(user, data.email));
      }

      if (data.password) {
        updateTasks.push(updatePassword(user, data.password));
      }

      // Update Firestore Email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', user.uid));
      const snapshot = await getDocs(q);
      snapshot.forEach((docSnap) => {
        const userDocRef = doc(db, 'users', docSnap.id);
        updateDoc(userDocRef, { email: data.email });
      });

      await Promise.all(updateTasks);

      toast.success('✅ Account updated!');
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error('❌ Update failed: ' + err.message);
    }
  };

  // 🔐 Reauthenticate User & Delete Account + Firestore Doc
  const onDelete = async () => {
    if (!user) return;

    if (!confirmPassword) {
      alert('⚠️ Please enter your password to delete your account!');
      return;
    }

    try {
      // 1️⃣ Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, confirmPassword);
      await reauthenticateWithCredential(user, credential);

      // 2️⃣ Delete user in Firestore database
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', user.uid));
      const snapshot = await getDocs(q);

      snapshot.forEach(async (docSnap) => {
        const userDocRef = doc(db, 'users', docSnap.id);
        await deleteDoc(userDocRef);
      });

      // 3️⃣ Delete user from Firebase Auth
      await deleteUser(user);
      localStorage.removeItem('user');

      toast.success('👋 Account deleted successfully!');
      navigate('/register');
    } catch (err) {
      console.error(err);
      toast.error('❌ Deletion failed: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center p-6">
      <motion.form
        onSubmit={handleSubmit(onUpdate)}
        className="w-full max-w-lg bg-white/10 border border-white/20 rounded-xl backdrop-blur-xl p-8 space-y-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-white text-center">Your Account Info</h2>

        {/* Username (disabled displayName field) */}
        <div>
          <label className="block text-white/80 mb-1">Username</label>
          <input
            {...register('username')}
            disabled
            type="text"
            className="w-full px-4 py-2 bg-white/20 text-white rounded-lg border border-white/10 placeholder-white/50"
            placeholder="Display name handled via Auth"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-white/80 mb-1">Email</label>
          <input
            {...register('email', { required: true })}
            type="email"
            className="w-full px-4 py-2 bg-white/20 text-white rounded-lg border border-white/10 placeholder-white/50"
            placeholder="example@email.com"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-white/80 mb-1">New Password</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPass ? 'text' : 'password'}
              className="w-full px-4 py-2 bg-white/20 text-white rounded-lg border border-white/10 placeholder-white/50"
              placeholder="•••••••"
            />
            <button
              type="button"
              className="absolute right-3 top-[50%] translate-y-[-50%] text-white/70 hover:text-white transition"
              onClick={() => setShowPass((prev) => !prev)}
            >
              {showPass ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
        </div>

        {/* Confirm Password before delete */}
        <div>
          <label className="block text-white/80 mb-1">🔒 Password (for delete)</label>
          <input
            type={showPass ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 bg-white/20 text-white rounded-lg border border-white/10 placeholder-white/50"
            placeholder="Confirm password for delete"
          />
        </div>

        {/* Button Actions */}
        <div className="flex space-x-4 pt-2">
          <button
            type="submit"
            className="flex-1 py-2 text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:scale-105 transition"
          >
            Update
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex-1 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </motion.form>
    </div>
  );
}
