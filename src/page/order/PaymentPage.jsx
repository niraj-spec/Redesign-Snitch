import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/FirebaseConfig";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";

const PaymentPage = () => {
  const { state } = useLocation();
  const cartItems = state?.cartItems || [];
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [address, setAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });
  const [savedAddressExists, setSavedAddressExists] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState("");

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 250 ? 0 : 30;
  const total = subtotal + shipping - discount;

  const validCoupons = [
    { name: "SAVE15", percent: 15 },
    { name: "FIRST10", percent: 10 },
    { name: "LUCKY5", percent: 5 },
    { name: "WINMORE16", percent: 16 },
    { name: "NEWBIE50", percent: 20, onceOnly: true },
  ];

  // ✅ Handle coupon logic
  const handleApplyCoupon = () => {
    const matched = validCoupons.find(
      (c) => c.name.toLowerCase() === couponCode.toLowerCase()
    );

    if (!matched) {
      return setError("❌ Invalid coupon code");
    }

    if (matched.name === "NEWBIE50" && localStorage.getItem("newbie-applied")) {
      return setError("⚠ NEWBIE50 can only be used once.");
    }

    const discountAmount = (subtotal * matched.percent) / 100;
    setDiscount(discountAmount);
    setAppliedCoupon(matched.name);
    setError("");

    if (matched.name === "NEWBIE50") {
      localStorage.setItem("newbie-applied", "true");
    }
  };

  // ✅ Get current user and saved address from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
      if (currUser) {
        setUser(currUser);
        const userRef = doc(db, "users", currUser.uid);
        const userSnap = await getDoc(userRef);
        const data = userSnap.data();

        if (data?.shippingInfo) {
          setAddress(data.shippingInfo);
          setSavedAddressExists(true);
        }
        setLoadingUserData(false);
      } else {
        setUser(null);
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // ✅ Save address to Firestore
  const saveAddressToFirebase = async () => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      shippingInfo: address,
    });
    setSavedAddressExists(true);
    setEditingAddress(false);
    toast.success('✅ Address saved.');
  };

  // ✅ Delete saved address
  const deleteSavedAddress = async () => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      shippingInfo: {},
    });
    setAddress({
      fullName: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
    });
    setSavedAddressExists(false);
    toast.success('Address deleted.');
  };

  // ✅ Submit Payment
  const handlePay = async () => {
    if (
      !address.fullName ||
      !address.address ||
      !address.city ||
      !address.zip ||
      !address.phone
    ) {
      return alert("Please fill all address fields.");
    }

    try {
      // Save new order
      const orderRef = doc(db, "orders", `${user.uid}_${Date.now()}`);
      await setDoc(orderRef, {
        userId: user.uid,
        items: cartItems,
        shippingInfo: address,
        subtotal,
        shipping,
        discount,
        total,
        coupon: appliedCoupon || "",
        createdAt: new Date().toISOString(),
      });

      // ✅ Clear user's cart in Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        cart: [], // ⬅ clear cart
      });

      // ✅ Optional: Local message or redirect
      
      toast.success('✅ Payment processed! Order placed.');
      navigate("/order");
    } catch (err) {
      console.error("Error placing order:", err);
      toast.error('❌ Something went wrong while placing the order.');
    }
  };



  if (loadingUserData) {
    return <div className="p-6 text-gray-500">Loading user info...</div>;
  }

  return (
    <section className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">🧾 Checkout</h1>

        {/* Cart Items */}
        <div className="divide-y divide-gray-200 mb-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center py-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-14 h-14 object-cover rounded border mr-4"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 text-sm">{item.title}</h4>
                <p className="text-xs text-gray-500">₹{item.price} × {item.quantity} <div className="text-xs text-gray-500">
                  {item.size && (
                    <span className=" text-gray-600"> Size: <strong>{item.size}</strong></span>
                  )}
                </div></p>
              </div>
              <div className="text-sm font-bold">
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* User Address */}
        <div className="mb-6 border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">📍 Shipping Address</h2>

          {!editingAddress && savedAddressExists ? (
            <div className="bg-gray-50 p-4 rounded border text-sm space-y-1">
              <p><strong>Name:</strong> {address.fullName}</p>
              <p><strong>Address:</strong> {address.address}, {address.city}, {address.state}, {address.zip}</p>
              <p><strong>Phone:</strong> {address.phone}</p>

              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => setEditingAddress(true)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={deleteSavedAddress}
                  className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Full Name"
                value={address.fullName}
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, fullName: e.target.value }))
                }
                className="border px-4 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Phone"
                value={address.phone}
                onChange={(e) => setAddress((prev) => ({ ...prev, phone: e.target.value }))}
                className="border px-4 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Address"
                value={address.address}
                onChange={(e) => setAddress((prev) => ({ ...prev, address: e.target.value }))}
                className="border px-4 py-2 rounded col-span-2"
              />
              <input
                type="text"
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress((prev) => ({ ...prev, city: e.target.value }))}
                className="border px-4 py-2 rounded"
              />
              <input
                type="text"
                placeholder="State"
                value={address.state}
                onChange={(e) => setAddress((prev) => ({ ...prev, state: e.target.value }))}
                className="border px-4 py-2 rounded"
              />
              <input
                type="text"
                placeholder="ZIP Code"
                value={address.zip}
                onChange={(e) => setAddress((prev) => ({ ...prev, zip: e.target.value }))}
                className="border px-4 py-2 rounded"
              />
              {!savedAddressExists && (
                <button
                  onClick={saveAddressToFirebase}
                  className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  Save Address
                </button>
              )}
            </div>
          )}
        </div>

        {/* Coupon */}
        <div className="mb-6">
          <label className="font-semibold mb-1 block">💸 Apply Discount Code</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon"
              className="border px-4 py-2 rounded w-full sm:w-60"
            />
            <button
              onClick={handleApplyCoupon}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              Apply
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          {appliedCoupon && (
            <p className="text-green-600 text-sm mt-1">
              ✅ Coupon "<strong>{appliedCoupon}</strong>" applied − ₹{discount.toFixed(2)}
            </p>
          )}
        </div>

        {/* Summary */}
        <div className="text-sm space-y-2 border-t pt-4">
          <div className="flex justify-between">
            <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping > 0 ? `₹${shipping}` : "Free"}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600 font-semibold">
              <span>Discount</span><span>− ₹{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total Payable</span><span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePay}
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded font-bold hover:bg-indigo-700 transition"
        >
          Pay ₹{total.toFixed(2)}
        </button>
      </div>
    </section>
  );
};

export default PaymentPage;
