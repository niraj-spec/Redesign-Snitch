// MarqueeLetters.jsx
import React, { useState } from 'react';
import Marquee from 'react-fast-marquee';

const letters = 'ORDERS SHIP WITHIN 24 HOURS //FREE 7DAY RETURNS //MADE IN INDIA FOR THE WORLD //Flat 16% Off on purchases above 4490 //'.split('');

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
        {letters.map((char, idx) => (
          <span
            key={`${char}-${idx}`}
            onClick={() => setSelectedIdx(idx)}
            className={`
              mx-2 px-1 text-2xl font-semibold cursor-pointer
              transition-colors duration-200 ease-in-out
              ${selectedIdx === idx
                ? 'bg-white text-black'
                : 'bg-transparent text-gray-800 hover:bg-gray-200 hover:text-black'}
            `}
          >
            {char}
          </span>
        ))}
      </Marquee>
    </div>
  );
}

