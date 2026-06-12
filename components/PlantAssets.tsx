import React from 'react';
import { PlantIconConfig } from './plantIconRegistry';

interface SvgProps extends React.SVGProps<SVGSVGElement> {
  config: PlantIconConfig;
}

export const PlantSvgShape: React.FC<SvgProps> = ({ config, ...props }) => {
  const { primaryColor, secondaryColor, outlineColor, shapeGroup } = config;
  
  // Default cute leaf
  const CuteLeaf = () => (
    <path 
      d="M32 12C32 12 40 4 48 12C56 20 48 32 48 32L32 12Z" 
      fill={secondaryColor || "#8FD5A6"} 
      stroke={outlineColor} 
      strokeWidth="3" 
      strokeLinejoin="round" 
    />
  );

  // Tiny Face
  const TinyFace = () => (
    <g transform="translate(0, 4)">
      <circle cx="26" cy="34" r="2" fill={outlineColor} />
      <circle cx="38" cy="34" r="2" fill={outlineColor} />
      <path d="M30 38 Q32 40 34 38" fill="none" stroke={outlineColor} strokeWidth="2" strokeLinecap="round" />
    </g>
  );

  const renderShape = () => {
    switch (shapeGroup) {
      case 'mango':
      case 'oval':
        return (
          <>
            <CuteLeaf />
            <ellipse cx="32" cy="34" rx="18" ry="22" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            <TinyFace />
          </>
        );
      case 'round':
      case 'citrus':
      case 'fig':
      case 'flower':
        return (
          <>
            <CuteLeaf />
            <circle cx="32" cy="34" r="20" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            <TinyFace />
          </>
        );
      case 'banana':
        return (
          <>
            <path d="M16 48 C16 48 10 20 32 14 C54 8 50 48 50 48 C50 48 40 54 32 46 C24 38 16 48 16 48Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
            <TinyFace />
          </>
        );
      case 'spiky':
        return (
          <>
            <CuteLeaf />
            <ellipse cx="32" cy="34" rx="18" ry="22" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeDasharray="6 4" />
            <ellipse cx="32" cy="34" rx="18" ry="22" fill={primaryColor} stroke="none" />
            <circle cx="22" cy="24" r="3" fill={outlineColor} opacity="0.3" />
            <circle cx="42" cy="24" r="3" fill={outlineColor} opacity="0.3" />
            <circle cx="32" cy="44" r="3" fill={outlineColor} opacity="0.3" />
            <ellipse cx="32" cy="34" rx="18" ry="22" fill="none" stroke={outlineColor} strokeWidth="3" />
            <TinyFace />
          </>
        );
      case 'berry':
        return (
          <>
            <path d="M22 16 L32 20 L42 16Z" fill={secondaryColor || "#8FD5A6"} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round"/>
            <path d="M22 20 C10 32 24 50 32 50 C40 50 54 32 42 20 C36 12 28 12 22 20Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round"/>
            <TinyFace />
          </>
        );
      case 'melon':
        return (
          <>
            <CuteLeaf />
            <ellipse cx="32" cy="36" rx="22" ry="18" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            <path d="M16 36 C24 44 40 44 48 36" fill="none" stroke={secondaryColor || "#D44242"} strokeWidth="4" strokeLinecap="round" opacity="0.5" />
            <TinyFace />
          </>
        );
      case 'cluster':
        return (
          <>
            <CuteLeaf />
            <circle cx="26" cy="26" r="8" fill={primaryColor} stroke={outlineColor} strokeWidth="2" />
            <circle cx="38" cy="26" r="8" fill={primaryColor} stroke={outlineColor} strokeWidth="2" />
            <circle cx="20" cy="36" r="8" fill={primaryColor} stroke={outlineColor} strokeWidth="2" />
            <circle cx="44" cy="36" r="8" fill={primaryColor} stroke={outlineColor} strokeWidth="2" />
            <circle cx="32" cy="36" r="8" fill={primaryColor} stroke={outlineColor} strokeWidth="2" />
            <circle cx="26" cy="46" r="8" fill={primaryColor} stroke={outlineColor} strokeWidth="2" />
            <circle cx="38" cy="46" r="8" fill={primaryColor} stroke={outlineColor} strokeWidth="2" />
            <circle cx="32" cy="46" r="8" fill={primaryColor} stroke={outlineColor} strokeWidth="2" />
          </>
        );
      case 'palm':
        return (
          <>
            <path d="M20 32 Q32 10 44 32" fill="none" stroke={secondaryColor || "#8FD5A6"} strokeWidth="4" strokeLinecap="round" />
            <path d="M16 24 Q32 2 48 24" fill="none" stroke={secondaryColor || "#8FD5A6"} strokeWidth="4" strokeLinecap="round" />
            <circle cx="32" cy="36" r="14" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            <TinyFace />
          </>
        );
      case 'star':
        return (
          <>
            <path d="M32 12 L38 24 L52 26 L42 36 L44 50 L32 44 L20 50 L22 36 L12 26 L26 24 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
            <TinyFace />
          </>
        );
      case 'long_fruit':
      case 'bean':
        return (
          <>
            <CuteLeaf />
            <rect x="22" y="16" width="20" height="36" rx="10" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            <TinyFace />
          </>
        );
      default:
        return (
          <>
            <CuteLeaf />
            <circle cx="32" cy="34" r="20" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
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
