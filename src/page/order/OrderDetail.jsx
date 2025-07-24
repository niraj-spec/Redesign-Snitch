// src/pages/OrderDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const OrderDetail = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                navigate("/login");
                return;
            }

            try {
                const orderRef = doc(db, "orders", id);
                const orderSnap = await getDoc(orderRef);

                if (!orderSnap.exists()) {
                    alert("Order not found");
                    navigate("/order");
                    return;
                }

                const orderData = orderSnap.data();

                // Only allow user to view their own orders
                if (orderData.userId !== user.uid) {
                    alert("Unauthorized access");
                    navigate("/order");
                    return;
                }

                setOrder(orderData);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch order:", error);
                setLoading(false);
                alert("Something went wrong.");
            }
        });

        return () => unsubscribe();
    }, [id, navigate]);

    if (loading) return <div className="p-6 text-gray-500">Loading order details...</div>;

    return (
        <section className="min-h-screen p-6 bg-gray-100">
            <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-2">📦 Order Details</h1>
                <p className="text-sm text-gray-500 mb-4">
                    Order ID: <code className="break-all">{id}</code>
                </p>

                {/* Shipping Info */}
                <div className="mb-4 bg-gray-50 p-4 border rounded text-sm">
                    <h2 className="font-semibold mb-2">📍 Shipping Address</h2>
                    <p><strong>Name:</strong> {order.shippingInfo.fullName}</p>
                    <p><strong>Address:</strong> {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.state} - {order.shippingInfo.zip}</p>
                    <p><strong>Phone:</strong> {order.shippingInfo.phone}</p>
                </div>

                {/* Product Items */}
                <div className="divide-y mb-4">
                    {order.items.map((item, i) => (
                        <div key={i} className="flex items-center py-3">
                            <img src={item.image} alt={item.title} className="w-14 h-14 rounded border mr-4" />
                            <div className="flex-1 text-sm">
                                <p className="font-semibold">{item.title}</p>
                                <div className="text-gray-500 text-xs">₹{item.price} × {item.quantity}
                                    <div className="text-xs text-gray-500">
                                        {item.size && (
                                            <span className=" text-gray-600">Size: <strong>{item.size}</strong></span>)}
                                    </div>
                                    </div>
                            </div>
                            <div className="text-sm font-bold">₹{(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                    ))}
                </div>

                {/* Pricing Summary */}
                <div className="border-t pt-4 text-sm space-y-2">
                    <div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Shipping</span><span>{order.shipping === 0 ? "Free" : `₹${order.shipping}`}</span></div>
                    {order.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Discount</span><span>- ₹{order.discount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold border-t pt-2 text-base">
                        <span>Total Paid</span><span>₹{order.total.toFixed(2)}</span>
                    </div>
                    {order.coupon && (
                        <div className="text-green-600 text-xs">
                            Coupon Applied: <strong>{order.coupon}</strong>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default OrderDetail;
