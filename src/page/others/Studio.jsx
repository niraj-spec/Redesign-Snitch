import React from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import Footer from "../../components/Footer";

const studioAddress = {
  name: "Snitch Studio",
  street: "BLDG 16, 1st Floor, Industrial Area",
  area: "Koramangala, Bengaluru",
  city: "Bangalore",
  state: "Karnataka",
  zip: "560034",
  country: "India"
};

const contactDetails = {
  email: "studio@snitch.co.in",
  phone: "+91 98765 43210"
};

const Studio = () => (
    <>
  <section className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-16 px-4 flex items-center">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 90, duration: 0.7 }}
      className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-indigo-100"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="text-4xl font-extrabold text-indigo-700 mb-4"
      >
        Welcome to Snitch Studio
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="text-lg text-gray-600 mb-8"
      >
        Where creativity meets craftsmanship and every stitch tells a story. Snitch Studio is the hub for our trendsetting innovations—right in the heart of Bengaluru’s vibrant design district. Our in-house team crafts unique concepts, experiments with new styles, and pushes boundaries to define the new language of Indian fashion.
      </motion.p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Where we are situated */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="bg-indigo-50 rounded-xl p-6 flex flex-col"
        >
          <div className="flex items-center mb-3 text-indigo-600">
            <FaMapMarkerAlt className="mr-2" />
            <span className="font-semibold text-lg">Location</span>
          </div>
          <div className="ml-1 text-gray-700">
            <p className="font-medium">{studioAddress.name}</p>
            <p>{studioAddress.street}</p>
            <p>{studioAddress.area}</p>
            <p>
              {studioAddress.city}, {studioAddress.state} {studioAddress.zip}
            </p>
            <p>{studioAddress.country}</p>
          </div>
        </motion.div>

        {/* Contact Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="bg-blue-50 rounded-xl p-6 flex flex-col"
        >
          <div className="flex items-center mb-3 text-blue-700">
            <FaEnvelope className="mr-2" />
            <span className="font-semibold text-lg">Contact</span>
          </div>
          <div className="ml-1 text-gray-700 space-y-2">
            <p className="flex items-center">
              <FaEnvelope className="mr-2 text-blue-400" />
              <a href={`mailto:${contactDetails.email}`} className="hover:underline">
                {contactDetails.email}
              </a>
            </p>
            <p className="flex items-center">
              <FaPhone className="mr-2 text-blue-400" />{" "}
              <a href={`tel:${contactDetails.phone.replace(/\s+/g, "")}`}>
                {contactDetails.phone}
              </a>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Studio visit CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.7 }}
        className="mt-10 text-center"
      >
        <span className="text-indigo-600 text-base font-semibold">
          Interested in a collaboration or want to see the magic in person?
        </span>
        <br />
        <a
          href={`mailto:${contactDetails.email}`}
          className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-indigo-700 font-medium transition"
        >
          Get in Touch
        </a>
      </motion.div>
    </motion.div>
  </section>
  <Footer/>
  </>
);

export default Studio;
