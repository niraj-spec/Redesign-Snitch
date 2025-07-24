import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const images = [
    {
        src: '/photo2.webp',
        alt: 'Shirt Collection',
        filter: 'shirt',
    },
    {
        src: '/photo5.webp',
        alt: 'Jeans Collection',
        filter: 'jeans',
    },
    {
        src: '/photo4.webp',
        alt: 'T-Shirt Collection',
        filter: 'tshirt',
    },
    {
        src: '/perfume.webp',
        alt: 'Perfume Collection',
        filter: 'perfume',
    },
];

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 2500);
        return () => clearInterval(slideInterval);
    }, []);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const handleRedirect = (filter) => {
        navigate(`/product?category=${filter}`);
    };

    return (
        <section className="relative h-screen flex items-center bg-gray-50">
            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                {/* Text Section */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                        Crafted to seamlessly blend <span className="italic">fashion</span> with{' '}
                        <span className="italic">function</span>.
                    </h1>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/products')}
                        className="bg-black text-white px-8 py-3 text-sm font-medium tracking-wide hover:bg-gray-800 transition-colors duration-200"
                    >
                        SHOP NEW ARRIVALS
                    </motion.button>
                </motion.div>

                {/* Hero Slider */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative w-full h-[60vh] sm:h-[70vh] md:h-[85vh] overflow-hidden rounded-lg shadow-lg"
                >
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image.src}
                            alt={image.alt}
                            loading="lazy"
                            onClick={() => handleRedirect(image.filter)}
                            className={`absolute w-full h-full object-cover rounded-lg cursor-pointer transition-opacity duration-700 ease-in-out ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'}`}
                        />
                    ))}

                    {/* Buttons */}
                    <div className="absolute inset-0 flex justify-between items-center px-4">
                        <button
                            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                            onClick={() =>
                                setCurrentSlide((prev) =>
                                    prev === 0 ? images.length - 1 : prev - 1
                                )
                            }
                        >
                            <FaArrowLeft />
                        </button>
                        <button
                            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                            onClick={() =>
                                setCurrentSlide((prev) => (prev + 1) % images.length)
                            }
                        >
                            <FaArrowRight />
                        </button>
                    </div>

                    {/* Dots */}
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {images.map((_, idx) => (
                            <span
                                key={idx}
                                onClick={() => goToSlide(idx)}
                                className={`h-2 w-2 rounded-full cursor-pointer transition-colors ${currentSlide === idx ? 'bg-white' : 'bg-white/60'
                                    }`}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
