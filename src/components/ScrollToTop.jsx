import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop = () => {
  let [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  let scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[#ff4d00] text-white shadow-lg shadow-[#ff4d00]/30 hover:bg-[#ff6d33] transition-all duration-300 transform hover:scale-110 md:bottom-10 md:right-10"
      aria-label="Scroll to top"
    >
      <ArrowUp size={24} />
    </button>
  );
};
