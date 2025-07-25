import React from "react";
import { motion } from "framer-motion";
import Footer from "../../components/Footer";

const aboutVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.8, type: 'spring' } }
};

const stats = [
  { label: "Founded", value: "2020" },
  { label: "Made in", value: "India 🇮🇳" },
  { label: "Happy Customers", value: "1M+" },
  { label: "Styles Launched", value: "3000+" },
];

const About = () => (
  <>
  <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4">
    <div className="max-w-4xl mx-auto text-center">
      {/* Brand Logo & Animated */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 1.1 }}
        className="mb-8 flex justify-center"
      >
        <span className="bg-indigo-100 border border-indigo-400 text-3xl font-bold px-7 py-4 rounded-lg shadow-indigo-300 shadow uppercase tracking-wide text-indigo-600">
          Snitch
        </span>
      </motion.div>
      
      {/* Headline */}
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={aboutVariants}
        className="text-4xl sm:text-5xl font-extrabold mb-6 text-indigo-700"
      >
        Trailblazing <span className="text-indigo-500">Indian Menswear</span>
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial="hidden"
        animate="visible"
        variants={aboutVariants}
        className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed font-medium max-w-2xl mx-auto"
      >
        Born in India, made for the world—Snitch redefines fashion with street-savvy sensibility, sustainable innovation, and over 3000+ ever-fresh styles for every trendsetter. Step into the future of menswear. #MadeInIndia #SnitchSquad
      </motion.p>

      {/* Stats grid */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7, type: "spring" }}
        className="grid grid-cols-2 gap-6 sm:gap-12 mb-10 max-w-md mx-auto"
      >
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="bg-white rounded-xl shadow p-5 flex flex-col items-center border border-indigo-100"
          >
            <span className="text-indigo-600 text-2xl font-bold">{value}</span>
            <span className="text-gray-600 text-xs mt-1 uppercase tracking-widest font-semibold">{label}</span>
          </div>
        ))}
      </motion.div>

      {/* The Snitch Story */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1.1, type: "spring" }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-3">Our Journey</h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-5 max-w-2xl mx-auto">
          Since our launch in 2020, Snitch has rapidly grown from a disruptor to a cult favorite in India’s fashion sector. We dared to challenge the old search for basics by dropping thousands of distinct styles that blend international looks with Indian soul. Our belief? Fashion is for everyone, and freshness shouldn’t break the bank—so we offer new arrivals every week.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
          Built for the new-age consumer, Snitch’s D2C model puts you in the front seat of personalized, responsible shopping. From eco-forward fabrics to inclusive fits, our collections mirror the changing Indian spirit. Join the #SnitchSquad and let’s set trends together!
        </p>
      </motion.div>
    </div>
    {/* Team/Campaign or Image bar - placeholder for further enhancement */}
    <div className="flex justify-center mt-12">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="w-[260px] h-[110px] rounded-xl bg-indigo-200 flex flex-col items-center justify-center shadow-lg border border-indigo-300"
      >
        <span className="mb-2 text-indigo-700 text-lg">🌱 Sustainable</span>
        <span className="mb-1 text-xs uppercase tracking-widest text-indigo-800">Style. Comfort. Impact.</span>
      </motion.div>
    </div>
  </section>
  <Footer/>
  </>
);

export default About;
