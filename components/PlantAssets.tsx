import React from 'react';
import { PlantIconConfig } from './plantIconRegistry';

interface SvgProps extends React.SVGProps<SVGSVGElement> {
  config: PlantIconConfig;
}

export const PlantSvgShape: React.FC<SvgProps> = ({ config, ...props }) => {
  const { primaryColor, secondaryColor, outlineColor, shapeGroup } = config;
  
  // Larger Cute leaf
  const CuteLeaf = () => (
    <path 
      d="M32 10C32 10 44 -2 54 8C64 18 52 32 52 32L32 10Z" 
      fill={secondaryColor || "#8FD5A6"} 
      stroke={outlineColor} 
      strokeWidth="3" 
      strokeLinejoin="round" 
    />
  );

  // Adjusted Tiny Face
  const TinyFace = () => (
    <g transform="translate(0, 7)">
      <circle cx="24" cy="35" r="3" fill={outlineColor} />
      <circle cx="40" cy="35" r="3" fill={outlineColor} />
      <path d="M29 40 Q32 44 35 40" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );

  const renderShape = () => {
    switch (shapeGroup) {
      case 'mango':
        return (
          <>
            <CuteLeaf />
            <path d="M22 52 C 6 40, 16 16, 36 12 C 52 10, 58 26, 50 42 C 44 54, 32 60, 22 52 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
            <path d="M 44 26 C 50 34, 46 44, 38 48" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.15" />
            <TinyFace />
          </>
        );
      case 'oval':
        return (
          <>
            <CuteLeaf />
            <ellipse cx="32" cy="36" rx="20" ry="26" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            <path d="M 42 24 A 12 16 0 0 1 42 48" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.15" />
            <TinyFace />
          </>
        );
      case 'round':
        return (
          <>
            <CuteLeaf />
            <circle cx="32" cy="36" r="24" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            <path d="M 46 24 A 14 14 0 0 1 46 48" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.15" />
            <TinyFace />
          </>
        );
      case 'fig':
        return (
          <>
            <CuteLeaf />
            <path d="M24 16 L40 16 Q 44 34 52 46 Q 52 60 32 60 Q 12 60 12 46 Q 20 34 24 16 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
            <path d="M 46 36 Q 48 46 40 52" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.15" />
            <TinyFace />
          </>
        );
      case 'flower':
        return (
          <>
            <CuteLeaf />
            <path d="M32 10 Q 52 10 52 28 Q 52 46 32 58 Q 12 46 12 28 Q 12 10 32 10 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
            <TinyFace />
          </>
        );
      case 'citrus':
        return (
          <>
            <CuteLeaf />
            <circle cx="32" cy="36" r="24" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            <circle cx="24" cy="28" r="2.5" fill={outlineColor} opacity="0.25" />
            <circle cx="42" cy="32" r="2.5" fill={outlineColor} opacity="0.25" />
            <circle cx="30" cy="46" r="2.5" fill={outlineColor} opacity="0.25" />
            <circle cx="42" cy="44" r="2.5" fill={outlineColor} opacity="0.25" />
            <circle cx="18" cy="38" r="2" fill={outlineColor} opacity="0.2" />
            <TinyFace />
          </>
        );
      case 'banana':
        return (
          <>
            <path d="M 12 52 C 12 52, 2 18, 34 6 C 62 -4, 60 48, 60 48 C 60 48, 44 58, 34 46 C 20 32, 12 52, 12 52 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
            <path d="M 34 6 C 42 20, 40 40, 60 48" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.2" />
            <TinyFace />
          </>
        );
      case 'spiky':
        return (
          <>
            <CuteLeaf />
            <ellipse cx="32" cy="36" rx="22" ry="26" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeDasharray="8 6" />
            <ellipse cx="32" cy="36" rx="22" ry="26" fill={primaryColor} stroke="none" />
            <path d="M 16 36 L 48 36 M 24 20 L 40 52 M 40 20 L 24 52" stroke={outlineColor} strokeWidth="2.5" opacity="0.25" strokeLinecap="round" />
            <ellipse cx="32" cy="36" rx="22" ry="26" fill="none" stroke={outlineColor} strokeWidth="3" />
            <TinyFace />
          </>
        );
      case 'berry':
        return (
          <>
            <path d="M18 12 L32 20 L46 12 Z" fill={secondaryColor || "#8FD5A6"} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round"/>
            <path d="M18 20 C 0 38, 18 60, 32 60 C 46 60, 64 38, 46 20 C 38 10, 26 10, 18 20 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round"/>
            <circle cx="26" cy="30" r="1.5" fill={outlineColor} opacity="0.4" />
            <circle cx="38" cy="28" r="1.5" fill={outlineColor} opacity="0.4" />
            <circle cx="32" cy="40" r="1.5" fill={outlineColor} opacity="0.4" />
            <circle cx="24" cy="44" r="1.5" fill={outlineColor} opacity="0.4" />
            <circle cx="40" cy="44" r="1.5" fill={outlineColor} opacity="0.4" />
            <circle cx="48" cy="32" r="1.5" fill={outlineColor} opacity="0.4" />
            <circle cx="16" cy="34" r="1.5" fill={outlineColor} opacity="0.4" />
            <TinyFace />
          </>
        );
      case 'melon':
        return (
          <>
            <CuteLeaf />
            <ellipse cx="32" cy="38" rx="26" ry="22" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            <path d="M 14 30 C 24 40, 40 40, 50 30 M 12 38 C 24 48, 40 48, 52 38 M 16 46 C 26 54, 38 54, 48 46" fill="none" stroke={secondaryColor || "#D44242"} strokeWidth="5" strokeLinecap="round" opacity="0.6" />
            <TinyFace />
          </>
        );
      case 'cluster':
        return (
          <>
            <CuteLeaf />
            <circle cx="24" cy="24" r="9" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
            <circle cx="40" cy="24" r="9" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
            <circle cx="16" cy="36" r="9" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
            <circle cx="48" cy="36" r="9" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
            <circle cx="32" cy="36" r="9" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
            <circle cx="24" cy="48" r="9" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
            <circle cx="40" cy="48" r="9" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
            <circle cx="32" cy="48" r="9" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
          </>
        );
      case 'palm':
        return (
          <>
            <path d="M20 28 Q32 0 44 28 M12 18 Q32 -6 52 18 M28 36 Q32 10 36 36 M8 30 Q32 20 56 30" fill="none" stroke={secondaryColor || "#8FD5A6"} strokeWidth="4" strokeLinecap="round" />
            <circle cx="32" cy="40" r="20" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            <circle cx="26" cy="30" r="3" fill={outlineColor} opacity="0.2" />
            <circle cx="38" cy="30" r="3" fill={outlineColor} opacity="0.2" />
            <TinyFace />
          </>
        );
      case 'star':
        return (
          <>
            <path d="M32 6 L40 24 L58 26 L44 38 L48 56 L32 46 L16 56 L20 38 L6 26 L24 24 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
            <path d="M32 6 L 32 46 M 16 56 L 32 46 M 48 56 L 32 46 M 6 26 L 24 24 M 58 26 L 40 24" fill="none" stroke={outlineColor} strokeWidth="2" strokeLinecap="round" opacity="0.25" />
            <TinyFace />
          </>
        );
      case 'long_fruit':
        return (
          <>
            <CuteLeaf />
            <rect x="22" y="14" width="20" height="42" rx="10" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            <path d="M28 16 L28 54 M36 16 L36 54" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.2" />
            <TinyFace />
          </>
        );
      case 'bean':
        return (
          <>
            <CuteLeaf />
            <path d="M18 16 C 14 24, 18 32, 14 44 C 14 56, 30 56, 32 44 C 36 32, 32 24, 30 16 C 26 8, 22 8, 18 16 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
            <path d="M18 30 Q 24 30 24 38 M 28 42 Q 22 46 28 50" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.2" />
            <TinyFace />
          </>
        );
      default:
        return (
          <>
            <CuteLeaf />
            <circle cx="32" cy="36" r="24" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            <TinyFace />
          </>
        );
    }
  };

  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {renderShape()}
    </svg>
  );
};
