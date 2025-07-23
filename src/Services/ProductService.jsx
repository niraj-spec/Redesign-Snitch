// src/services/productService.js
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc , limit } from 'firebase/firestore';
import { db } from '../firebase/FirebaseConfig';

export const getAllProducts = async () => {
  const querySnapshot = await getDocs(collection(db, 'products'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const addProduct = async (productData) => {
  return await addDoc(collection(db, 'products'), productData);
};

export const updateProduct = async (productId, updateData) => {
  return await updateDoc(doc(db, 'products', productId), updateData);
};

export const deleteProduct = async (productId) => {
  return await deleteDoc(doc(db, 'products', productId));
};
