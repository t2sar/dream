import React from 'react';
import { PlantType, PlantHealthStatus, PlantStage } from '../types';
import { PLANT_ICONS_CONFIG, PlantIconConfig } from './plantIconRegistry';
import { Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
// import { PlantSvgShape } from './PlantAssets';
const PlantSvgShape = React.lazy(() => import('./PlantAssets').then(module => ({ default: module.PlantSvgShape })));

interface PlantIconProps {
  plantType?: PlantType;
  stage?: PlantStage;
  status?: PlantHealthStatus | 'Protected' | 'Completed' | 'Resting';
  className?: string; // e.g. "w-12 h-12"
  size?: number | string; // override size if passed
  showFace?: boolean;
  styleMode?: 'Auto' | 'SVG' | 'Emoji';
  isPrivate?: boolean;
  isLocked?: boolean;
  isArchived?: boolean;
  isLegendary?: boolean;
  health?: number; // health score out of 100
  isGolden?: boolean;
}

export const PlantIcon: React.FC<PlantIconProps> = React.memo(({ 
  plantType = "Mango / Aam", 
  stage = "Fruiting Plant", 
  status = "Normal", 
  className = "w-12 h-12",
  size,
  showFace = true,
  styleMode = 'Auto',
  isPrivate = false,
  isLocked = false,
  isArchived = false,
  isLegendary = false,
  health,
  isGolden = false,
}) => {
  if (isPrivate) {
    return (
      <div className={`relative flex items-center justify-center bg-surface-alt rounded-full ${className}`} style={size ? { width: size, height: size } : {}}>
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full opacity-60">
          <path d="M32 12C32 12 44 4 52 16C60 28 48 44 32 60C16 44 4 28 12 16C20 4 32 12 32 12Z" fill="#8FCFAD" stroke="#4E453C" strokeWidth="3" strokeLinejoin="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pt-2">
          <div className="bg-surface-card p-1.5 rounded-full shadow-md border border-surface-alt">
            <Lock className="w-4 h-4 text-muted-text" />
          </div>
        </div>
      </div>
    );
  }

  const config = PLANT_ICONS_CONFIG[plantType as PlantType];
  if (!config) {
     return <div className={`flex items-center justify-center bg-surface-alt rounded-full text-2xl ${className}`} style={size ? { width: size, height: size } : {}}>🌱</div>;
  }

  const { emoji, bgColor, primaryColor, outlineColor } = config;
  const isEmojiMode = styleMode === 'Emoji' || !config.shapeGroup;
  
  // Decide Stage rendering
  // Seed: small emoji/icon
  // Sprout: sprout
  // Small Plant: small leafy plant
  // Fruiting: full icon
  let scaleValue = 1.0;
  let opacityValue = 1;
  const yOffset = 0;
  
  if (stage === 'Seed') {
    scaleValue = 0.75;
  } else if (stage === 'Sprout') {
    scaleValue = 0.85;
  } else if (stage === 'Small Plant' || stage === 'Young Plant') {
    scaleValue = 0.95;
  }

  if (status === 'Dead') {
     opacityValue = 0.3;
  } else if (status === 'Critical') {
     opacityValue = 0.8;
  }

  const renderBaseIcon = () => {
    if (stage === 'Seed') {
      return (
        <div className="w-full h-full flex items-center justify-center drop-shadow-md">
           <svg viewBox="0 0 64 64" fill="none" className="w-full h-full overflow-visible">
              {/* Soil mound */}
              <ellipse cx="32" cy="48" rx="14" ry="5" fill="#5C4033" opacity="0.8" />
              {/* Cute little brown seed tilted */}
              <g transform="translate(32, 42) rotate(-15) translate(-32, -42)">
                 {/* Seed body */}
                 <path d="M32 30 C38 30 42 36 42 42 C42 48 36 50 32 50 C28 50 22 48 22 42 C22 36 26 30 32 30 Z" fill="#8B5A2B" stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
                 {/* Seed highlight */}
                 <path d="M26 40 C26 36 29 34 32 34" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="2" strokeLinecap="round" />
                 {/* Tiny cute sprout starting to peek out */}
                 <path d="M32 30 Q35 20 40 22 Q35 28 32 30" fill="#a3de9a" stroke={outlineColor} strokeWidth="2" strokeLinejoin="round" />
              </g>
           </svg>
        </div>
      );
    }
    if (stage === 'Sprout') {
      return (
        <div className="w-full h-full flex items-center justify-center drop-shadow-sm">
           <svg viewBox="0 0 64 64" fill="none" className="w-full h-full overflow-visible">
              <path d="M32 48 Q32 30 20 20 Q32 30 32 48" fill="none" stroke={outlineColor} strokeWidth="4" strokeLinecap="round" />
              <path d="M32 48 Q32 20 44 24 Q32 30 32 48" fill="none" stroke={outlineColor} strokeWidth="4" strokeLinecap="round" />
              <circle cx="20" cy="20" r="5" fill={primaryColor} />
           </svg>
        </div>
      );
    }

    if (isEmojiMode) {
      return <div className="text-[3em] leading-none flex items-center justify-center h-full w-full">{emoji}</div>;
    }
    return (
      <React.Suspense fallback={<div className="w-6 h-6 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />}>
        <PlantSvgShape config={config} isGolden={isGolden} className="w-full h-full overflow-visible" />
      </React.Suspense>
    );
  };

  const getGrayscaleFilter = () => {
    if (status === 'Dead') return 'grayscale(1)';
    if (status === 'Critical') return 'sepia(1)';
    if (isLocked) return 'grayscale(0.5) blur(2px) brightness(0.5)';
    return 'none';
  };

  // Convert the plant's primary color to an rgba string for the subtle glow
  // Or just use the original primary color string
  const glowColor = primaryColor || '#8af';

  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${className} overflow-visible`}
      style={{ ...(size ? { width: size } : {}), aspectRatio: '3/4', height: 'auto' }}
      title={`${plantType} - ${stage} (${status})`}
    >
      {/* Icon Layer (Strictly bounded inside the container) */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center transform-gpu will-change-transform"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: health !== undefined && health > 20 && !isLocked && status !== 'Dead' && status !== 'Critical'
            ? [scaleValue, scaleValue * (1 + (health / 100) * 0.06), scaleValue]
            : scaleValue, 
          opacity: opacityValue, 
          y: yOffset
        }}
        whileHover={!isLocked && status !== 'Dead' ? { scale: scaleValue * 1.08 } : {}}
        whileTap={!isLocked ? { scale: scaleValue * 0.95 } : {}}
        transition={{ 
          scale: health !== undefined && health > 20 && !isLocked && status !== 'Dead' && status !== 'Critical'
            ? { repeat: Infinity, duration: 4 - (health / 100) * 2, ease: "easeInOut" }
            : { type: "spring", stiffness: 300, damping: 15 },
          opacity: { type: "spring", stiffness: 300, damping: 15 },
          y: { type: "spring", stiffness: 300, damping: 15 },
          rotate: { type: "tween", duration: 0.3 }
        }}
      >
         <div 
            className={`w-full h-full flex items-center justify-center ${health !== undefined && health > 90 && !isLocked && status !== 'Dead' && status !== 'Critical' ? 'animate-sway' : ''}`}
            style={{ filter: getGrayscaleFilter(), willChange: 'transform', transformOrigin: 'bottom center' }}
         >
            <AnimatePresence mode="wait">
               <motion.div
                 key={stage}
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 1.2 }}
                 transition={{ duration: 0.3 }}
                 className="w-full h-full flex items-center justify-center"
               >
                 {renderBaseIcon()}
               </motion.div>
            </AnimatePresence>
         </div>
      </motion.div>

      {/* Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center">
           <Lock className="w-1/3 h-1/3 text-white/80" />
        </div>
      )}

      {/* Badges */}
      {status === 'Protected' && (
        <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border border-surface-card shadow-sm">
           <div className="w-2.5 h-2.5 bg-white rounded-full opacity-30" />
        </div>
      )}
      {status === 'Resting' && (
        <div className="absolute -bottom-1 -right-1 bg-blue-400 rounded-full p-0.5 border border-surface-card shadow-sm">
           <div className="w-2.5 h-2.5 bg-white rounded-full opacity-30" />
        </div>
      )}
      {status === 'Wilting' && (
        <div className="absolute -bottom-1 -left-1 bg-orange-400 rounded-full p-0.5 border border-surface-card shadow-sm">
           <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none"><path d="M2 5L5 2L8 5L5 8L2 5Z" fill="#FFF"/></svg>
        </div>
      )}
      {status === 'Critical' && (
        <div className="absolute -bottom-1 -left-1 bg-red-500 rounded-full p-0.5 border border-surface-card shadow-sm">
           <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none"><circle cx="5" cy="5" r="3" fill="#FFF"/></svg>
        </div>
      )}
      {status === 'Completed' && (
        <div className="absolute -top-1 -right-1 bg-primary-mint rounded-full p-0.5 border border-surface-card shadow-sm">
           <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none"><path d="M2 5L4 7L8 3" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      )}
      {isArchived && !isLegendary && (
        <div className="absolute -top-1 -left-1 bg-amber-500/80 rounded-full p-0.5 border border-surface-card shadow-sm">
           <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none"><circle cx="5" cy="5" r="3" fill="#FFF"/></svg>
        </div>
      )}
      {isLegendary && !isGolden && (
        <div className="absolute -top-1 -left-1 bg-amber-400 rounded-full p-0.5 border border-surface-card shadow-sm animate-pulse">
           <svg viewBox="0 0 10 10" className="w-3 h-3" fill="none"><path d="M5 1L6 4L9 5L6 6L5 9L4 6L1 5L4 4L5 1Z" fill="#FFF"/></svg>
        </div>
      )}
      {isGolden && (
        <div className="absolute -top-2 -right-2 text-xl drop-shadow-md animate-bounce" style={{ animationDuration: '2s' }}>
           ✨
        </div>
      )}
    </div>
  );
});
