import React, { useState } from "react";

const FAQS = [
  { question: "How do I place an order?", answer: "To place an order, simply browse our collection, select your desired size and click 'Add to Cart'. Complete the checkout process by entering your address and payment details." },
  { question: "How do I track my order?", answer: "Once your order is shipped, you’ll receive a tracking link via email and SMS. You can also log in to your Snitch account and view the 'My Orders' section." },
  { question: "Can I cancel or modify my order?", answer: "Orders can be cancelled before they're dispatched..." },
  { question: "What payment methods are accepted?", answer: "We accept all major credit/debit cards, UPI, net banking, and Cash on Delivery for selected pin codes." },
  { question: "What is the return/exchange policy?", answer: "We offer hassle-free returns or exchanges within 7 days of delivery." },
  { question: "How do I contact customer support?", answer: "You can reach us via email at help@snitch.co.in or on WhatsApp at +91 6366966283." },
  { question: "How can I use a discount code?", answer: "You can enter your discount code during checkout before payment." },
  { question: "Do you offer international shipping?", answer: "Currently we only ship within India." },
  // ...add more for a long FAQ on PC!
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="bg-white min-h-screen py-10">
      <section className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-4xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {FAQS.map((item, idx) => (
            <div key={idx} className="border-b border-gray-200 bg-white rounded-lg shadow-sm">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between py-6 px-4 focus:outline-none text-left"
                aria-expanded={openIndex === idx}
              >
                <span className="text-xl font-medium text-gray-900">{item.question}</span>
                <svg
                  className={`w-6 h-6 transition-transform ${openIndex === idx ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === idx && (
                <div className="px-8 pb-6 text-gray-700 text-lg">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="mt-12 text-base text-center text-gray-500">
          Still have a question? Contact us at <a className="text-blue-600 underline" href="mailto:help@snitch.co.in">help@snitch.co.in</a>
        </p>
      </section>
    </div>
  );
}
