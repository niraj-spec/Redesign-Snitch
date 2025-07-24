import React, { useState } from 'react';
import Marquee from 'react-fast-marquee';

const messages = 'ORDERS SHIP WITHIN 24 HOURS 🚀 //FREE 7DAY RETURNS 🏃 //MADE IN INDIA FOR THE WORLD 🌍 //Flat 16% Off on purchases above 4490 🏃 //'
  .split('//')
  .map(msg => msg.trim())  // trim to remove leading/trailing spaces
  .filter(Boolean);        // remove empty strings if any

export default function MarqueeLetters() {
  const [selectedIdx, setSelectedIdx] = useState(null);

  return (
    <div className="bg-gray-100 py-6">
      <Marquee
        speed={60}
        pauseOnHover={true}
        gradient={false}
        className="select-none"
      >
        {messages.map((msg, idx) => (
          <span
            key={`${msg}-${idx}`}
            onClick={() => setSelectedIdx(idx)}
            className={`
              mx-4 px-3 text-2xl font-semibold cursor-pointer whitespace-nowrap
              transition-colors duration-200 ease-in-out rounded
              ${selectedIdx === idx
                ? 'bg-white text-black'
                : 'bg-transparent text-gray-800 hover:bg-gray-200 hover:text-black'}
            `}
          >
            {msg}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
