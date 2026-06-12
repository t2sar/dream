import React from 'react';
import { PlantType, PlantHealthStatus, PlantStage } from '../types';
import { PLANT_ICONS_CONFIG, PlantIconConfig } from './plantIconRegistry';
import { PlantSvgShape } from './PlantAssets';
import { Lock } from 'lucide-react';

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
}

export const PlantIcon: React.FC<PlantIconProps> = ({ 
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
  // Seed: small seed 
  // Sprout: sprout
  // Small Plant: small leafy plant
  // Fruiting: full icon
  let stageClass = "scale-100";
  let opacity = "opacity-100";
  
  if (stage === 'Seed') {
    stageClass = "scale-50 translate-y-4";
  } else if (stage === 'Sprout') {
    stageClass = "scale-75 translate-y-2";
  } else if (stage === 'Small Plant' || stage === 'Young Plant') {
    stageClass = "scale-90 translate-y-1";
  }

  if (status === 'Dead') {
     opacity = "opacity-30 grayscale";
  } else if (status === 'Critical') {
     opacity = "opacity-80 sepia";
  }

  const renderBaseIcon = () => {
    if (stage === 'Seed') {
      return (
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
           <ellipse cx="32" cy="48" rx="8" ry="6" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
        </svg>
      );
    }
    if (stage === 'Sprout') {
      return (
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
           <path d="M32 48 Q32 30 20 20 Q32 30 32 48" fill="none" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
           <path d="M32 48 Q32 20 44 24 Q32 30 32 48" fill="none" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
           <circle cx="20" cy="20" r="4" fill={primaryColor} />
        </svg>
      );
    }

    if (isEmojiMode) {
      return <div className="text-3xl leading-none flex items-center justify-center h-full w-full">{emoji}</div>;
    }
    return <PlantSvgShape config={config} className="w-full h-full" />;
  };

  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={size ? { width: size, height: size } : {}}
      title={`${plantType} - ${stage} (${status})`}
    >
      {/* Background container */}
      <div 
        className={`absolute inset-0 rounded-full transition-all duration-300 ${isLocked ? 'grayscale opacity-50' : ''}`}
        style={{ backgroundColor: bgColor }}
      />
      
      {/* Icon Layer */}
      <div className={`relative w-full h-full transition-all duration-500 ease-spring ${stageClass} ${opacity} ${isLocked ? 'blur-sm brightness-50' : ''}`}>
         {renderBaseIcon()}
      </div>

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
      {isLegendary && (
        <div className="absolute -top-1 -left-1 bg-amber-400 rounded-full p-0.5 border border-surface-card shadow-sm animate-pulse">
           <svg viewBox="0 0 10 10" className="w-3 h-3" fill="none"><path d="M5 1L6 4L9 5L6 6L5 9L4 6L1 5L4 4L5 1Z" fill="#FFF"/></svg>
        </div>
      )}
    </div>
  );
};
