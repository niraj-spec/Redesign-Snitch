// Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#18181b] text-gray-200 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        {/* Brand Section */}
        <div className="mb-6 md:mb-0">
          <h2 className="text-3xl font-bold tracking-tight mb-3 text-white">SNITCH</h2>
          <p className="text-gray-400">Fast fashion for modern men. Redefining style every day.</p>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-12">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">Shop</h3>
            <ul>
              <li><a href="#" className="transition text-gray-300 hover:text-[#21e672] hover:pl-2 duration-300">New Arrivals</a></li>
              <li><a href="#" className="transition text-gray-300 hover:text-[#21e672] hover:pl-2 duration-300">Best Sellers</a></li>
              <li><a href="#" className="transition text-gray-300 hover:text-[#21e672] hover:pl-2 duration-300">Clothing</a></li>
              <li><a href="#" className="transition text-gray-300 hover:text-[#21e672] hover:pl-2 duration-300">Accessories</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">Customer</h3>
            <ul>
              <li><a href="#" className="transition text-gray-300 hover:text-[#21e672] hover:pl-2 duration-300">FAQs</a></li>
              <li><a href="#" className="transition text-gray-300 hover:text-[#21e672] hover:pl-2 duration-300">Shipping</a></li>
              <li><a href="#" className="transition text-gray-300 hover:text-[#21e672] hover:pl-2 duration-300">Returns</a></li>
              <li><a href="#" className="transition text-gray-300 hover:text-[#21e672] hover:pl-2 duration-300">Support</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">Connect</h3>
            <ul>
              <li>
                <a href="#" className="group flex items-center gap-2 text-gray-300 transition hover:text-[#21e672] duration-300">
                  <span className="group-hover:scale-125 transform transition duration-300">💬</span> WhatsApp
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center gap-2 text-gray-300 transition hover:text-[#21e672] duration-300">
                  <span className="group-hover:scale-125 transform transition duration-300">📸</span> Instagram
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center gap-2 text-gray-300 transition hover:text-[#21e672] duration-300">
                  <span className="group-hover:scale-125 transform transition duration-300">📘</span> Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} SNITCH. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
