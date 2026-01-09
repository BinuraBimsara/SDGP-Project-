import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from './ui/button';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Check scroll position of the document
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll listener
    window.addEventListener('scroll', toggleVisibility);
    document.addEventListener('scroll', toggleVisibility);
    
    // Check immediately on mount
    toggleVisibility();
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      document.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Also try scrolling the document element
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-20 right-4 z-50 h-12 w-12 rounded-full bg-green-600 dark:bg-gradient-to-r dark:from-emerald-600 dark:to-teal-600 hover:bg-green-700 dark:hover:from-emerald-700 dark:hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <ChevronUp className="h-6 w-6" />
    </Button>
  );
}