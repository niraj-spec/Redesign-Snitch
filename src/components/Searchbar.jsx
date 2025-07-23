import React, { useState } from 'react';

export default function SearchBar({ products, onSelect }) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Update suggestions on input change
  const handleInputChange = (e) => {
    const input = e.target.value;
    setValue(input);
    if (input.length > 0) {
      // Case-insensitive match, limit to 5
      const filtered = products
        .filter(p =>
          p.title.toLowerCase().includes(input.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (product) => {
    setValue(product.title);
    setShowSuggestions(false);
    if (onSelect) onSelect(product);
  };

  return (
    <div style={{ position: 'relative', width: '300px' }}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(suggestions.length > 0)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        placeholder="Search products..."
        className="border rounded p-2 w-full"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div
          className="absolute z-10 bg-white border rounded shadow w-full"
          style={{ top: '100%' }}
        >
          {suggestions.map(prod => (
            <div
              key={prod.id}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSuggestionClick(prod)}
            >
              {prod.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
