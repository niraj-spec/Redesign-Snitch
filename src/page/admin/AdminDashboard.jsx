import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase/FirebaseConfig';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Message to auto-send
  const defaultAdminMessage = "👋 Welcome to Activo! We're glad to have you.";

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const userSnap = await getDocs(collection(db, 'users'));
        const orderSnap = await getDocs(collection(db, 'orders'));
        const messageSnap = await getDocs(collection(db, 'messages'));

        const usersList = userSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const ordersList = orderSnap.docs.map(doc => doc.data());
        const messageList = messageSnap.docs.map(doc => doc.data());

        setUsers(usersList);
        setOrders(ordersList);
        setMessages(messageList);

        // ✅ Auto-send welcome admin message to new users
        usersList.forEach(user => {
          const alreadySent = messageList.some(
            msg => msg.userId === user.id && msg.isFromAdmin && msg.auto === true
          );

          if (!alreadySent) {
            const messageRef = doc(db, 'messages', `${user.id}_admin_welcome`);
            setDoc(messageRef, {
              userId: user.id,
              message: defaultAdminMessage,
             
              isFromAdmin: true,
              auto: true,           // ✅ Used to prevent duplicate sending
              unread: true          // ✅ Used to show unread badge
            });
          }
        });

        setLoading(false);
      } catch (err) {
        console.error("Error loading admin data:", err);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const getOrderCount = (userId) => {
    return orders.filter(order => order.userId === userId).length;
  };

  const getUserMessage = (userId) => {
    const msg = messages.find(m => m.userId === userId && m.isFromAdmin);
    return msg?.message || "No message sent.";
  };

  if (loading) return <div className="p-6">Loading admin dashboard...</div>;

  return (
    <section className="p-6 min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-6">🛠 Admin Dashboard</h1>
        <p className="text-sm text-gray-600 mb-4">Default message: <em>{defaultAdminMessage}</em></p>

        <div className="space-y-4">
          {users.map((user, i) => (
            <div key={i} className="border p-4 bg-gray-50 rounded">
              <p><strong>👤 User ID:</strong> {user.id}</p>
              <p><strong>📦 Orders:</strong> {getOrderCount(user.id)}</p>
              <p className="text-sm"><strong>📩 Message:</strong> {getUserMessage(user.id)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
