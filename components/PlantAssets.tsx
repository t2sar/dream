import React from 'react';
import { PlantIconConfig } from './plantIconRegistry';
import { PlantSvgDictionary } from './PlantSvgDictionary';

interface SvgProps extends React.SVGProps<SVGSVGElement> {
  config: PlantIconConfig;
  isGolden?: boolean;
}

// Larger Cute leaf
const CuteLeaf = React.memo(({ secondaryColor, outlineColor }: { secondaryColor?: string, outlineColor: string }) => (
  <path 
    d="M32 10C32 10 44 -2 54 8C64 18 52 32 52 32L32 10Z" 
    fill={secondaryColor || "#8FD5A6"} 
    stroke={outlineColor} 
    strokeWidth="3" 
    strokeLinejoin="round" 
  />
));

// Adjusted Tiny Face
const TinyFace = React.memo(({ outlineColor }: { outlineColor: string }) => (
  <g transform="translate(0, 7)">
    <circle cx="24" cy="35" r="3" fill={outlineColor} />
    <circle cx="40" cy="35" r="3" fill={outlineColor} />
    <path d="M29 40 Q32 44 35 40" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
  </g>
));

export const PlantSvgShape = React.memo<SvgProps>(({ config, isGolden, ...props }) => {
  const { primaryColor, secondaryColor, outlineColor, shapeGroup, plantTypeId } = config;
  
  // 1. Check our new SVG Dictionary first (Batch 2 Flat Vector Game Art architecture)
  const DictionaryShape = PlantSvgDictionary[plantTypeId];
  if (DictionaryShape) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        {isGolden && (
          <svg width="0" height="0">
             <defs>
              <filter id="goldenTextureDict">
                <feColorMatrix type="matrix" values="1.2 0.5 0 0 0  0 1.0 0 0 0  0 0 0.2 0 0  0 0 0 1 0" result="sepiaSat"/>
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ffd700" floodOpacity="0.8" />
              </filter>
            </defs>
          </svg>
        )}
        <div className="w-full h-full flex items-center justify-center" style={isGolden ? { filter: 'url(#goldenTextureDict)' } : undefined}>
           <DictionaryShape primaryColor={primaryColor} secondaryColor={secondaryColor} outlineColor={outlineColor} />
        </div>
      </div>
    );
  }

  const renderShape = () => {
    // Exact specific distinct shapes for explicitly requested fruits
    switch (config.plantTypeId) {
      case 'Black Plum / Jam':
        return (
          <>
            {/* Small top leaf */}
            <path d="M 32 10 Q 42 0 50 10 Q 40 18 32 10 Z" fill={secondaryColor || "#A3DE9A"} stroke={outlineColor} strokeWidth="2.5" strokeLinejoin="round" />
            {/* Elongated deep purple oval */}
            <ellipse cx="32" cy="38" rx="20" ry="24" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            {/* Subtle crescent highlight */}
            <path d="M 44 26 A 14 18 0 0 1 44 50" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" strokeLinecap="round" />
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Jujube / Boroi':
        return (
          <>
            {/* Stem and small leaf */}
            <path d="M 32 8 L 32 16 M 32 12 Q 40 6 46 12 Q 40 16 32 12" fill={secondaryColor || "#A3DE9A"} stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Slightly dented egg shape */}
            <path d="M 28 16 C 40 14, 46 16, 52 28 C 58 40, 52 56, 32 58 C 12 56, 6 40, 12 28 C 18 16, 24 14, 28 16 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
            {/* Texture spots */}
            <circle cx="20" cy="30" r="1.5" fill={outlineColor} opacity="0.3" />
            <circle cx="44" cy="40" r="1.5" fill={outlineColor} opacity="0.3" />
            <circle cx="24" cy="48" r="1.5" fill={outlineColor} opacity="0.3" />
            <circle cx="36" cy="26" r="1.5" fill={outlineColor} opacity="0.3" />
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Hog Plum / Amra':
        return (
          <>
            {/* Star-shaped stalk remnant */}
            <path d="M 32 16 L 34 10 L 30 10 Z M 32 16 L 38 14 L 36 18 Z M 32 16 L 26 14 L 28 18 Z" fill="#6A4A3C" stroke={outlineColor} strokeWidth="2" strokeLinejoin="round" />
            {/* Chunky oval blocky shape */}
            <path d="M 22 16 C 42 16, 48 16, 52 28 C 56 40, 52 56, 42 58 C 22 58, 16 56, 12 44 C 8 32, 12 16, 22 16 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
            {/* Vertical lines / texture */}
            <path d="M 22 20 C 16 30, 20 50, 22 54 M 42 20 C 48 30, 44 50, 42 54" fill="none" stroke={outlineColor} strokeWidth="2.5" opacity="0.15" strokeLinecap="round" />
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Wood Apple / Bel':
        return (
          <>
            {/* Stem */}
            <path d="M 32 4 L 32 10" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
            {/* Perfect round heavy shape */}
            <circle cx="32" cy="36" r="26" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            {/* Woody speckled texture */}
            <g stroke={outlineColor} strokeWidth="2" strokeLinecap="round" opacity="0.3">
               <path d="M 18 26 L 20 28 M 46 26 L 48 24 M 24 46 L 22 48 M 40 44 L 42 46 M 32 20 L 34 22 M 16 36 L 14 38 M 50 36 L 52 38" />
               <path d="M 26 22 L 30 20 M 42 32 L 46 30 M 20 40 L 24 38" strokeWidth="1.5" />
               <circle cx="26" cy="34" r="1.5" />
               <circle cx="38" cy="24" r="1.5" />
               <circle cx="36" cy="48" r="1.5" />
               <circle cx="46" cy="40" r="1.5" />
               <circle cx="16" cy="30" r="1.5" />
            </g>
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Star Fruit / Kamranga':
        return (
          <>
            <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
            {/* Elongated angled main body */}
            <path d="M 32 10 L 46 22 L 50 48 L 32 60 L 14 48 L 18 22 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
            {/* Inner ridges */}
            <path d="M 32 10 L 32 60 M 18 22 L 32 60 M 46 22 L 32 60" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinejoin="round" opacity="0.4" />
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Indian Gooseberry / Amloki':
        return (
          <>
            <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
            {/* Round body */}
            <circle cx="32" cy="36" r="24" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            {/* Curved longitudinal segments/ribs */}
            <path d="M 32 12 L 32 60 M 18 16 C 24 30, 24 42, 18 56 M 46 16 C 40 30, 40 42, 46 56" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
            {/* Small bottom dot */}
            <circle cx="32" cy="58" r="1.5" fill={outlineColor} opacity="0.6" />
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Lemon / Lebu':
        return (
          <>
            <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
            {/* Pointy oval */}
            <path d="M 32 10 C 50 10, 58 22, 54 36 C 50 50, 40 60, 32 60 C 24 60, 14 50, 10 36 C 6 22, 14 10, 32 10 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
            {/* Nipples */}
            <path d="M 28 10 C 32 6, 32 6, 36 10 M 28 60 C 32 64, 32 64, 36 60" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
            {/* Porous stippled skin */}
            <path d="M 20 26 L 20.1 26 M 24 40 L 24.1 40 M 44 30 L 44.1 30 M 40 46 L 40.1 46 M 28 20 L 28.1 20 M 36 50 L 36.1 50 M 16 36 L 16.1 36 M 48 40 L 48.1 40" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" opacity="0.25" />
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Orange / Komola':
        return (
          <>
            <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
            <circle cx="32" cy="36" r="26" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            {/* Top Dimple */}
            <path d="M 28 14 C 32 20, 32 20, 36 14" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
            {/* Lightweight Porous Texture */}
            <path d="M 16 30 L 16.5 30 M 20 40 L 20.5 40 M 28 24 L 28.5 24 M 40 22 L 40.5 22 M 48 34 L 48.5 34 M 44 46 L 44.5 46 M 34 52 L 34.5 52 M 24 50 L 24.5 50 M 18 46 L 18.5 46 M 36 28 L 36.5 28 M 24 34 L 24.5 34 M 40 38 L 40.5 38 M 50 26 L 50.5 26" stroke={outlineColor} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
             <path d="M 46 24 C 52 30, 52 42, 46 48" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Pomegranate / Dalim':
        return (
          <>
            {/* Big Jagged Crown */}
            <path d="M 22 16 L 20 4 L 26 10 L 32 2 L 38 10 L 44 4 L 42 16 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
            <circle cx="32" cy="38" r="24" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            {/* Gradient / Highlight Curve */}
            <path d="M 16 38 A 16 16 0 0 0 48 38" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.25" />
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Custard Apple / Ata':
        return (
          <>
            <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
            <circle cx="32" cy="38" r="24" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            {/* Overlapping scales (scallops) */}
            <g fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.35">
               <path d="M 18 24 A 6 6 0 0 0 26 24 M 26 24 A 6 6 0 0 0 34 24 M 34 24 A 6 6 0 0 0 42 24 M 42 24 A 6 6 0 0 0 46 28" />
               <path d="M 16 32 A 6 6 0 0 0 24 32 M 24 32 A 6 6 0 0 0 32 32 M 32 32 A 6 6 0 0 0 40 32 M 40 32 A 6 6 0 0 0 48 32 M 48 32 A 6 6 0 0 0 52 36" />
               <path d="M 14 40 A 6 6 0 0 0 22 40 M 22 40 A 6 6 0 0 0 30 40 M 30 40 A 6 6 0 0 0 38 40 M 38 40 A 6 6 0 0 0 46 40 M 46 40 A 6 6 0 0 0 54 40" />
               <path d="M 18 48 A 6 6 0 0 0 26 48 M 26 48 A 6 6 0 0 0 34 48 M 34 48 A 6 6 0 0 0 42 48 M 42 48 A 6 6 0 0 0 50 44" />
               <path d="M 24 56 A 6 6 0 0 0 32 56 M 32 56 A 6 6 0 0 0 40 56" />
            </g>
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Watermelon / Tormuj':
        return (
          <>
            <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
            <ellipse cx="32" cy="38" rx="24" ry="24" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            {/* Zigzag longitudinal stripes */}
            <path d="M 16 18 Q 14 26 18 34 T 16 50 M 26 14 Q 24 24 28 34 T 26 56 M 38 14 Q 36 24 40 34 T 38 56 M 48 18 Q 46 26 50 34 T 48 50" fill="none" stroke="#1E3A1E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Melon / Bangi':
        return (
          <>
            <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
            <ellipse cx="32" cy="36" rx="24" ry="26" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            {/* Netting / Segment lines */}
            <g stroke={outlineColor} strokeWidth="2" strokeLinecap="round" opacity="0.35">
              <path d="M 12 36 L 52 36 M 16 26 L 48 26 M 16 46 L 48 46" />
              <path d="M 32 10 L 32 62 M 22 12 L 22 60 M 42 12 L 42 60" />
              <path d="M 22 12 L 42 26 M 42 12 L 22 26 M 22 26 L 42 46 M 42 26 L 22 46 M 22 46 L 42 60 M 42 46 L 22 60" strokeWidth="1" />
            </g>
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Date Palm / Khejur':
        return (
          <>
            {/* Clustered stems */}
            <path d="M 32 4 L 32 20 M 32 10 L 16 28 M 32 12 L 48 26 M 32 16 L 24 36 M 32 18 L 40 34 M 32 20 L 32 44" fill="none" stroke={secondaryColor || "#D9A05B"} strokeWidth="3" strokeLinecap="round" />
            {/* Clustered brown oval fruits */}
            <ellipse cx="16" cy="32" rx="6" ry="10" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
            <ellipse cx="48" cy="30" rx="6" ry="10" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
            <ellipse cx="24" cy="42" rx="7" ry="11" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
            <ellipse cx="40" cy="40" rx="7" ry="11" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
            <ellipse cx="32" cy="50" rx="8" ry="12" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
            
            {/* Tiny faces on front 3 dates */}
            <g transform="translate(-8, 9) scale(0.6)"><TinyFace outlineColor={outlineColor} /></g>
            <g transform="translate(8, 7) scale(0.6)"><TinyFace outlineColor={outlineColor} /></g>
            <g transform="translate(0, 15) scale(0.7)"><TinyFace outlineColor={outlineColor} /></g>
          </>
        );
      case 'Indian Olive / Jolpai':
        return (
          <>
            <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
            <ellipse cx="32" cy="38" rx="18" ry="24" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            <path d="M 40 24 A 16 20 0 0 1 40 52" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round" />
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Burmese Grape / Lotkon':
        return (
          <>
            <path d="M 32 4 L 32 16 M 32 8 L 20 20 M 32 12 L 44 22 M 32 16 L 24 30 M 32 16 L 40 30" fill="none" stroke="#7A6A23" strokeWidth="3" strokeLinecap="round" />
            <circle cx="20" cy="24" r="10" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
            <circle cx="44" cy="26" r="10" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
            <circle cx="24" cy="40" r="12" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
            <circle cx="40" cy="40" r="12" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
            <circle cx="32" cy="50" r="14" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
            <g transform="translate(0, 14)"><TinyFace outlineColor={outlineColor} /></g>
          </>
        );
      case 'Elephant Apple / Chalta':
        return (
          <>
             <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
             <path d="M 32 12 C 54 12, 60 26, 56 46 C 52 64, 12 64, 8 46 C 4 26, 10 12, 32 12 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
             <path d="M 32 12 C 40 26, 36 46, 24 58 M 32 12 C 24 26, 28 46, 40 58 M 16 24 C 24 36, 22 50, 14 56 M 48 24 C 40 36, 42 50, 50 56" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
             <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Monkey Jack / Deua':
        return (
          <>
             <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
             <path d="M 32 14 C 48 10, 56 22, 54 36 C 58 48, 48 60, 32 58 C 16 60, 6 48, 10 36 C 8 22, 16 10, 32 14 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
             <path d="M 32 14 Q 30 26 22 30 M 32 14 Q 34 26 42 30 M 24 58 Q 28 46 16 40 M 40 58 Q 36 46 48 40" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.25" />
             <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Wax Apple / Jamrul':
        return (
          <>
             <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
             <path d="M 32 16 C 40 16, 44 26, 48 36 C 54 50, 56 60, 32 60 C 8 60, 10 50, 16 36 C 20 26, 24 16, 32 16 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
             <path d="M 22 60 C 22 54, 42 54, 42 60" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
             <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Rose Apple / Golap Jam':
        return (
          <>
             <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
             <circle cx="32" cy="38" r="22" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
             <circle cx="32" cy="20" r="4" fill={outlineColor} opacity="0.4" />
             <path d="M 28 16 L 30 20 M 36 16 L 34 20 M 26 24 L 30 22 M 38 24 L 34 22" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
             <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Sapodilla / Sofeda':
        return (
          <>
             <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
             <ellipse cx="32" cy="38" rx="22" ry="24" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
             <g stroke={outlineColor} strokeWidth="2" strokeLinecap="round" opacity="0.3">
                <path d="M 20 30 L 22 34 M 42 26 L 40 30 M 26 48 L 30 46 M 44 44 L 46 48 M 16 40 L 18 42 M 36 30 L 38 32" />
             </g>
             <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Pomelo / Batabi Lebu':
        return (
          <>
             <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
             <path d="M 32 12 C 44 12, 54 22, 58 40 C 60 54, 48 60, 32 60 C 16 60, 4 54, 6 40 C 10 22, 20 12, 32 12 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
             <path d="M 28 20 L 28.1 20 M 36 24 L 36.1 24 M 16 36 L 16.1 36 M 48 32 L 48.1 32 M 24 46 L 24.1 46 M 40 50 L 40.1 50 M 18 52 L 18.1 52 M 50 44 L 50.1 44" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" opacity="0.2" />
             <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Malta / Malta':
        return (
          <>
             <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
             <circle cx="32" cy="38" r="24" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
             <path d="M 26 58 C 26 54, 38 54, 38 58" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
             <path d="M 20 30 L 20.1 30 M 40 24 L 40.1 24 M 46 40 L 46.1 40 M 18 44 L 18.1 44" stroke={outlineColor} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
             <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Dragon Fruit / Dragon Fol':
        return (
          <>
             <ellipse cx="32" cy="36" rx="20" ry="26" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
             <path d="M 12 36 Q 4 30 14 24 Q 18 30 18 36" fill={secondaryColor || "#9CC240"} stroke={outlineColor} strokeWidth="2.5" strokeLinejoin="round" />
             <path d="M 52 36 Q 60 30 50 24 Q 46 30 46 36" fill={secondaryColor || "#9CC240"} stroke={outlineColor} strokeWidth="2.5" strokeLinejoin="round" />
             <path d="M 24 20 Q 20 10 32 6 Q 36 12 30 20" fill={secondaryColor || "#9CC240"} stroke={outlineColor} strokeWidth="2.5" strokeLinejoin="round" />
             <path d="M 40 20 Q 44 10 32 6 Q 28 12 34 20" fill={secondaryColor || "#9CC240"} stroke={outlineColor} strokeWidth="2.5" strokeLinejoin="round" />
             <path d="M 32 46 Q 24 56 32 62 Q 40 56 32 46" fill={secondaryColor || "#9CC240"} stroke={outlineColor} strokeWidth="2.5" strokeLinejoin="round" />
             <path d="M 16 50 Q 8 58 20 62 Q 22 56 16 50" fill={secondaryColor || "#9CC240"} stroke={outlineColor} strokeWidth="2.5" strokeLinejoin="round" />
             <path d="M 48 50 Q 56 58 44 62 Q 42 56 48 50" fill={secondaryColor || "#9CC240"} stroke={outlineColor} strokeWidth="2.5" strokeLinejoin="round" />
             <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Rambutan / Rambutan':
        return (
          <>
             <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
             <circle cx="32" cy="38" r="22" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
             <g stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.6">
                <path d="M 10 38 Q 4 34 6 28 M 54 38 Q 60 34 58 28 M 20 18 Q 16 12 22 8 M 44 18 Q 48 12 42 8 M 16 48 Q 10 54 16 60 M 48 48 Q 54 54 48 60 M 32 60 Q 28 66 32 68 M 32 16 Q 38 10 32 6" />
                <path d="M 22 30 Q 18 26 22 22 M 42 30 Q 46 26 42 22 M 24 50 Q 22 56 28 54 M 40 50 Q 42 56 36 54 M 32 26 Q 36 22 30 20" strokeWidth="2" opacity="0.4" />
             </g>
             <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Longan / Ashfol':
        return (
          <>
             <path d="M 32 4 L 32 12 M 32 10 L 22 18 M 32 8 L 44 16 M 32 14 L 32 24 M 22 16 L 14 26 M 44 14 L 52 26" fill="none" stroke="#7E5C2A" strokeWidth="2.5" strokeLinecap="round" />
             <circle cx="16" cy="30" r="8" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
             <circle cx="48" cy="30" r="8" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
             <circle cx="28" cy="24" r="9" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
             <circle cx="22" cy="42" r="10" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
             <circle cx="42" cy="42" r="10" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
             <circle cx="32" cy="52" r="10" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
             <g transform="translate(0, 16)"><TinyFace outlineColor={outlineColor} /></g>
          </>
        );
      case 'Grape / Angur':
        return (
          <>
             <path d="M 32 4 L 32 10" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
             <circle cx="22" cy="18" r="8" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
             <circle cx="42" cy="18" r="8" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
             <circle cx="32" cy="18" r="8.5" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
             <circle cx="18" cy="32" r="8" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
             <circle cx="46" cy="32" r="8" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
             <circle cx="32" cy="32" r="8.5" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
             <circle cx="24" cy="46" r="8" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
             <circle cx="40" cy="46" r="8" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
             <circle cx="32" cy="58" r="8.5" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
             <g transform="translate(0, 22)"><TinyFace outlineColor={outlineColor} /></g>
          </>
        );
      case 'Fig / Dumur':
        return (
          <>
             <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
             <path d="M 32 10 L 32 16" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
             <path d="M 24 16 L 40 16 C 50 30, 56 46, 48 56 C 40 64, 24 64, 16 56 C 8 46, 14 30, 24 16 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
             <path d="M 28 16 Q 22 40 24 58 M 36 16 Q 42 40 40 58" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
             <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Mulberry / Toot Fol':
        return (
          <>
             <path d="M 32 4 L 32 10" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
             <path d="M 24 14 C 40 14, 40 14, 40 14 C 50 20, 50 30, 46 40 C 44 54, 38 60, 32 60 C 26 60, 20 54, 18 40 C 14 30, 14 20, 24 14 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
             <g fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.4">
                <path d="M 20 20 A 4 4 0 0 1 28 20 M 28 20 A 4 4 0 0 1 36 20 M 36 20 A 4 4 0 0 1 44 20" />
                <path d="M 18 30 A 4 4 0 0 1 26 30 M 26 30 A 4 4 0 0 1 34 30 M 34 30 A 4 4 0 0 1 42 30" />
                <path d="M 18 40 A 4 4 0 0 1 26 40 M 26 40 A 4 4 0 0 1 34 40 M 34 40 A 4 4 0 0 1 42 40" />
                <path d="M 22 50 A 4 4 0 0 1 30 50 M 30 50 A 4 4 0 0 1 38 50" />
             </g>
             <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Bengal Currant / Karamcha':
        return (
          <>
             <path d="M 32 4 L 32 14 M 32 14 L 20 24 M 32 14 L 44 24" fill="none" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
             <ellipse cx="20" cy="38" rx="14" ry="18" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
             <ellipse cx="44" cy="38" rx="14" ry="18" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
             <g transform="translate(-12, 2)"><TinyFace outlineColor={outlineColor} /></g>
             <g transform="translate(12, 2)"><TinyFace outlineColor={outlineColor} /></g>
          </>
        );
      case 'Phalsa / Falsa':
        return (
          <>
             <path d="M 32 4 L 32 12 M 32 10 L 20 18 M 32 10 L 44 18" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" />
             <circle cx="20" cy="22" r="6" fill={primaryColor} stroke={outlineColor} strokeWidth="2" />
             <circle cx="44" cy="22" r="6" fill={primaryColor} stroke={outlineColor} strokeWidth="2" />
             <circle cx="32" cy="26" r="7" fill={primaryColor} stroke={outlineColor} strokeWidth="2" />
             <circle cx="16" cy="36" r="7" fill={primaryColor} stroke={outlineColor} strokeWidth="2" />
             <circle cx="48" cy="36" r="7" fill={primaryColor} stroke={outlineColor} strokeWidth="2" />
             <circle cx="26" cy="46" r="8" fill={primaryColor} stroke={outlineColor} strokeWidth="2" />
             <circle cx="38" cy="46" r="8" fill={primaryColor} stroke={outlineColor} strokeWidth="2" />
             <circle cx="32" cy="34" r="8" fill={primaryColor} stroke={outlineColor} strokeWidth="2" />
             <g transform="translate(0, 8) scale(0.8)"><TinyFace outlineColor={outlineColor} /></g>
          </>
        );
      case 'Passion Fruit / Passion Fol':
        return (
          <>
             <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
             <path d="M 32 14 C 42 12, 54 18, 56 32 C 58 42, 52 56, 32 58 C 12 56, 6 42, 8 32 C 10 18, 22 12, 32 14 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
             <path d="M 20 20 Q 24 24 22 30 M 44 24 Q 40 28 42 34 M 16 40 Q 24 40 20 48 M 48 44 Q 42 48 44 52 M 32 52 Q 36 56 32 58 M 32 16 Q 28 20 32 24" fill="none" stroke={outlineColor} strokeWidth="2" strokeLinecap="round" opacity="0.35" />
             <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Avocado / Avocado':
        return (
          <>
             <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
             <path d="M 32 12 C 44 12, 46 26, 52 38 C 58 52, 46 62, 32 62 C 18 62, 6 52, 12 38 C 18 26, 20 12, 32 12 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
             <path d="M 20 40 L 20.1 40 M 44 46 L 44.1 46 M 36 56 L 36.1 56 M 28 24 L 28.1 24 M 24 52 L 24.1 52 M 40 30 L 40.1 30" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" opacity="0.2" />
             <circle cx="32" cy="42" r="12" fill={secondaryColor || "#D4C76C"} stroke={outlineColor} strokeWidth="2.5" />
             <g transform="translate(0, 6)"><TinyFace outlineColor={outlineColor} /></g>
          </>
        );
      case 'Bilimbi / Bilimbi':
        return (
          <>
             <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
             <path d="M 32 10 L 44 14 L 46 54 L 32 60 L 18 54 L 20 14 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
             <path d="M 32 10 L 32 60 M 26 12 L 26 56 M 38 12 L 38 56" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
             <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Cashew Fruit / Kaju Fol':
        return (
          <>
             <path d="M 32 4 C 44 4, 48 16, 52 26 C 56 40, 52 48, 32 50 C 12 48, 8 40, 12 26 C 16 16, 20 4, 32 4 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
             <path d="M 28 48 C 20 48, 16 56, 20 62 C 24 68, 34 60, 36 62 C 40 64, 44 60, 44 56 C 44 50, 36 46, 28 48 Z" fill={secondaryColor || "#897151"} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
             <g transform="translate(0, -6)"><TinyFace outlineColor={outlineColor} /></g>
          </>
        );
      case 'Breadfruit / Ruti Fol':
        return (
          <>
             <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
             <circle cx="32" cy="36" r="26" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
             <g stroke={outlineColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.35">
                <path d="M 16 26 L 20 30 M 24 26 L 28 30 M 32 26 L 36 30 M 40 26 L 44 30 M 48 26 L 52 30" />
                <path d="M 12 36 L 16 40 M 20 36 L 24 40 M 28 36 L 32 40 M 36 36 L 40 40 M 44 36 L 48 40 M 52 36 L 56 40" />
                <path d="M 16 46 L 20 50 M 24 46 L 28 50 M 32 46 L 36 50 M 40 46 L 44 50 M 48 46 L 52 50" />
                <path d="M 20 26 L 16 30 M 28 26 L 24 30 M 36 26 L 32 30 M 44 26 L 40 30 M 52 26 L 48 30" />
                <path d="M 16 36 L 12 40 M 24 36 L 20 40 M 32 36 L 28 40 M 40 36 L 36 40 M 48 36 L 44 40 M 56 36 L 52 40" />
                <path d="M 20 46 L 16 50 M 28 46 L 24 50 M 36 46 L 32 50 M 44 46 L 40 50 M 52 46 L 48 50" />
             </g>
             <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Indian Persimmon / Gab':
        return (
          <>
             <path d="M 20 18 L 16 12 L 26 12 L 32 6 L 38 12 L 48 12 L 44 18 Z" fill="#5F1B13" stroke={outlineColor} strokeWidth="2" strokeLinejoin="round" />
             <circle cx="32" cy="38" r="22" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
             <g stroke={outlineColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.3">
                <path d="M 16 38 L 18 36 M 46 38 L 48 40 M 32 56 L 34 58 M 24 24 L 26 22 M 40 24 L 38 22 M 20 48 L 18 50 M 44 48 L 46 50" />
             </g>
             <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'Tamarind / Tetul':
        return (
          <>
             {/* Small stem */}
             <path d="M 32 2 L 32 8" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
             {/* Lumpy curved seed pod */}
             <path d="M 32 8 C 50 8, 60 20, 56 36 C 52 52, 40 50, 42 42 C 44 34, 46 22, 32 20 C 18 22, 16 34, 20 44 C 24 54, 8 60, 4 44 C -2 24, 14 8, 32 8 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
             {/* Dent textures/segments */}
             <path d="M 22 28 Q 28 32 26 22 M 42 26 Q 44 34 38 32 M 34 46 Q 44 50 48 40 M 18 42 Q 10 52 14 56" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
             <TinyFace outlineColor={outlineColor} />
          </>
        );
    }

    switch (shapeGroup) {
      case 'mango':
        return (
          <g transform="translate(0, 4)">
            {/* Canopy Back */}
            <path d="M 32 -10 C 50 -10, 60 4, 54 20 C 62 24, 58 36, 44 38 C 42 46, 22 46, 20 38 C 6 36, 2 24, 10 20 C 4 4, 14 -10, 32 -10 Z" fill="#3A752C" />
            {/* Trunk */}
            <path d="M 32 16 Q 30 36 26 56 L 38 56 Q 34 36 32 16" fill="#8B5A2B" />
            <path d="M 28 56 Q 30 40 32 16 Q 34 40 36 56" fill="none" stroke="#5C3A21" strokeWidth="2" opacity="0.6"/>
            {/* Pot */}
            <path d="M 18 54 Q 32 58 46 54 L 42 66 Q 32 68 22 66 Z" fill="#C15C3D" stroke="#8A3C24" strokeWidth="2" strokeLinejoin="round" />
            <path d="M 16 48 L 48 48 L 46 54 Q 32 58 18 54 Z" fill="#DB7052" stroke="#8A3C24" strokeWidth="2" strokeLinejoin="round" />
            {/* Canopy Front */}
            <path d="M 32 -10 C 50 -10, 60 4, 54 20 C 62 24, 58 36, 44 38 C 42 46, 22 46, 20 38 C 6 36, 2 24, 10 20 C 4 4, 14 -10, 32 -10 Z" fill="#4B8B3B" stroke="#2D5A27" strokeWidth="2" strokeLinejoin="round" />
            {/* Mangoes */}
            <g fill="#FFC843" stroke="#D97925" strokeWidth="1.5">
              <circle cx="24" cy="8" r="3.5" />
              <circle cx="44" cy="12" r="3.5" />
              <circle cx="34" cy="-2" r="3.5" />
              <circle cx="18" cy="22" r="3.5" />
              <circle cx="48" cy="26" r="3.5" />
              <circle cx="32" cy="28" r="3.5" />
            </g>
          </g>
        );
      case 'jackfruit':
        return (
          <>
            {/* Stem */}
            <path d="M 32 4 L 32 10" stroke={outlineColor} strokeWidth="4" strokeLinecap="round" />
            {/* Massive Heavy Oval */}
            <ellipse cx="32" cy="34" rx="26" ry="28" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            {/* Triangular Bumps Texture */}
            <g stroke={outlineColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
              <path d="M 16 20 L 19 24 L 22 20 M 26 20 L 29 24 L 32 20 M 36 20 L 39 24 L 42 20 M 46 20 L 49 24 L 52 20" />
              <path d="M 12 30 L 15 34 L 18 30 M 22 30 L 25 34 L 28 30 M 32 30 L 35 34 L 38 30 M 42 30 L 45 34 L 48 30 M 52 30 L 55 34 L 58 30" />
              <path d="M 14 40 L 17 44 L 20 40 M 24 40 L 27 44 L 30 40 M 34 40 L 37 44 L 40 40 M 44 40 L 47 44 L 50 40 M 54 40 L 57 44 L 60 40" />
              <path d="M 20 50 L 23 54 L 26 50 M 30 50 L 33 54 L 36 50 M 40 50 L 43 54 L 46 50 M 50 50 L 53 54 L 56 50" />
            </g>
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'banana':
        return (
          <g transform="translate(0, 4)">
            {/* Trunk */}
            <path d="M 26 56 Q 28 30 32 16 Q 36 30 38 56" fill="#8FD5A6" />
            <path d="M 28 56 Q 30 30 32 16 Q 34 30 36 56" fill="none" stroke="#4A824A" strokeWidth="1.5" />
            {/* Leaves (overlapping broad shapes) */}
            <path d="M 32 20 Q 10 10 2 24 Q 10 32 24 24" fill="#4B8B3B" stroke="#2D5A27" strokeWidth="1.5" />
            <path d="M 32 24 Q 50 14 62 28 Q 50 36 38 28" fill="#4B8B3B" stroke="#2D5A27" strokeWidth="1.5" />
            <path d="M 32 12 Q 10 0 6 12 Q 14 18 26 14" fill="#6A9F4B" stroke="#2D5A27" strokeWidth="1.5" />
            <path d="M 32 16 Q 50 0 58 16 Q 50 24 38 18" fill="#6A9F4B" stroke="#2D5A27" strokeWidth="1.5" />
            <path d="M 32 10 Q 16 -12 28 -20 Q 34 -10 32 10" fill="#8BCB52" stroke="#2D5A27" strokeWidth="1.5" />
            <path d="M 32 14 Q 48 -10 38 -18 Q 30 -6 32 14" fill="#8BCB52" stroke="#2D5A27" strokeWidth="1.5" />
            <path d="M 32 4 Q 32 -16 22 -24 Q 26 -10 32 4" fill="#A4D76E" stroke="#2D5A27" strokeWidth="1.5" />
            {/* Banana Bunch */}
            <path d="M 34 26 L 36 38 Q 38 40 40 36 L 40 28" fill="#FFE366" stroke="#D69F12" strokeWidth="1" strokeLinejoin="round" />
            <path d="M 32 26 L 33 38 Q 35 40 37 36 L 36 28" fill="#FFC843" stroke="#D69F12" strokeWidth="1" strokeLinejoin="round" />
            <path d="M 30 26 L 30 38 Q 32 40 34 36 L 32 28" fill="#FFE366" stroke="#D69F12" strokeWidth="1" strokeLinejoin="round" />
            {/* Pot */}
            <path d="M 22 48 L 42 48 L 40 66 Q 32 68 24 66 Z" fill="#4A4A4A" stroke="#2B2B2B" strokeWidth="2" strokeLinejoin="round" />
            <path d="M 22 52 L 42 52" stroke="#2B2B2B" strokeWidth="2" />
          </g>
        );
      case 'coconut':
        return (
          <>
            {/* Palm Fronds (Back) */}
            <path d="M 32 16 Q 16 0 4 10 Q 16 16 32 16" fill={secondaryColor || "#4A824A"} stroke={outlineColor} strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M 32 16 Q 48 0 60 10 Q 48 16 32 16" fill={secondaryColor || "#4A824A"} stroke={outlineColor} strokeWidth="2.5" strokeLinejoin="round" />
            {/* Green Daab (Diamond/tapered top) */}
            <path d="M 24 12 L 40 12 L 54 30 C 54 48, 44 60, 32 60 C 20 60, 10 48, 10 30 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
            <path d="M 24 12 L 40 12 L 54 30" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinejoin="round" />
            {/* Texture */}
            <path d="M 20 18 L 24 30 M 44 18 L 40 30 M 32 14 L 32 26" fill="none" stroke={outlineColor} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'guava':
        return (
          <>
            {/* Stem & Leaf */}
            <path d="M 32 4 L 32 12" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
            <path d="M 32 8 C 42 0, 56 6, 56 16 C 56 26, 42 22, 32 8 Z" fill="#78B880" stroke={outlineColor} strokeWidth="2.5" strokeLinejoin="round" />
            {/* Uneven Round Shape */}
            <path d="M 32 12 C 54 12, 60 32, 54 50 C 48 60, 16 60, 10 50 C 4 32, 10 12, 32 12 Z" fill="#91F0AE" stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
            {/* Bottom Floral Remnant */}
            <path d="M 28 58 L 32 54 L 36 58 M 30 60 L 32 56 L 34 60" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'litchi':
        return (
          <>
            {/* Branch and Leaves */}
            <path d="M 32 4 C 32 12, 24 16, 20 20 M 32 8 C 32 16, 40 20, 46 24" fill="none" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
            <path d="M 32 4 C 44 -4, 56 4, 52 14 C 48 24, 38 16, 32 4 Z" fill="#84D870" stroke={outlineColor} strokeWidth="2" strokeLinejoin="round" />
            
            {/* Back Sphere (Right) */}
            <path d="M 36 20 C 56 20, 62 40, 52 54 C 44 60, 26 56, 36 20 Z" fill="#FFA3B1" stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
            <path d="M 44 26 L 46 28 M 52 34 L 54 36 M 52 46 L 54 48 M 46 52 L 48 54 M 40 46 L 42 48" stroke={outlineColor} strokeWidth="2" strokeLinecap="round" opacity="0.4" />

            {/* Front Sphere (Left) */}
            <path d="M 22 18 C 4 18, -2 42, 12 56 C 24 64, 42 56, 38 34 C 36 22, 28 18, 22 18 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
            
            {/* Bumpy Texture */}
            <path d="M 12 28 L 14 30 M 8 40 L 10 42 M 14 50 L 16 52 M 24 54 L 26 56 M 30 44 L 32 46 M 24 34 L 26 36 M 18 36 L 20 38" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
            
            <g transform="translate(-10, 4)">
               <TinyFace outlineColor={outlineColor} />
            </g>
          </>
        );
      case 'papaya':
        return (
          <>
            <defs>
              <linearGradient id="papayaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B8E68C" />
                <stop offset="60%" stopColor="#FFCE6B" />
                <stop offset="100%" stopColor="#FF9E4A" />
              </linearGradient>
            </defs>
            {/* Stem */}
            <path d="M 32 4 L 32 10" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" />
            {/* Elongated bottom-heavy pear */}
            <path d="M 26 10 C 38 10, 38 10, 38 10 C 44 14, 46 26, 48 34 C 54 50, 48 62, 32 62 C 16 62, 10 50, 16 34 C 18 26, 20 14, 26 10 Z" fill="url(#papayaGrad)" stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
            {/* Highlight */}
            <path d="M 24 16 C 18 28, 16 46, 24 56" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" />
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'pineapple':
        return (
          <>
            {/* Top Crown */}
            <path d="M 32 20 L 22 2 L 28 14 L 32 0 L 36 14 L 42 2 L 32 20 Z" fill={secondaryColor || "#79C24A"} stroke={outlineColor} strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M 16 12 L 24 22 L 8 20 L 20 28 L 6 36 L 24 32 L 32 24 L 24 32" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" fill={secondaryColor || "#79C24A"} strokeLinejoin="round" />
            <path d="M 48 12 L 40 22 L 56 20 L 44 28 L 58 36 L 40 32 L 32 24 L 40 32" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" fill={secondaryColor || "#79C24A"} strokeLinejoin="round" />
            {/* Body */}
            <path d="M 18 26 C 18 26, 46 26, 46 26 C 52 34, 52 50, 46 62 L 18 62 C 12 50, 12 34, 18 26 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
            {/* Cross-Hatch Grid */}
            <g stroke={outlineColor} strokeWidth="2" strokeLinecap="round" opacity="0.3">
               <path d="M 18 36 L 46 48 M 18 46 L 46 58 M 18 28 L 46 40" />
               <path d="M 46 36 L 18 48 M 46 46 L 18 58 M 46 28 L 18 40" />
            </g>
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'strawberry':
        return (
          <>
            {/* Leaves */}
            <path d="M 32 16 L 20 6 L 26 18 L 12 16 L 24 22 L 16 30 L 28 24 L 32 16" fill={secondaryColor || "#79C24A"} stroke={outlineColor} strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M 32 16 L 44 6 L 38 18 L 52 16 L 40 22 L 48 30 L 36 24 L 32 16" fill={secondaryColor || "#79C24A"} stroke={outlineColor} strokeWidth="2.5" strokeLinejoin="round" />
            {/* Pointy Heart */}
            <path d="M 32 18 C 52 18, 58 30, 32 62 C 6 30, 12 18, 32 18 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
            {/* Seed Indents */}
            <path d="M 24 29 L 24 31 M 40 29 L 40 31 M 32 35 L 32 37 M 20 41 L 20 43 M 44 41 L 44 43 M 28 47 L 28 49 M 36 47 L 36 49 M 32 23 L 32 25" stroke={outlineColor} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'taal':
        return (
          <g transform="translate(0, 4)">
            {/* Floating Island Base */}
            <path d="M 12 56 Q 32 48 52 56 Q 64 64 32 68 Q 0 64 12 56 Z" fill="#8BCB52" stroke="#4A824A" strokeWidth="2" strokeLinejoin="round" />
            <path d="M 12 56 Q 32 60 52 56 Q 60 64 32 66 Q 4 64 12 56 Z" fill="#6A9F4B" opacity="0.6"/>
            {/* Trunk */}
            <path d="M 34 58 Q 44 30 32 4 Q 40 30 38 58" fill="#8B5A2B" stroke="#5C3A21" strokeWidth="2" strokeLinejoin="round" />
            <path d="M 34 52 L 40 50 M 34 44 L 40 42 M 33 36 L 39 34 M 32 28 L 38 26 M 32 20 L 37 18" stroke="#5C3A21" strokeWidth="2" />
            {/* Spiky Palm Fronds */}
            <path d="M 32 4 C 10 -4, -4 16, 20 12 L 32 4" fill="#4B8B3B" stroke="#2D5A27" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M 32 4 C 54 -4, 68 16, 44 12 L 32 4" fill="#4B8B3B" stroke="#2D5A27" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M 32 4 C 18 -20, -2 -8, 20 -4 L 32 4" fill="#6A9F4B" stroke="#2D5A27" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M 32 4 C 46 -20, 66 -8, 44 -4 L 32 4" fill="#6A9F4B" stroke="#2D5A27" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M 32 4 C 28 -24, 40 -26, 36 -6 L 32 4" fill="#8BCB52" stroke="#2D5A27" strokeWidth="1.5" strokeLinejoin="round" />
            {/* Taal Fruits */}
            <circle cx="28" cy="6" r="4.5" fill="#3D2B4A" stroke="#181024" strokeWidth="1.5" />
            <circle cx="36" cy="6" r="4.5" fill="#3D2B4A" stroke="#181024" strokeWidth="1.5" />
            <circle cx="32" cy="10" r="4.5" fill="#3D2B4A" stroke="#181024" strokeWidth="1.5" />
          </g>
        );
      case 'melon':
      case 'citrus':
        return (
          <>
            <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
            <circle cx="32" cy="36" r="28" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            {shapeGroup === 'citrus' ? (
               <path d="M 24 54 v 1.5 M 28 56 v 1.5 M 32 58 v 1.5 M 36 56 v 1.5 M 40 54 v 1.5 M 20 50 v 1.5 M 44 50 v 1.5 M 26 50 v 1.5 M 38 50 v 1.5 M 32 52 v 1.5" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
            ) : (
               <path d="M 14 30 C 24 40, 40 40, 50 30 M 12 38 C 24 48, 40 48, 52 38 M 16 46 C 26 54, 38 54, 48 46" fill="none" stroke={secondaryColor || "#D44242"} strokeWidth="5" strokeLinecap="round" opacity="0.6" />
            )}
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'oval':
        return (
          <>
            <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
            <ellipse cx="32" cy="36" rx="24" ry="30" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            <path d="M 44 24 A 14 18 0 0 1 44 48" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.15" />
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'round':
        return (
          <>
            <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
            <circle cx="32" cy="36" r="28" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            <path d="M 48 24 A 18 18 0 0 1 48 48" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.15" />
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'fig':
        return (
          <>
            <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
            <path d="M22 16 L42 16 Q 48 34 56 48 Q 56 62 32 62 Q 8 62 8 48 Q 16 34 22 16 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
            <path d="M 50 36 Q 52 46 44 52" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.15" />
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'flower':
        return (
          <>
            <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
            <path d="M32 6 Q 56 6 56 28 Q 56 50 32 62 Q 8 50 8 28 Q 8 6 32 6 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'long_fruit':
        return (
          <>
            <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
            <rect x="20" y="10" width="24" height="50" rx="12" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            <path d="M26 14 L26 56 M38 14 L38 56" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.2" />
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'spiky':
        return (
          <>
            <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
            <ellipse cx="32" cy="36" rx="26" ry="30" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeDasharray="8 6" />
            <ellipse cx="32" cy="36" rx="26" ry="30" fill={primaryColor} stroke="none" />
            <path d="M 12 36 L 52 36 M 22 20 L 42 52 M 42 20 L 22 52" stroke={outlineColor} strokeWidth="2.5" opacity="0.25" strokeLinecap="round" />
            <ellipse cx="32" cy="36" rx="26" ry="30" fill="none" stroke={outlineColor} strokeWidth="3" />
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'berry':
        return (
          <>
            <path d="M16 8 L32 18 L48 8 Z" fill={secondaryColor || "#8FD5A6"} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round"/>
            <path d="M14 18 C -4 38, 14 62, 32 62 C 50 62, 68 38, 50 18 C 42 6, 22 6, 14 18 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round"/>
            <circle cx="26" cy="30" r="2" fill={outlineColor} opacity="0.4" />
            <circle cx="38" cy="28" r="2" fill={outlineColor} opacity="0.4" />
            <circle cx="32" cy="40" r="2" fill={outlineColor} opacity="0.4" />
            <circle cx="20" cy="44" r="2" fill={outlineColor} opacity="0.4" />
            <circle cx="44" cy="44" r="2" fill={outlineColor} opacity="0.4" />
            <circle cx="48" cy="32" r="2" fill={outlineColor} opacity="0.4" />
            <circle cx="16" cy="34" r="2" fill={outlineColor} opacity="0.4" />
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'cluster':
        return (
          <>
            <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
            <circle cx="22" cy="22" r="10" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
            <circle cx="42" cy="22" r="10" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
            <circle cx="14" cy="36" r="10" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
            <circle cx="50" cy="36" r="10" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
            <circle cx="32" cy="36" r="10" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
            <circle cx="22" cy="50" r="10" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
            <circle cx="42" cy="50" r="10" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
            <circle cx="32" cy="50" r="10" fill={primaryColor} stroke={outlineColor} strokeWidth="2.5" />
          </>
        );
      case 'palm':
        return (
          <>
            <path d="M16 26 Q32 -4 48 26 M8 16 Q32 -10 56 16 M24 36 Q32 6 40 36 M4 28 Q32 16 60 28" fill="none" stroke={secondaryColor || "#8FD5A6"} strokeWidth="4" strokeLinecap="round" />
            <circle cx="32" cy="42" r="22" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            <circle cx="24" cy="30" r="3" fill={outlineColor} opacity="0.2" />
            <circle cx="40" cy="30" r="3" fill={outlineColor} opacity="0.2" />
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'star':
        return (
          <>
            <path d="M32 4 L42 24 L62 26 L46 40 L50 60 L32 48 L14 60 L18 40 L2 26 L22 24 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
            <path d="M32 4 L 32 48 M 14 60 L 32 48 M 50 60 L 32 48 M 2 26 L 22 24 M 62 26 L 42 24" fill="none" stroke={outlineColor} strokeWidth="2" strokeLinecap="round" opacity="0.25" />
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      case 'bean':
        return (
          <>
            <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
            <path d="M16 14 C 10 26, 16 38, 12 50 C 10 62, 34 62, 36 50 C 40 38, 36 26, 34 14 C 30 2, 22 2, 16 14 Z" fill={primaryColor} stroke={outlineColor} strokeWidth="3" strokeLinejoin="round" />
            <path d="M16 30 Q 24 30 24 38 M 28 42 Q 22 46 28 50" fill="none" stroke={outlineColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.2" />
            <TinyFace outlineColor={outlineColor} />
          </>
        );
      default:
        return (
          <>
            <CuteLeaf secondaryColor={secondaryColor} outlineColor={outlineColor} />
            <circle cx="32" cy="36" r="28" fill={primaryColor} stroke={outlineColor} strokeWidth="3" />
            <TinyFace outlineColor={outlineColor} />
          </>
        );
    }
  };

  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {isGolden && (
        <defs>
          <filter id="goldenTexture" x="-20%" y="-20%" width="140%" height="140%">
            <feColorMatrix type="matrix" values="
              1.2   0.5   0     0     0
              0     1.0   0     0     0
              0     0     0.2   0     0
              0     0     0     1     0
            " result="sepiaSat"/>
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ffd700" floodOpacity="0.8" />
          </filter>
        </defs>
      )}
      <g filter={isGolden ? "url(#goldenTexture)" : undefined}>
        {renderShape()}
      </g>
    </svg>
  );
});
