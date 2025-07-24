import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase/FirebaseConfig";
import { Link, useNavigate } from "react-router-dom";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const q = query(collection(db, "orders"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const userOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort orders by newest first
        setOrders(userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders", err);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <div className="p-6 text-gray-500">Loading your orders...</div>;

  return (
    <section className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">🛒 Your Orders</h1>

        {orders.length === 0 ? (
          <p className="text-gray-600">You have not placed any orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border rounded p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">
                    <Link to={`/order/${order.id}`} className="text-blue-600 hover:underline">
                      Order #{order.id.slice(-6)}
                    </Link>
                  </h2>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                </div>

                <div className="text-sm text-gray-600 mb-3">
                  <p><strong>Name:</strong> {order.shippingInfo.fullName}</p>
                  <p><strong>Address:</strong> {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.state} - {order.shippingInfo.zip}</p>
                  <p><strong>Phone:</strong> {order.shippingInfo.phone}</p>
                </div>

                <div className="divide-y">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center py-2">
                      <img src={item.image} alt={item.title} className="w-12 h-12 rounded border mr-4 object-cover" />
                      <div className="flex flex-col flex-1 min-w-0">
                        <p className="font-medium truncate">{item.title}</p>
                        <div className="text-xs text-gray-500 flex flex-wrap gap-2">
                          <span>₹{item.price} × {item.quantity}</span>
                          {item.size && (
                            <span className="text-gray-600">Size: <strong>{item.size}</strong></span>
                          )}
                        </div>
                      </div>
                      <div className="font-semibold ml-4 whitespace-nowrap">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-sm mt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span><span>{order.shipping === 0 ? "Free" : `₹${order.shipping}`}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span><span>- ₹{order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total Paid</span><span>₹{order.total.toFixed(2)}</span>
                  </div>
                  {order.coupon && (
                    <p className="text-xs text-green-500 mt-1">Coupon Applied: <strong>{order.coupon}</strong></p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Order;
