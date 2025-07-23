import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/FirebaseConfig';

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [form, setForm] = useState({ title: '', description: '', price: '', image: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Fetch product details on mount
    useEffect(() => {
        async function fetchProduct() {
            try {
                const ref = doc(db, 'products', id);
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    setProduct(snap.data());
                    setForm({
                        title: snap.data().title,
                        price: snap.data().price,
                        description: snap.data().description,
                        image: snap.data().image || ''
                    });
                } else {
                    setError('Product not found.');
                }
            } catch (err) {
                setError('Failed to load product.');
            }
            setLoading(false);
        }
        fetchProduct();
    }, [id]);

    // Handle form input changes
    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    // Handle product update
    async function handleUpdate(e) {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccessMsg('');
        try {
            const ref = doc(db, 'products', id);
            await updateDoc(ref, {
                title: form.title,
                price: parseFloat(form.price),
                description: form.description,
                image: form.image,
            });
            setSuccessMsg('Product updated successfully!');
        } catch (err) {
            setError('Error updating product.');
        }
        setSaving(false);
    }

    // Handle product delete
    async function handleDelete() {
        if (window.confirm('Are you sure you want to delete this product? This cannot be undone.')) {
            setDeleting(true);
            setError('');
            try {
                const ref = doc(db, 'products', id);
                await deleteDoc(ref);
                navigate('/'); // Go back to product list or homepage (change as needed)
            } catch (err) {
                setError('Error deleting product.');
            }
            setDeleting(false);
        }
    }

    if (loading) {
        return <div className="max-w-2xl mx-auto p-8 text-center text-gray-500">Loading...</div>;
    }
    if (error) {
        return <div className="max-w-2xl mx-auto p-8 text-center text-red-500">{error}</div>;
    }
    if (!product) {
        return null;
    }

    return (
        <section className="py-10 px-4 bg-gray-50 min-h-screen">
            <div className="max-w-xl bg-white mx-auto rounded-xl shadow-md p-8">
                <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

                <form onSubmit={handleUpdate} className="space-y-6">
                    {/* Image URL & Preview */}
                    <div>
                        <label className="block font-semibold">Image URL</label>
                        <input
                            type="text"
                            name="image"
                            value={form.image}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                        {form.image && (
                            <img
                                src={form.image}
                                alt="Product Preview"
                                className="h-40 w-full object-contain mt-3 border rounded"
                            />
                        )}
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block font-semibold">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block font-semibold">Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                            min={0}
                            step={0.01}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block font-semibold">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            rows={4}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-3 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 transition disabled:opacity-60"
                    >
                        {saving ? 'Saving...' : 'Update Product'}
                    </button>
                </form>

                {successMsg && <div className="text-green-600 mt-4">{successMsg}</div>}
                {error && <div className="text-red-600 mt-4">{error}</div>}

                <hr className="my-8" />

                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-full py-3 rounded bg-red-600 text-white font-bold hover:bg-red-700 transition disabled:opacity-60"
                >
                    {deleting ? 'Deleting...' : 'Delete Product'}
                </button>
            </div>
        </section>
    );
}
