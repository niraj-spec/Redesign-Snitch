import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#18181b] text-gray-200 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        {/* Brand Section */}
        <div className="mb-6 md:mb-0 min-w-[180px]">
          <h2 className="text-3xl font-bold tracking-tight mb-3 text-white">SNITCH</h2>
          <p className="text-gray-400">
            Fast fashion for modern men. Redefining style every day.
          </p>
        </div>

        {/* Navigation Links */}
        {/* Flex container now flex-col on mobile, flex-row on md+ screens, and allows wrapping */}
        <div className="flex flex-col md:flex-row md:gap-12 gap-6 flex-wrap">
          <div className="min-w-[140px]">
            <h3 className="text-lg font-semibold mb-2 text-white">Shop</h3>
            <ul>
              <li>
                <a
                  href="/product"
                  className="transition text-gray-300 hover:text-[#21e672] hover:pl-2 duration-300 block"
                >
                  New Arrivals
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="transition text-gray-300 hover:text-[#21e672] hover:pl-2 duration-300 block"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="transition text-gray-300 hover:text-[#21e672] hover:pl-2 duration-300 block"
                >
                  Studio
                </a>
              </li>
              <li>
                <a
                  href="/order"
                  className="transition text-gray-300 hover:text-[#21e672] hover:pl-2 duration-300 block"
                >
                  Your Order
                </a>
              </li>
            </ul>
          </div>

          <div className="min-w-[140px]">
            <h3 className="text-lg font-semibold mb-2 text-white">Customer</h3>
            <ul>
              <li>
                <a
                  href="/"
                  className="transition text-gray-300 hover:text-[#21e672] hover:pl-2 duration-300 block"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition text-gray-300 hover:text-[#21e672] hover:pl-2 duration-300 block"
                >
                  Shipping
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition text-gray-300 hover:text-[#21e672] hover:pl-2 duration-300 block"
                >
                  Returns
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="transition text-gray-300 hover:text-[#21e672] hover:pl-2 duration-300 block"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Connect Section with horizontal wrapping and truncation */}
          <div className="min-w-[140px]">
            <h3 className="text-lg font-semibold mb-2 text-white">Connect</h3>
            <ul className="flex flex-wrap gap-4">
              <li>
                <a
                  href="#"
                  className="group flex items-center gap-2 text-gray-300 transition hover:text-[#21e672] duration-300 min-w-0 truncate"
                >
                  <span className="group-hover:scale-125 transform transition duration-300">
                    💬
                  </span>{" "}
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="group flex items-center gap-2 text-gray-300 transition hover:text-[#21e672] duration-300 min-w-0 truncate"
                >
                  <span className="group-hover:scale-125 transform transition duration-300">
                    📸
                  </span>{" "}
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="group flex items-center gap-2 text-gray-300 transition hover:text-[#21e672] duration-300 min-w-0 truncate"
                >
                  <span className="group-hover:scale-125 transform transition duration-300">
                    📘
                  </span>{" "}
                  Facebook
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
