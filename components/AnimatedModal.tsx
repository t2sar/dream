import React, { useState, useEffect } from 'react';

export interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  alignment?: 'center' | 'bottom';
}

export const AnimatedModal: React.FC<AnimatedModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  className = '', 
  alignment = 'center' 
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 200); // Wait for transition out (Exit: 200ms)
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  if (!shouldRender) return null;

  const getPositionClasses = () => {
    if (alignment === 'bottom') {
      return 'items-end sm:items-center pt-24';
    }
    return 'items-center';
  };

  const getAnimationClasses = () => {
    if (alignment === 'bottom') {
      // Bottom sheet animation
      return isClosing 
        ? 'opacity-0 translate-y-full transition-all duration-200 ease-in' // Exit
        : 'animate-in fade-in slide-in-from-bottom-[10%] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]'; // Enter
    }
    // Center popup animation: Organic popup
    return isClosing 
      ? 'opacity-0 scale-90 transition-all duration-200 ease-in' // Exit: Fade-Out + Scale-Down (100% to 90%) over 200ms ease-in
      : 'animate-in fade-in zoom-in-[0.85] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]'; // Enter: Fade-In + Scale-Up (85% to 100%)
  };

  return (
    <div className={`fixed inset-0 z-[100] flex justify-center p-4 sm:p-6 overflow-y-auto ${getPositionClasses()}`}>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm ${
          isClosing ? 'opacity-0 transition-opacity duration-200 ease-in' : 'animate-in fade-in duration-300 ease-out'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div 
        className={`relative w-full transform-gpu will-change-transform max-w-2xl bg-surface-soft border border-surface-alt rounded-[32px] p-6 sm:p-8 shadow-2xl overflow-hidden ${getAnimationClasses()} ${alignment === 'bottom' ? 'mt-auto pb-6 sm:pb-0' : ''} ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

