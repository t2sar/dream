import React, { useEffect } from 'react';

/**
 * Global Theme Wrapper mapping for Playful Organic Modernism
 * 
 * In a Tailwind setup, the CSS tokens are defined in index.css.
 * This provider ensures that the root element receives the correct
 * base background and text color tokens, enforcing cascade across 
 * all screens and dialogues.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Explicitly apply the background token to the HTML document body
    // to prevent any system dark-mode overrides or unstyled gaps outside the root div.
    document.documentElement.classList.add('bg-background-main', 'text-primary-anchor');
    document.body.classList.add('bg-background-main', 'text-primary-anchor', 'antialiased');
    
    return () => {
      document.documentElement.classList.remove('bg-background-main', 'text-primary-anchor');
      document.body.classList.remove('bg-background-main', 'text-primary-anchor', 'antialiased');
    };
  }, []);

  return (
    <div className="bg-background-main text-primary-anchor min-h-screen w-full selection:bg-accent-blush selection:text-primary-anchor">
      {children}
    </div>
  );
};
