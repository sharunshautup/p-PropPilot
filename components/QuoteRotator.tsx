import React, { useState, useEffect } from 'react';
import { MOTIVATIONAL_QUOTES } from '../constants';

const QuoteRotator: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % MOTIVATIONAL_QUOTES.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-slate-900 p-6 rounded-2xl shadow-xl flex items-center justify-center transition-all duration-500 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-brand-lime"></div>
      <p className="text-lg font-semibold italic text-slate-800 leading-snug animate-fade-in relative z-10">
        "{MOTIVATIONAL_QUOTES[index]}"
      </p>
    </div>
  );
};

export default QuoteRotator;