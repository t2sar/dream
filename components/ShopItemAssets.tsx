import React from 'react';

export type ShopAssetProps = React.SVGProps<SVGSVGElement>;

export const ShopBoosts: Record<string, React.FC<ShopAssetProps>> = {
  'boost_sunlight': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFF7ED" />
          <stop offset="40%" stopColor="#FEF08A" />
          <stop offset="80%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </radialGradient>
        <radialGradient id="sunAura" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FDE047" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#FDE047" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="40" r="35" fill="url(#sunAura)" />
      
      {/* Sunlight Droplet */}
      <path d="M 50 15 C 65 35, 75 45, 75 55 C 75 68.8, 63.8 80, 50 80 C 36.2 80, 25 68.8, 25 55 C 25 45, 35 35, 50 15 Z" fill="url(#sunGlow)" />
      
      {/* Inner bright highlight */}
      <path d="M 50 25 C 55 35, 60 45, 60 55 C 60 62, 55 65, 50 65 C 45 65, 40 62, 40 55 C 40 45, 45 35, 50 25 Z" fill="#FEF08A" opacity="0.8" />
      
      {/* Soft Cloud Base */}
      <path d="M 30 75 C 20 75, 15 85, 25 90 L 75 90 C 85 85, 80 75, 70 75 C 65 65, 55 65, 50 70 C 45 65, 35 65, 30 75 Z" fill="#E2E8F0" />
      <path d="M 30 77 C 20 77, 15 87, 25 92 L 75 92 C 85 87, 80 77, 70 77 C 65 67, 55 67, 50 72 C 45 67, 35 67, 30 77 Z" fill="#CBD5E1" opacity="0.5" />
    </svg>
  ),
  'boost_rain': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <radialGradient id="waterDrop" cx="40%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="40%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </radialGradient>
        <linearGradient id="glassVial" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8"/>
          <stop offset="30%" stopColor="#F8FAFC" stopOpacity="0.2"/>
          <stop offset="70%" stopColor="#E2E8F0" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.4"/>
        </linearGradient>
      </defs>
      
      {/* Background/Back glass of vial */}
      <path d="M 35 30 L 35 45 C 20 50, 15 70, 25 85 C 35 95, 65 95, 75 85 C 85 70, 80 50, 65 45 L 65 30 Z" fill="#94A3B8" opacity="0.15" />
      
      {/* The Water Droplet Inside */}
      <path d="M 50 50 C 60 62, 70 70, 70 80 C 70 91, 61 100, 50 100 C 39 100, 30 91, 30 80 C 30 70, 40 62, 50 50 Z" fill="url(#waterDrop)" transform="translate(0, -15) scale(0.9) translate(5, 5)" />
      
      {/* Cute Water Droplet Highlight */}
      <path d="M 45 70 C 42 75, 42 80, 45 83 C 48 80, 48 75, 45 70 Z" fill="#FFFFFF" opacity="0.6" />
      
      {/* Cork Top */}
      <path d="M 40 15 L 60 15 L 63 30 L 37 30 Z" fill="#D97706" />
      <path d="M 40 15 L 60 15 L 63 20 L 37 20 Z" fill="#F59E0B" />
      
      {/* Front Glass of vial */}
      <path d="M 35 30 L 35 45 C 20 50, 15 70, 25 85 C 35 95, 65 95, 75 85 C 85 70, 80 50, 65 45 L 65 30 Z" fill="url(#glassVial)" />
      <path d="M 28 65 C 25 75, 30 85, 40 90" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <path d="M 72 65 C 75 75, 70 85, 60 90" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      
      {/* Vial Rim */}
      <ellipse cx="50" cy="30" rx="16" ry="4" fill="none" stroke="#CBD5E1" strokeWidth="3" />
      <ellipse cx="50" cy="30" rx="16" ry="4" fill="#FFFFFF" opacity="0.2" />
    </svg>
  ),
  'boost_fertilizer': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <radialGradient id="burlapBase" cx="40%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#92400E" />
          <stop offset="70%" stopColor="#78350F" />
          <stop offset="100%" stopColor="#451A03" />
        </radialGradient>
        <radialGradient id="burlapHighlight" cx="30%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#B45309" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#92400E" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Soft Sprout popping out top */}
      <path d="M 50 35 C 45 25, 35 25, 35 15 C 35 25, 45 30, 48 35 Z" fill="#84CC16" />
      <path d="M 50 35 C 55 20, 65 15, 65 10 C 60 20, 55 25, 52 35 Z" fill="#65A30D" />
      <path d="M 49 35 C 48 20, 45 10, 45 5 Z" fill="none" stroke="#4D7C0F" strokeWidth="2" strokeLinecap="round" />
      <path d="M 45 5 C 50 5, 55 10, 55 20 C 55 10, 50 15, 45 5 Z" fill="#A3E635" />

      {/* Main Burlap Sack Body */}
      <path d="M 38 25 L 62 25 L 65 40 C 80 50, 90 75, 75 90 C 60 98, 40 98, 25 90 C 10 75, 20 50, 35 40 Z" fill="url(#burlapBase)" />
      
      {/* Top ruffle of sack */}
      <path d="M 38 25 C 30 15, 45 15, 45 25 Z" fill="#78350F" />
      <path d="M 45 25 C 45 10, 60 10, 55 25 Z" fill="#78350F" />
      <path d="M 55 25 C 60 15, 70 20, 62 25 Z" fill="#78350F" />
      
      {/* Burlap sack highlight to add roundness */}
      <path d="M 38 25 L 62 25 L 65 40 C 80 50, 90 75, 75 90 C 60 98, 40 98, 25 90 C 10 75, 20 50, 35 40 Z" fill="url(#burlapHighlight)" />
      
      {/* Subtexture/creases on sack */}
      <path d="M 30 60 C 35 70, 40 85, 40 90" fill="none" stroke="#451A03" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <path d="M 70 65 C 65 75, 60 85, 60 90" fill="none" stroke="#451A03" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <path d="M 48 50 C 48 60, 52 70, 52 80" fill="none" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />

      {/* Green String Tie */}
      <path d="M 35 37 C 45 42, 55 42, 65 37" fill="none" stroke="#4ADE80" strokeWidth="4" strokeLinecap="round" />
      <path d="M 50 39 C 45 45, 35 45, 30 55 C 35 45, 45 45, 50 39 Z" fill="#4ADE80" />
      <path d="M 50 39 C 55 45, 60 50, 65 60 C 60 50, 55 45, 50 39 Z" fill="#22C55E" />
    </svg>
  ),
  'boost_recovery_water': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <radialGradient id="recoveryGlow" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#A7F3D0" />
          <stop offset="40%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </radialGradient>
        <linearGradient id="potionGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7"/>
          <stop offset="30%" stopColor="#F8FAFC" stopOpacity="0.1"/>
          <stop offset="70%" stopColor="#E2E8F0" stopOpacity="0.05"/>
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3"/>
        </linearGradient>
      </defs>
      
      {/* Back Glass */}
      <path d="M 40 25 L 40 40 C 25 50, 20 70, 30 85 C 40 95, 60 95, 70 85 C 80 70, 75 50, 60 40 L 60 25 Z" fill="#94A3B8" opacity="0.15" />
      
      {/* Liquid Recovery Water */}
      <path d="M 23 60 C 35 65, 65 55, 77 60 C 78 68, 75 78, 68 83 C 60 91, 40 91, 32 83 C 25 78, 22 68, 23 60 Z" fill="url(#recoveryGlow)" />
      
      {/* Glowing Leaf inside */}
      <path d="M 50 65 C 45 75, 50 85, 50 85 C 50 85, 55 75, 50 65 Z" fill="#D1FAE5" opacity="0.9" />
      <path d="M 50 72 C 42 75, 38 80, 38 80 C 38 80, 45 82, 50 72 Z" fill="#6EE7B7" opacity="0.8" />
      <path d="M 50 72 C 58 75, 62 80, 62 80 C 62 80, 55 82, 50 72 Z" fill="#6EE7B7" opacity="0.8" />

      {/* Front Glass */}
      <path d="M 40 25 L 40 40 C 25 50, 20 70, 30 85 C 40 95, 60 95, 70 85 C 80 70, 75 50, 60 40 L 60 25 Z" fill="url(#potionGlass)" />
      
      {/* Highlights */}
      <path d="M 30 65 C 28 72, 32 80, 38 85" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      
      {/* Cork */}
      <path d="M 42 12 L 58 12 L 60 25 L 40 25 Z" fill="#B45309" />
      <path d="M 42 12 L 58 12 L 60 18 L 40 18 Z" fill="#D97706" />
      <ellipse cx="50" cy="12" rx="8" ry="3" fill="#F59E0B" />
      
      {/* Rope Tie around neck */}
      <path d="M 38 42 C 45 46, 55 46, 62 42" fill="none" stroke="#65A30D" strokeWidth="3" strokeLinecap="round" />
      <path d="M 50 44 L 45 52 M 50 44 L 54 50" stroke="#65A30D" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  'item_streak_freeze': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="iceBlockGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#BAE6FD" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id="seedGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="1" />
          <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#B45309" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Soft periwinkle drop shadow beneath */}
      <ellipse cx="50" cy="85" rx="35" ry="8" fill="#C7D2FE" opacity="0.6" />
      <ellipse cx="50" cy="85" rx="20" ry="4" fill="#A5B4FC" opacity="0.8" />
      
      {/* Back face of the ice block for 3D translucent depth */}
      <path d="M 30 25 L 70 25 L 70 65 L 30 65 Z" fill="#7DD3FC" opacity="0.4" />
      
      {/* Glowing Golden Seed in the center */}
      <circle cx="50" cy="45" r="25" fill="url(#seedGlow)" />
      <path d="M 50 35 C 60 35, 60 55, 50 55 C 40 55, 40 35, 50 35 Z" fill="#FACC15" />
      <path d="M 50 38 C 55 38, 55 52, 50 52" fill="#FEF08A" opacity="0.8" />
      <circle cx="50" cy="45" r="3" fill="#FFFFFF" opacity="0.9" />
      
      {/* Front faces of the frosted light-blue ice block (flat 2D vector style) */}
      <path d="M 20 35 L 50 15 L 80 35 L 80 75 L 50 95 L 20 75 Z" fill="url(#iceBlockGrad)" />
      <path d="M 20 35 L 50 50 L 50 95 L 20 75 Z" fill="#E0F2FE" opacity="0.5" />
      <path d="M 50 50 L 80 35 L 80 75 L 50 95 Z" fill="#7DD3FC" opacity="0.5" />
      <path d="M 20 35 L 50 15 L 80 35 L 50 50 Z" fill="#FFFFFF" opacity="0.6" />
      
      {/* Crisp ice edge highlights */}
      <path d="M 50 15 L 50 50" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <path d="M 20 35 L 50 50 L 80 35" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <path d="M 50 50 L 50 95" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      
      {/* Frost sparkles */}
      <path d="M 30 30 L 32 25 L 34 30 L 39 32 L 34 34 L 32 39 L 30 34 L 25 32 Z" fill="#FFFFFF" opacity="0.9" />
      <path d="M 65 70 L 66 67 L 67 70 L 70 71 L 67 72 L 66 75 L 65 72 L 62 71 Z" fill="#FFFFFF" opacity="0.8" />
    </svg>
  ),
  'boost_streak_repair': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <radialGradient id="repairGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FCA5A5" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#FCA5A5" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>
      
      <circle cx="50" cy="50" r="40" fill="url(#repairGlow)" />
      
      {/* Back layer wrench */}
      <g transform="translate(50, 50) rotate(45) translate(-50, -50)">
        <path d="M 44 20 C 44 15, 56 15, 56 20 L 52 80 C 52 85, 48 85, 48 80 Z" fill="#CBD5E1" />
        <path d="M 40 15 C 40 5, 60 5, 60 15 C 60 20, 55 25, 50 25 C 45 25, 40 20, 40 15 Z" fill="#94A3B8" />
        <circle cx="50" cy="18" r="4" fill="#334155" />
        <path d="M 44 85 C 44 80, 56 80, 56 85 L 56 90 C 56 95, 44 95, 44 90 Z" fill="#94A3B8" />
      </g>
      
      {/* Front Glowing Heart */}
      <path d="M 50 40 C 50 40, 45 25, 30 30 C 15 35, 20 60, 50 85 C 80 60, 85 35, 70 30 C 55 25, 50 40, 50 40 Z" fill="#EF4444" />
      <path d="M 50 45 C 50 45, 46 32, 34 36 C 22 40, 26 58, 50 78 C 74 58, 78 40, 66 36 C 54 32, 50 45, 50 45 Z" fill="#F87171" />
      
      {/* Golden Bandage/Plaster across the heart */}
      <path d="M 35 55 L 65 45 C 68 44, 70 47, 68 50 L 38 60 C 35 61, 33 58, 35 55 Z" fill="url(#goldGrad)" />
      <path d="M 45 42 L 55 72 L 51 75 L 41 45 Z" fill="url(#goldGrad)" />
      
      <circle cx="45" cy="51" r="1.5" fill="#B45309" />
      <circle cx="55" cy="48" r="1.5" fill="#B45309" />
      <circle cx="48" cy="62" r="1.5" fill="#B45309" />
    </svg>
  )
};

export const ShopPots: Record<string, React.FC<ShopAssetProps>> = {
  'pot_clay_basic': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="clayBase" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="60%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="clayRim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
      
      {/* Sub-shadow underneath */}
      <ellipse cx="50" cy="92" rx="30" ry="6" fill="#1E293B" opacity="0.3" />

      {/* Pot Body */}
      <path d="M 22 30 L 32 90 C 35 96, 65 96, 68 90 L 78 30 Z" fill="url(#clayBase)" />
      
      {/* Side deep shadow for roundness */}
      <path d="M 78 30 L 68 90 C 70 85, 75 60, 78 30 Z" fill="#92400E" opacity="0.3" />
      
      {/* Smooth rounded upper rim */}
      <rect x="15" y="15" width="70" height="18" rx="8" fill="url(#clayRim)" />
      
      {/* Rim shadow underneath */}
      <path d="M 15 28 L 85 28 C 85 31, 82 33, 77 33 L 23 33 C 18 33, 15 31, 15 28 Z" fill="#92400E" opacity="0.2" />

      {/* Inner Dirt opening */}
      <ellipse cx="50" cy="15" rx="30" ry="8" fill="#451A03" />
      <ellipse cx="50" cy="15" rx="35" ry="1" fill="#FEF3C7" opacity="0.3" />
    </svg>
  ),
  'pot_clay_colorful': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="whiteClayBase" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
        <linearGradient id="whiteClayRim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
      </defs>
      
      {/* Sub-shadow underneath */}
      <ellipse cx="50" cy="92" rx="30" ry="6" fill="#1E293B" opacity="0.3" />

      {/* Pot Body */}
      <path d="M 22 30 L 32 90 C 35 96, 65 96, 68 90 L 78 30 Z" fill="url(#whiteClayBase)" />
      
      {/* Side deep shadow for roundness */}
      <path d="M 78 30 L 68 90 C 70 85, 75 60, 78 30 Z" fill="#94A3B8" opacity="0.2" />

      {/* Painted Patterns */}
      {/* Teal wide middle band */}
      <path d="M 25 45 L 75 45 L 73 60 L 27 60 Z" fill="#14B8A6" />
      <path d="M 27 60 L 73 60 L 71 65 L 29 65 Z" fill="#0D9488" />
      
      {/* Pink Geometric zig zags on the teal band */}
      <path d="M 25 45 L 35 55 L 45 45 L 55 55 L 65 45 L 75 45 L 65 55 L 55 45 L 45 55 L 35 45 Z" fill="#F43F5E" />

      {/* Smooth rounded upper rim */}
      <rect x="15" y="15" width="70" height="18" rx="8" fill="url(#whiteClayRim)" />
      
      {/* Inner Dirt opening */}
      <ellipse cx="50" cy="15" rx="30" ry="8" fill="#451A03" />
      <ellipse cx="50" cy="15" rx="35" ry="1" fill="#FFFFFF" opacity="0.6" />
    </svg>
  ),
  'pot_bamboo_basket': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="bambooGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="40%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
      </defs>
      
      {/* Shadow underneath */}
      <ellipse cx="50" cy="92" rx="30" ry="6" fill="#1E293B" opacity="0.3" />

      {/* Basket Base Body */}
      <path d="M 25 25 L 35 90 C 37 95, 63 95, 65 90 L 75 25 Z" fill="url(#bambooGrad)" />
      
      {/* Bamboo weave texture overlay */}
      <g stroke="#92400E" strokeWidth="2" opacity="0.4">
        <path d="M 28 40 L 72 40 M 30 55 L 70 55 M 32 70 L 68 70 M 34 85 L 66 85" />
        <path d="M 33 25 L 38 90 M 43 25 L 45 90 M 50 25 L 50 90 M 57 25 L 55 90 M 67 25 L 62 90" />
        
        {/* Diagonal accents */}
        <path d="M 25 25 L 70 85 M 35 25 L 60 85 M 45 25 L 50 85 M 75 25 L 30 85 M 65 25 L 40 85" strokeWidth="1" opacity="0.5" />
      </g>
      
      {/* Side deep shadow for roundness */}
      <path d="M 75 25 L 65 90 C 67 85, 72 60, 75 25 Z" fill="#78350F" opacity="0.4" />

      {/* Upper Thick Bamboo Rim */}
      <rect x="20" y="15" width="60" height="12" rx="4" fill="#F59E0B" />
      <g stroke="#B45309" strokeWidth="2" opacity="0.6">
        <path d="M 30 15 L 30 27 M 40 15 L 40 27 M 50 15 L 50 27 M 60 15 L 60 27 M 70 15 L 70 27" />
      </g>
      <rect x="20" y="15" width="60" height="4" rx="2" fill="#FEF08A" opacity="0.4" />
      
      {/* Inner dirt opening */}
      <ellipse cx="50" cy="15" rx="25" ry="6" fill="#451A03" />
      <ellipse cx="50" cy="15" rx="28" ry="1" fill="#FEF3C7" opacity="0.2" />
    </svg>
  ),
  'pot_rooftop_tub': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="tubGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="40%" stopColor="#0EA5E9" />
          <stop offset="80%" stopColor="#0369A1" />
          <stop offset="100%" stopColor="#082F49" />
        </linearGradient>
      </defs>
      
      {/* Shadow underneath */}
      <ellipse cx="50" cy="92" rx="32" ry="6" fill="#1E293B" opacity="0.3" />

      {/* Tub Body */}
      <path d="M 22 25 L 28 90 C 30 95, 70 95, 72 90 L 78 25 Z" fill="url(#tubGrad)" />
      
      {/* Horizontal ridges / rings commonly found on plastic drums */}
      <path d="M 24 40 L 76 40 M 25 55 L 75 55 M 26 70 L 74 70" stroke="#082F49" strokeWidth="3" opacity="0.5" />
      <path d="M 24 42 L 76 42 M 25 57 L 75 57 M 26 72 L 74 72" stroke="#BAE6FD" strokeWidth="2" opacity="0.3" />
      
      {/* Side deep shadow for roundness */}
      <path d="M 78 25 L 72 90 C 74 85, 76 60, 78 25 Z" fill="#082F49" opacity="0.4" />

      {/* Upper Rolled Rim */}
      <rect x="18" y="15" width="64" height="10" rx="5" fill="#0EA5E9" />
      <rect x="20" y="15" width="60" height="3" rx="1.5" fill="#BAE6FD" opacity="0.5" />
      
      {/* Rim shadow underneath */}
      <path d="M 20 25 L 80 25 C 80 28, 77 30, 72 30 L 28 30 C 23 30, 20 28, 20 25 Z" fill="#082F49" opacity="0.3" />

      {/* Inner dirt opening */}
      <ellipse cx="50" cy="15" rx="28" ry="7" fill="#451A03" />
      <ellipse cx="50" cy="15" rx="30" ry="1" fill="#FFFFFF" opacity="0.1" />
    </svg>
  )
};

export const ShopFences: Record<string, React.FC<ShopAssetProps>> = {
  'fence_bamboo': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="fenceBambooGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#A3E635" />
          <stop offset="50%" stopColor="#65A30D" />
          <stop offset="100%" stopColor="#3F6212" />
        </linearGradient>
      </defs>

      {/* We represent a stylized set of vertical pieces combined with horizontal rails */}
      
      {/* Vertical Bamboo Canes */}
      <rect x="15" y="10" width="10" height="85" rx="3" fill="url(#fenceBambooGrad)" />
      <rect x="28" y="18" width="10" height="77" rx="3" fill="url(#fenceBambooGrad)" />
      <rect x="41" y="5" width="10" height="90" rx="3" fill="url(#fenceBambooGrad)" />
      <rect x="54" y="20" width="10" height="75" rx="3" fill="url(#fenceBambooGrad)" />
      <rect x="67" y="12" width="10" height="83" rx="3" fill="url(#fenceBambooGrad)" />
      <rect x="80" y="25" width="10" height="70" rx="3" fill="url(#fenceBambooGrad)" />
      
      {/* Bamboo Ring Nodes / Partitions */}
      <g stroke="#3F6212" strokeWidth="2" opacity="0.6">
        <path d="M 15 30 L 25 30 M 15 55 L 25 55 M 15 80 L 25 80" />
        <path d="M 28 40 L 38 40 M 28 65 L 38 65" />
        <path d="M 41 25 L 51 25 M 41 50 L 51 50 M 41 75 L 51 75" />
        <path d="M 54 45 L 64 45 M 54 70 L 64 70" />
        <path d="M 67 35 L 77 35 M 67 60 L 77 60 M 67 85 L 77 85" />
        <path d="M 80 50 L 90 50 M 80 75 L 90 75" />
      </g>
      
      {/* Horizontal Connector Poles */}
      <rect x="5" y="40" width="95" height="8" rx="2" fill="url(#fenceBambooGrad)" />
      <rect x="5" y="70" width="95" height="8" rx="2" fill="url(#fenceBambooGrad)" />
      
      <g stroke="#3F6212" strokeWidth="2" opacity="0.6">
        <path d="M 25 40 L 25 48 M 50 40 L 50 48 M 75 40 L 75 48" />
        <path d="M 35 70 L 35 78 M 60 70 L 60 78 M 85 70 L 85 78" />
      </g>

      {/* Rope Ties Binding Intersections */}
      <g stroke="#78350F" strokeWidth="2">
        <path d="M 18 38 L 22 42 M 18 42 L 22 38" />
        <path d="M 18 68 L 22 72 M 18 72 L 22 68" />
        
        <path d="M 44 38 L 48 42 M 44 42 L 48 38" />
        <path d="M 44 68 L 48 72 M 44 72 L 48 68" />
        
        <path d="M 70 38 L 74 42 M 70 42 L 74 38" />
        <path d="M 70 68 L 74 72 M 70 72 L 74 68" />
      </g>

      {/* Floating base shadow to ground it in the UI */}
      <ellipse cx="50" cy="95" rx="40" ry="4" fill="#1E293B" opacity="0.3" />
    </svg>
  ),
  'fence_wooden': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="fenceWoodGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
      </defs>

      {/* Floating base shadow */}
      <ellipse cx="50" cy="95" rx="40" ry="4" fill="#1E293B" opacity="0.3" />

      {/* Horizontal Back Rails */}
      <rect x="5" y="35" width="90" height="10" fill="url(#fenceWoodGrad)" />
      <rect x="5" y="65" width="90" height="10" fill="url(#fenceWoodGrad)" />

      {/* Rail Shadows / Texture */}
      <path d="M 5 45 L 95 45 M 5 75 L 95 75" stroke="#78350F" strokeWidth="2" opacity="0.5" />
      <path d="M 5 38 L 95 38 M 5 68 L 95 68" stroke="#FEF08A" strokeWidth="1" opacity="0.3" />

      {/* Vertical Pickets (With Pointy Tops) */}
      <g fill="url(#fenceWoodGrad)">
        {/* Picket 1 */}
        <path d="M 15 20 L 22 10 L 29 20 L 29 90 L 15 90 Z" />
        {/* Picket 2 */}
        <path d="M 37 25 L 44 15 L 51 25 L 51 90 L 37 90 Z" />
        {/* Picket 3 */}
        <path d="M 59 18 L 66 8 L 73 18 L 73 90 L 59 90 Z" />
        {/* Picket 4 */}
        <path d="M 81 22 L 88 12 L 95 22 L 95 90 L 81 90 Z" />
      </g>

      {/* Wood Textures / Grain */}
      <g stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" opacity="0.4">
        <path d="M 20 25 L 20 85 M 24 35 L 24 75" />
        <path d="M 42 25 L 42 85 M 46 30 L 46 80" />
        <path d="M 64 20 L 64 85 M 68 25 L 68 75" />
        <path d="M 86 25 L 86 85 M 90 35 L 90 80" />
      </g>

      {/* Nails */}
      <g fill="#475569">
        <circle cx="22" cy="40" r="1.5" />
        <circle cx="22" cy="70" r="1.5" />
        <circle cx="44" cy="40" r="1.5" />
        <circle cx="44" cy="70" r="1.5" />
        <circle cx="66" cy="40" r="1.5" />
        <circle cx="66" cy="70" r="1.5" />
        <circle cx="88" cy="40" r="1.5" />
        <circle cx="88" cy="70" r="1.5" />
      </g>
    </svg>
  ),
  'fence_clay_wall': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <radialGradient id="brickWall" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="60%" stopColor="#B91C1C" />
          <stop offset="100%" stopColor="#7F1D1D" />
        </radialGradient>
        <linearGradient id="wallTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F87171" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
      </defs>

      {/* Floating base shadow */}
      <ellipse cx="50" cy="95" rx="42" ry="4" fill="#1E293B" opacity="0.3" />

      {/* Main Wall Block */}
      <path d="M 12 35 L 88 35 L 88 90 L 12 90 Z" fill="url(#brickWall)" />

      {/* Angled / Slanted Top (Cap) common in traditional walls */}
      <path d="M 8 28 L 92 28 L 88 35 L 12 35 Z" fill="url(#wallTop)" />

      {/* Front Face Brick Patterns (Subtle block shading) */}
      <g fill="#991B1B" opacity="0.6">
        <rect x="18" y="45" width="20" height="8" rx="1" />
        <rect x="42" y="45" width="20" height="8" rx="1" />
        <rect x="66" y="45" width="16" height="8" rx="1" />
        
        <rect x="12" y="58" width="12" height="8" rx="1" />
        <rect x="28" y="58" width="20" height="8" rx="1" />
        <rect x="52" y="58" width="20" height="8" rx="1" />
        <rect x="76" y="58" width="12" height="8" rx="1" />
        
        <rect x="18" y="71" width="20" height="8" rx="1" />
        <rect x="42" y="71" width="20" height="8" rx="1" />
        <rect x="66" y="71" width="16" height="8" rx="1" />
      </g>
      
      {/* Lighter Brick Highlights */}
      <g fill="#F87171" opacity="0.2">
        <rect x="22" y="38" width="16" height="4" rx="1" />
        <rect x="58" y="38" width="16" height="4" rx="1" />
      </g>

      {/* Ivy vines draping over the edge */}
      <path d="M 20 28 C 25 40, 15 50, 25 60" fill="none" stroke="#65A30D" strokeWidth="2" strokeLinecap="round" />
      <path d="M 65 28 C 65 40, 75 55, 65 70" fill="none" stroke="#65A30D" strokeWidth="2" strokeLinecap="round" />
      <path d="M 45 28 C 45 35, 50 40, 48 50" fill="none" stroke="#65A30D" strokeWidth="2" strokeLinecap="round" />

      {/* Ivy Leaves */}
      <g fill="#84CC16">
        <path d="M 20 35 Q 15 32 18 38 Q 15 42 20 35 Z" />
        <path d="M 24 45 Q 28 42 26 48 Q 28 52 24 45 Z" />
        <path d="M 21 55 Q 16 58 20 62 Q 24 58 21 55 Z" />

        <path d="M 45 35 Q 40 32 43 38 Q 40 42 45 35 Z" />
        <path d="M 48 45 Q 52 42 50 48 Q 52 52 48 45 Z" />
        
        <path d="M 65 35 Q 60 32 63 38 Q 60 42 65 35 Z" />
        <path d="M 69 45 Q 73 42 71 48 Q 73 52 69 45 Z" />
        <path d="M 66 55 Q 61 58 65 62 Q 69 58 66 55 Z" />
        <path d="M 68 65 Q 63 68 67 72 Q 71 68 68 65 Z" />
      </g>
    </svg>
  )
};

export const ShopDecor: Record<string, React.FC<ShopAssetProps>> = {
  'dec_fruit_basket': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="50" cy="85" rx="35" ry="6" fill="#1E293B" opacity="0.3" />
      <circle cx="35" cy="55" r="15" fill="#EAB308" />
      <path d="M 65 45 C 75 55, 75 75, 60 70 Z" fill="#22C55E" />
      <path d="M 35 60 Q 50 40 65 50 Q 55 65 35 60 Z" fill="#FDE047" />
      <path d="M 30 65 Q 45 45 60 55 Q 50 70 30 65 Z" fill="#FACC15" />
      <circle cx="45" cy="65" r="14" fill="#EF4444" />
      <circle cx="58" cy="62" r="12" fill="#F97316" />
      <path d="M 15 50 C 15 85, 85 85, 85 50 Z" fill="#D97706" />
      <path d="M 15 50 C 15 55, 85 55, 85 50 C 85 45, 15 45, 15 50 Z" fill="#B45309" />
      <path d="M 15 50 C 15 85, 85 85, 85 50 Z" fill="none" stroke="#92400E" strokeWidth="2" />
      <path d="M 25 55 L 75 55 M 30 65 L 70 65 M 35 75 L 65 75" stroke="#92400E" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
    </svg>
  ),
  'dec_mango_basket': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="50" cy="85" rx="35" ry="6" fill="#1E293B" opacity="0.3" />
      <circle cx="35" cy="55" r="14" fill="#F59E0B" />
      <circle cx="65" cy="55" r="14" fill="#F59E0B" />
      <circle cx="50" cy="45" r="15" fill="#EAB308" />
      <g transform="translate(40, 60)">
         <path d="M -10 5 C -20 -5, -10 -20, 0 -15 C 10 -10, 15 5, 5 10 C -5 15, -5 10, -10 5 Z" fill="#F59E0B" />
      </g>
      <g transform="translate(60, 62) scale(-1, 1)">
         <path d="M -10 5 C -20 -5, -10 -20, 0 -15 C 10 -10, 15 5, 5 10 C -5 15, -5 10, -10 5 Z" fill="#FDE047" />
      </g>
      <g transform="translate(50, 50)">
         <path d="M -10 5 C -20 -5, -10 -20, 0 -15 C 10 -10, 15 5, 5 10 C -5 15, -5 10, -10 5 Z" fill="#FACC15" />
         <circle cx="-5" cy="-8" r="4" fill="#FEF08A" opacity="0.6" />
      </g>
      <path d="M 45 35 Q 30 25 35 20 Q 45 25 45 35 Z" fill="#4ADE80" />
      <path d="M 60 40 Q 75 30 70 20 Q 60 25 60 40 Z" fill="#22C55E" />
      <path d="M 15 50 C 15 85, 85 85, 85 50 Z" fill="#B45309" />
      <path d="M 15 50 C 15 55, 85 55, 85 50 C 85 45, 15 45, 15 50 Z" fill="#92400E" />
      <g stroke="#78350F" strokeWidth="2" opacity="0.6">
        <path d="M 25 60 L 75 60 M 30 70 L 70 70" />
        <path d="M 30 50 L 35 80 M 45 50 L 50 82 M 60 50 L 55 82 M 75 50 L 70 80" />
      </g>
    </svg>
  ),
  'dec_butterfly': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="50" cy="90" rx="20" ry="4" fill="#1E293B" opacity="0.3" />
      <path d="M 35 85 C 35 75, 65 75, 65 85 Q 65 92 50 92 Q 35 92 35 85 Z" fill="#94A3B8" />
      <circle cx="50" cy="40" r="30" fill="#C084FC" opacity="0.2" />
      <g transform="translate(50, 45) scale(1.2)">
        <path d="M 0 0 Q -5 -10 -10 -15 M 0 0 Q 5 -10 10 -15" stroke="#F8FAFC" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 0 0 C -20 -20, -30 0, 0 10 Z" fill="#A855F7" />
        <path d="M 0 0 C -15 -15, -20 0, -2 8 Z" fill="#E879F9" opacity="0.8" />
        <path d="M 0 0 C 20 -20, 30 0, 0 10 Z" fill="#A855F7" />
        <path d="M 0 0 C 15 -15, 20 0, 2 8 Z" fill="#E879F9" opacity="0.8" />
        <path d="M -2 8 C -15 20, -5 30, 0 15 Z" fill="#8B5CF6" />
        <path d="M 2 8 C 15 20, 5 30, 0 15 Z" fill="#8B5CF6" />
        <ellipse cx="0" cy="5" rx="2" ry="7" fill="#1E293B" />
      </g>
      <circle cx="25" cy="25" r="2" fill="#E879F9" />
      <circle cx="70" cy="20" r="2.5" fill="#E879F9" />
      <circle cx="75" cy="65" r="1.5" fill="#E879F9" />
    </svg>
  ),
  'dec_bird': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="50" cy="90" rx="15" ry="4" fill="#1E293B" opacity="0.3" />
      <rect x="42" y="60" width="16" height="30" fill="#78350F" />
      <rect x="42" y="60" width="8" height="30" fill="#92400E" />
      <ellipse cx="50" cy="60" rx="8" ry="3" fill="#D97706" />
      <g transform="translate(50, 45)">
        <path d="M 10 5 L 30 25 L 25 30 L -5 10 Z" fill="#1E293B" />
        <path d="M 12 8 L 28 20 L 25 24 L 2 12 Z" fill="#F8FAFC" />
        <ellipse cx="0" cy="0" rx="15" ry="12" fill="#1E293B" transform="rotate(-30)" />
        <path d="M -15 0 C -15 15, 5 15, 10 5 C -5 5, -10 0, -15 0 Z" fill="#F8FAFC" />
        <path d="M -5 -5 C 10 -10, 15 5, 5 10 C 0 0, -5 -5, -5 -5 Z" fill="#0F172A" />
        <path d="M 0 0 L 10 5" stroke="#F8FAFC" strokeWidth="2" strokeLinecap="round" />
        <circle cx="-12" cy="-12" r="10" fill="#1E293B" />
        <circle cx="-15" cy="-14" r="1.5" fill="#F8FAFC" />
        <path d="M -22 -12 L -28 -10 L -21 -8 Z" fill="#FACC15" />
        <path d="M -5 10 L -5 18 M 2 8 L 5 16" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M -8 18 L -3 18 M 2 16 L 7 16" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  ),
  'dec_small_pond': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="50" cy="65" rx="45" ry="20" fill="#38BDF8" />
      <ellipse cx="50" cy="65" rx="42" ry="18" fill="#0EA5E9" />
      <ellipse cx="50" cy="65" rx="30" ry="12" stroke="#BAE6FD" strokeWidth="2" opacity="0.5" />
      <ellipse cx="50" cy="65" rx="20" ry="8" stroke="#BAE6FD" strokeWidth="2" opacity="0.5" />
      <path d="M 25 60 A 8 4 0 1 1 35 60 A 8 4 0 1 1 25 60 Z" fill="#4ADE80" transform="rotate(-15 30 60)" />
      <path d="M 30 60 L 35 58 L 36 62 Z" fill="#0EA5E9" transform="rotate(-15 30 60)" />
      <path d="M 65 75 A 10 5 0 1 1 78 75 A 10 5 0 1 1 65 75 Z" fill="#22C55E" transform="rotate(20 71 75)" />
      <path d="M 71 75 L 78 73 L 79 77 Z" fill="#0EA5E9" transform="rotate(20 71 75)" />
      <g transform="translate(71, 73) scale(0.6)">
        <path d="M 0 0 C -10 -15, 0 -25, 0 -25 C 0 -25, 10 -15, 0 0 Z" fill="#F472B6" />
        <path d="M 0 0 C -15 -5, -20 -15, -20 -15 C -20 -15, -10 -20, 0 0 Z" fill="#F9A8D4" />
        <path d="M 0 0 C 15 -5, 20 -15, 20 -15 C 20 -15, 10 -20, 0 0 Z" fill="#F9A8D4" />
        <circle cx="0" cy="-2" r="3" fill="#FBBF24" />
      </g>
      <ellipse cx="15" cy="55" rx="8" ry="5" fill="#94A3B8" />
      <ellipse cx="25" cy="50" rx="6" ry="4" fill="#64748B" />
      <ellipse cx="85" cy="65" rx="10" ry="6" fill="#94A3B8" />
      <ellipse cx="88" cy="55" rx="7" ry="5" fill="#CBD5E1" />
    </svg>
  ),
  'dec_clay_lamp': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="50" cy="45" r="30" fill="#FDE047" opacity="0.3" />
      <circle cx="50" cy="45" r="15" fill="#FACC15" opacity="0.5" />
      <ellipse cx="50" cy="85" rx="20" ry="4" fill="#1E293B" opacity="0.3" />
      <path d="M 40 82 L 45 65 L 55 65 L 60 82 Z" fill="#92400E" />
      <path d="M 35 82 C 35 88, 65 88, 65 82 C 65 78, 35 78, 35 82 Z" fill="#78350F" />
      <path d="M 15 55 C 15 75, 85 75, 85 55 Z" fill="#B45309" />
      <ellipse cx="50" cy="55" rx="35" ry="6" fill="#D97706" />
      <ellipse cx="50" cy="55" rx="32" ry="4" fill="#92400E" />
      <path d="M 45 60 L 55 60 L 50 45 Z" fill="#78350F" opacity="0.7" />
      <path d="M 50 25 C 40 40, 45 45, 50 48 C 55 45, 60 40, 50 25 Z" fill="#F59E0B" />
      <path d="M 50 30 C 45 40, 48 43, 50 45 C 52 43, 55 40, 50 30 Z" fill="#FEF08A" />
    </svg>
  ),
  'dec_rickshaw_sign': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="50" cy="90" rx="30" ry="4" fill="#1E293B" opacity="0.3" />
      <path d="M 45 80 L 55 80 L 60 90 L 40 90 Z" fill="#475569" />
      <rect x="48" y="70" width="4" height="15" fill="#94A3B8" />
      <rect x="15" y="20" width="70" height="50" rx="5" fill="#3B82F6" stroke="#FACC15" strokeWidth="4" />
      <circle cx="20" cy="25" r="3" fill="#EF4444" />
      <circle cx="80" cy="25" r="3" fill="#EF4444" />
      <circle cx="20" cy="65" r="3" fill="#EF4444" />
      <circle cx="80" cy="65" r="3" fill="#EF4444" />
      <g transform="translate(50, 45)">
        <path d="M 0 0 C -15 -15, 0 -30, 0 -30 C 0 -30, 15 -15, 0 0 Z" fill="#EF4444" />
        <path d="M 0 0 C 15 -15, 30 0, 30 0 C 30 0, 15 15, 0 0 Z" fill="#EF4444" />
        <path d="M 0 0 C -15 15, 0 30, 0 30 C 0 30, 15 15, 0 0 Z" fill="#EF4444" />
        <path d="M 0 0 C -15 -15, -30 0, -30 0 C -30 0, -15 15, 0 0 Z" fill="#EF4444" />
        <circle cx="0" cy="0" r="8" fill="#FACC15" />
        <path d="M 10 10 L 20 20 A 10 10 0 0 0 10 10" fill="#4ADE80" />
        <path d="M -10 -10 L -20 -20 A 10 10 0 0 0 -10 -10" fill="#4ADE80" />
        <path d="M -10 10 L -20 20 A 10 10 0 0 1 -10 10" fill="#4ADE80" />
        <path d="M 10 -10 L 20 -20 A 10 10 0 0 1 10 -10" fill="#4ADE80" />
      </g>
    </svg>
  ),
  'dec_kolshi': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="kolshiGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="30%" stopColor="#FDE047" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="85" rx="25" ry="5" fill="#1E293B" opacity="0.3" />
      <circle cx="50" cy="60" r="25" fill="url(#kolshiGrad)" />
      <path d="M 40 30 L 35 45 C 45 40, 55 40, 65 45 L 60 30 Z" fill="url(#kolshiGrad)" />
      <ellipse cx="50" cy="28" rx="15" ry="4" fill="#D97706" />
      <ellipse cx="50" cy="28" rx="12" ry="2" fill="#F59E0B" />
      <ellipse cx="50" cy="48" rx="20" ry="5" stroke="#92400E" strokeWidth="1.5" fill="none" opacity="0.5" />
      <ellipse cx="50" cy="55" rx="24" ry="6" stroke="#92400E" strokeWidth="1.5" fill="none" opacity="0.5" />
      <ellipse cx="50" cy="70" rx="22" ry="5" stroke="#92400E" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M 30 60 C 30 70, 40 80, 50 82" stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
    </svg>
  ),
  'dec_nakshi_kantha': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="50" cy="85" rx="40" ry="6" fill="#1E293B" opacity="0.3" />
      <path d="M 15 65 L 85 65 L 75 80 L 25 80 Z" fill="#EF4444" />
      <path d="M 10 55 L 90 55 L 85 65 L 15 65 Z" fill="#DC2626" />
      <path d="M 30 35 L 70 35 L 90 55 L 10 55 Z" fill="#F87171" />
      <g stroke="#FEF08A" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.8">
        <path d="M 20 58 L 80 58" />
        <path d="M 28 62 L 72 62" />
        <path d="M 32 38 L 82 38" />
        <path d="M 30 46 L 86 46" />
        <path d="M 20 68 L 80 68" />
        <path d="M 24 75 L 76 75" />
      </g>
      <g transform="translate(50, 45) scale(1, -0.5) rotate(45)">
        <path d="M 0 0 C -10 -10, 0 -20, 0 -20 C 0 -20, 10 -10, 0 0 Z" fill="#FACC15" />
        <path d="M 0 0 C 10 -10, 20 0, 20 0 C 20 0, 10 10, 0 0 Z" fill="#FACC15" />
        <path d="M 0 0 C -10 10, 0 20, 0 20 C 0 20, 10 10, 0 0 Z" fill="#FACC15" />
        <path d="M 0 0 C -10 -10, -20 0, -20 0 C -20 0, -10 10, 0 0 Z" fill="#FACC15" />
        <circle cx="0" cy="0" r="3" fill="#B45309" />
      </g>
      <g transform="translate(25, 50) scale(0.6, -0.3) rotate(45)">
         <path d="M 0 0 C -10 -10, 0 -20, 0 -20 C 0 -20, 10 -10, 0 0 Z" fill="#FACC15" />
         <path d="M 0 0 C 10 -10, 20 0, 20 0 C 20 0, 10 10, 0 0 Z" fill="#FACC15" />
      </g>
      <g transform="translate(75, 50) scale(0.6, -0.3) rotate(45)">
         <path d="M 0 0 C -10 -10, 0 -20, 0 -20 C 0 -20, 10 -10, 0 0 Z" fill="#FACC15" />
         <path d="M 0 0 C 10 -10, 20 0, 20 0 C 20 0, 10 10, 0 0 Z" fill="#FACC15" />
      </g>
    </svg>
  ),
  'dec_golden_rickshaw': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="goldRickshaw" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="40%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="85" rx="35" ry="6" fill="#1E293B" opacity="0.3" />
      <path d="M 15 85 C 15 90, 85 90, 85 85 L 80 75 C 80 70, 20 70, 20 75 Z" fill="#1E293B" />
      <ellipse cx="50" cy="75" rx="30" ry="5" fill="#334155" />
      <ellipse cx="50" cy="75" rx="25" ry="3" fill="#475569" />
      <circle cx="35" cy="60" r="12" fill="none" stroke="url(#goldRickshaw)" strokeWidth="1.5" />
      <circle cx="65" cy="60" r="12" fill="none" stroke="url(#goldRickshaw)" strokeWidth="1.5" />
      <circle cx="50" cy="65" r="8" fill="none" stroke="url(#goldRickshaw)" strokeWidth="1" />
      <g stroke="url(#goldRickshaw)" strokeWidth="0.5">
         <path d="M 35 48 L 35 72 M 23 60 L 47 60 M 27 52 L 43 68 M 27 68 L 43 52" />
         <path d="M 65 48 L 65 72 M 53 60 L 77 60 M 57 52 L 73 68 M 57 68 L 73 52" />
      </g>
      <path d="M 25 45 L 75 45 L 70 55 L 30 55 Z" fill="url(#goldRickshaw)" />
      <path d="M 25 45 C 25 15, 75 15, 75 45 Z" fill="url(#goldRickshaw)" opacity="0.9" />
      <path d="M 30 42 C 30 20, 70 20, 70 42 Z" fill="#475569" />
      <rect x="35" y="30" width="30" height="20" rx="3" fill="url(#goldRickshaw)" />
      <path d="M 50 65 L 50 50 L 85 50" fill="none" stroke="url(#goldRickshaw)" strokeWidth="2" />
      <path d="M 85 50 L 80 40 L 90 40" fill="none" stroke="url(#goldRickshaw)" strokeWidth="1.5" />
      <path d="M 10 30 L 12 25 L 14 30 L 19 32 L 14 34 L 12 39 L 10 34 L 5 32 Z" fill="#FEF08A" />
      <path d="M 85 20 L 86 16 L 87 20 L 91 21 L 87 22 L 86 26 L 85 22 L 81 21 Z" fill="#FEF08A" />
      <path d="M 50 10 L 51 8 L 52 10 L 54 11 L 52 12 L 51 14 L 50 12 L 48 11 Z" fill="#FEF08A" />
    </svg>
  ),
  'seasonal_boishakh': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="50" cy="90" rx="25" ry="4" fill="#1E293B" opacity="0.3" />
      <circle cx="50" cy="70" r="15" fill="#D97706" />
      <circle cx="50" cy="70" r="10" fill="#FEF3C7" opacity="0.2" />
      <path d="M 45 60 L 45 20 C 45 15, 55 15, 55 20 L 55 60" fill="#F59E0B" />
      <path d="M 48 10 L 52 10 L 52 15 L 48 15 Z" fill="#B45309" />
      <rect x="55" y="25" width="10" height="3" rx="1.5" fill="#92400E" />
      <line x1="50" y1="20" x2="50" y2="70" stroke="#F8FAFC" strokeWidth="1" />
      <path d="M 40 80 Q 50 85 60 80" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
      <path d="M 38 75 Q 50 80 62 75" stroke="#F8FAFC" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  'seasonal_eid_lights': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="50" cy="50" r="40" fill="#1E293B" opacity="0.8" />
      <circle cx="50" cy="50" r="38" fill="#0F172A" />
      <path d="M 45 20 A 25 25 0 1 0 75 50 A 20 20 0 1 1 45 20 Z" fill="#FEF08A" />
      <line x1="30" y1="15" x2="30" y2="35" stroke="#94A3B8" strokeWidth="1" />
      <path d="M 25 35 L 35 35 L 32 45 L 28 45 Z" fill="#FCD34D" />
      <path d="M 28 45 L 32 45 L 30 50 Z" fill="#F59E0B" />
      <line x1="70" y1="15" x2="70" y2="25" stroke="#94A3B8" strokeWidth="1" />
      <path d="M 70 25 L 72 30 L 77 30 L 73 34 L 75 39 L 70 36 L 65 39 L 67 34 L 63 30 L 68 30 Z" fill="#FEF08A" />
      <circle cx="55" cy="70" r="1" fill="#FFFFFF" />
      <circle cx="35" cy="65" r="1.5" fill="#FFFFFF" />
      <circle cx="80" cy="55" r="1.5" fill="#FFFFFF" />
    </svg>
  ),
  'seasonal_ramadan_lantern': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="50" cy="85" rx="20" ry="4" fill="#1E293B" opacity="0.3" />
      <circle cx="50" cy="50" r="30" fill="#FCD34D" opacity="0.3" />
      <path d="M 45 25 L 55 25 L 50 15 Z" fill="#B45309" />
      <rect x="48" y="10" width="4" height="5" fill="#D97706" />
      <circle cx="50" cy="8" r="3" fill="none" stroke="#B45309" strokeWidth="2" />
      <path d="M 35 35 L 65 35 L 55 25 L 45 25 Z" fill="#D97706" />
      <path d="M 35 35 L 65 35 L 60 65 L 40 65 Z" fill="#FEF08A" opacity="0.9" />
      <path d="M 47 40 L 53 40 L 51 60 L 49 60 Z" fill="#FFFFFF" opacity="0.5" />
      <line x1="40" y1="65" x2="35" y2="35" stroke="#92400E" strokeWidth="2" />
      <line x1="60" y1="65" x2="65" y2="35" stroke="#92400E" strokeWidth="2" />
      <line x1="50" y1="65" x2="50" y2="35" stroke="#92400E" strokeWidth="2" />
      <path d="M 40 65 L 60 65 L 55 75 L 45 75 Z" fill="#D97706" />
      <path d="M 42 75 L 58 75 L 60 80 L 40 80 Z" fill="#B45309" />
    </svg>
  ),
  'seasonal_rain_cloud': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="50" cy="90" rx="30" ry="5" fill="#1E293B" opacity="0.3" />
      <circle cx="35" cy="45" r="20" fill="#94A3B8" />
      <circle cx="65" cy="50" r="18" fill="#94A3B8" />
      <circle cx="50" cy="35" r="25" fill="#CBD5E1" />
      <path d="M 25 55 L 75 55 A 10 10 0 0 0 75 35 L 25 35 A 10 10 0 0 0 25 55 Z" fill="#94A3B8" />
      <path d="M 25 50 L 75 50 A 10 10 0 0 0 75 30 L 25 30 A 10 10 0 0 0 25 50 Z" fill="#CBD5E1" />
      <path d="M 35 65 L 35 75" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
      <path d="M 50 60 L 50 80" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
      <path d="M 65 65 L 65 75" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
      <path d="M 45 55 L 35 70 L 42 70 L 38 85 L 55 65 L 45 65 Z" fill="#FACC15" />
    </svg>
  ),
  'seasonal_winter_sun': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="50" cy="85" rx="30" ry="5" fill="#1E293B" opacity="0.3" />
      <path d="M 40 85 C 40 50, 45 20, 45 20 C 50 20, 55 50, 60 85 Z" fill="#78350F" />
      <path d="M 46 45 L 50 55 L 56 45" stroke="#92400E" strokeWidth="2" fill="#FDE047" opacity="0.7" />
      <path d="M 50 55 L 50 65" stroke="#D97706" strokeWidth="1.5" strokeDasharray="2,2" />
      <path d="M 45 65 C 40 65, 40 80, 50 80 C 60 80, 60 65, 55 65 Z" fill="#B45309" />
      <ellipse cx="50" cy="65" rx="5" ry="1.5" fill="#78350F" />
      <path d="M 43 55 L 45 65" stroke="#FEF08A" strokeWidth="1" />
      <path d="M 57 55 L 55 65" stroke="#FEF08A" strokeWidth="1" />
      <path d="M 45 20 Q 25 10 20 25" fill="none" stroke="#65A30D" strokeWidth="3" strokeLinecap="round" />
      <path d="M 50 20 Q 50 0 45 -5" fill="none" stroke="#65A30D" strokeWidth="3" strokeLinecap="round" />
      <path d="M 50 20 Q 75 10 80 25" fill="none" stroke="#65A30D" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="50" cy="75" rx="35" ry="10" fill="#F8FAFC" opacity="0.4" />
      <ellipse cx="50" cy="85" rx="45" ry="15" fill="#F8FAFC" opacity="0.5" />
    </svg>
  )
};

export const ShopBackgrounds: Record<string, React.FC<ShopAssetProps>> = {
  'bg_default': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="100" height="100" rx="10" fill="#38BDF8" />
      <path d="M 0 60 Q 25 40 50 60 Q 75 80 100 60 L 100 100 L 0 100 Z" fill="#4ADE80" />
      <path d="M 0 70 Q 30 50 70 75 Q 85 85 100 70 L 100 100 L 0 100 Z" fill="#22C55E" />
      <circle cx="80" cy="20" r="12" fill="#FEF08A" />
    </svg>
  ),
  'bg_rooftop': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="100" height="100" rx="10" fill="#7DD3FC" />
      <rect x="10" y="40" width="15" height="40" fill="#94A3B8" />
      <rect x="30" y="30" width="20" height="50" fill="#64748B" />
      <rect x="55" y="50" width="15" height="30" fill="#94A3B8" />
      <rect x="75" y="25" width="15" height="55" fill="#CBD5E1" />
      <path d="M 0 80 L 100 80 L 100 100 L 0 100 Z" fill="#475569" />
      <path d="M 0 80 L 100 80 L 100 85 L 0 85 Z" fill="#334155" />
    </svg>
  ),
  'bg_village': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="100" height="100" rx="10" fill="#7DD3FC" />
      <path d="M 0 60 C 15 45, 35 45, 50 60 C 65 45, 85 45, 100 60 L 100 100 L 0 100 Z" fill="#16A34A" />
      <rect x="60" y="55" width="25" height="20" fill="#D97706" />
      <path d="M 55 55 L 72.5 40 L 90 55 Z" fill="#92400E" />
      <path d="M 0 70 Q 25 60 50 70 Q 75 80 100 70 L 100 100 L 0 100 Z" fill="#84CC16" />
      <path d="M 0 85 Q 50 70 100 85 L 100 100 L 0 100 Z" fill="#65A30D" />
    </svg>
  ),
  'bg_morning_sun': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="morningSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDBA74" />
          <stop offset="50%" stopColor="#FCA5A5" />
          <stop offset="100%" stopColor="#FBCFE8" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="10" fill="url(#morningSky)" />
      <circle cx="50" cy="50" r="25" fill="#FEF08A" />
      <path d="M 0 70 Q 30 50 70 75 Q 85 85 100 70 L 100 100 L 0 100 Z" fill="#9D174D" />
      <path d="M 0 85 Q 50 75 100 90 L 100 100 L 0 100 Z" fill="#831843" />
    </svg>
  ),
  'bg_monsoon': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="100" height="100" rx="10" fill="#1E293B" />
      <circle cx="20" cy="20" r="15" fill="#334155" />
      <circle cx="50" cy="15" r="20" fill="#475569" />
      <circle cx="80" cy="25" r="18" fill="#334155" />
      <g stroke="#94A3B8" strokeWidth="1" opacity="0.4">
         <path d="M 20 40 L 10 70 M 40 30 L 30 80 M 60 40 L 50 90 M 80 50 L 70 85 M 95 30 L 85 65" />
      </g>
      <path d="M 0 80 Q 25 70 50 80 Q 75 90 100 80 L 100 100 L 0 100 Z" fill="#064E3B" />
      <path d="M 0 90 Q 50 80 100 90 L 100 100 L 0 100 Z" fill="#065F46" />
    </svg>
  ),
  'bg_zamindar_palace': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="100" height="100" rx="10" fill="#FDE68A" />
      <rect x="15" y="30" width="70" height="70" fill="#D97706" />
      <path d="M 25 100 L 25 60 A 25 25 0 0 1 75 60 L 75 100 Z" fill="#78350F" />
      <rect x="25" y="60" width="5" height="40" fill="#B45309" />
      <rect x="70" y="60" width="5" height="40" fill="#B45309" />
      <circle cx="50" cy="30" r="15" fill="#F59E0B" />
      <circle cx="50" cy="15" r="5" fill="#B45309" />
      <circle cx="30" cy="40" r="10" fill="#F59E0B" />
      <circle cx="70" cy="40" r="10" fill="#F59E0B" />
    </svg>
  )
};

const getNewSvg = (itemId: string) => {
  if (ShopBoosts[itemId]) return ShopBoosts[itemId];
  if (ShopPots[itemId]) return ShopPots[itemId];
  if (ShopFences[itemId]) return ShopFences[itemId];
  if (ShopDecor[itemId]) return ShopDecor[itemId];
  if (ShopBackgrounds[itemId]) return ShopBackgrounds[itemId];
  return null;
}

export const ShopItemSvg = ({ itemId, className }: { itemId: string; className?: string }) => {
  const NewSvgComponent = getNewSvg(itemId);

  if (NewSvgComponent) {
    return (
      <div className={className + " flex items-center justify-center p-2"}>
         <div className="w-16 h-16 rounded-xl bg-slate-800/50 border border-surface-alt flex items-center justify-center text-slate-400 mx-auto">
            <NewSvgComponent className="w-10 h-10" />
         </div>
      </div>
    );
  }

  const TinyFace = ({ color = "#1F2937" }) => (
    <>
      <circle cx="28" cy="34" r="2.5" fill={color} />
      <circle cx="36" cy="34" r="2.5" fill={color} />
      <path d="M31 38 Q32 40 33 38" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </>
  );

  const renderShape = () => {
    switch (itemId) {
      // --- BACKGROUNDS ---
      case 'bg_default':
        return (
          <>
            <rect x="8" y="16" width="48" height="32" rx="4" fill="#86EFAC" stroke="#166534" strokeWidth="3" />
            <path d="M 16 32 C 24 24, 40 24, 48 32 C 40 40, 24 40, 16 32 Z" fill="#22C55E" opacity="0.3" />
            <circle cx="20" cy="24" r="2" fill="#166534" opacity="0.5" />
            <circle cx="44" cy="40" r="2" fill="#166534" opacity="0.5" />
          </>
        );
      case 'bg_rooftop':
        return (
          <>
            <rect x="12" y="24" width="40" height="28" rx="2" fill="#CBD5E1" stroke="#334155" strokeWidth="3" />
            <path d="M 12 24 L 20 12 L 44 12 L 52 24 Z" fill="#94A3B8" stroke="#334155" strokeWidth="3" strokeLinejoin="round" />
            <rect x="24" y="32" width="16" height="20" fill="#64748B" />
          </>
        );
      case 'bg_village':
        return (
          <>
            <path d="M 8 40 L 32 16 L 56 40 L 48 40 L 48 56 L 16 56 L 16 40 Z" fill="#FEF08A" stroke="#854D0E" strokeWidth="3" strokeLinejoin="round" />
            <path d="M 28 44 L 28 56 M 36 44 L 36 56" fill="none" stroke="#854D0E" strokeWidth="3" />
            <circle cx="16" cy="24" r="6" fill="#4ADE80" opacity="0.8" />
          </>
        );
      case 'bg_morning_sun':
        return (
          <>
            <rect x="8" y="16" width="48" height="32" rx="4" fill="#FDE047" stroke="#CA8A04" strokeWidth="3" />
            <circle cx="32" cy="32" r="10" fill="#F97316" />
            <path d="M 32 14 L 32 8 M 32 50 L 32 56 M 14 32 L 8 32 M 50 32 L 56 32 M 18 18 L 12 12 M 46 46 L 52 52 M 46 18 L 52 12 M 18 46 L 12 52" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
          </>
        );
      case 'bg_monsoon':
        return (
          <>
            <rect x="8" y="16" width="48" height="32" rx="4" fill="#93C5FD" stroke="#1E3A8A" strokeWidth="3" />
            <path d="M 24 24 Q 32 16 40 24 M 20 32 Q 28 24 36 32 M 28 40 Q 36 32 44 40" fill="none" stroke="#1E40AF" strokeWidth="2.5" strokeLinecap="round" />
          </>
        );

      // --- POTS ---
      case 'pot_bamboo_basket':
        return (
          <>
            <path d="M 18 20 L 22 56 L 42 56 L 46 20 Z" fill="#FDE047" stroke="#A16207" strokeWidth="3" strokeLinejoin="round" />
            <ellipse cx="32" cy="20" rx="14" ry="4" fill="#CA8A04" stroke="#A16207" strokeWidth="3" />
            <path d="M 20 28 L 44 28 M 21 36 L 43 36 M 21 44 L 43 44 M 22 52 L 42 52" fill="none" stroke="#A16207" strokeWidth="2" strokeLinecap="round" />
            <path d="M 28 20 L 28 56 M 36 20 L 36 56" fill="none" stroke="#A16207" strokeWidth="2" strokeLinecap="round" />
          </>
        );
      case 'pot_rooftop_tub':
        return (
          <>
            <path d="M 12 24 L 16 56 L 48 56 L 52 24 Z" fill="#94A3B8" stroke="#334155" strokeWidth="3" strokeLinejoin="round" />
            <ellipse cx="32" cy="24" rx="20" ry="6" fill="#64748B" stroke="#334155" strokeWidth="3" />
            <path d="M 14 36 L 50 36 M 15 46 L 49 46" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            <g transform="translate(0, 0)"><TinyFace color="#334155" /></g>
          </>
        );

      // --- FENCES ---
      case 'fence_bamboo':
        return (
          <>
            <rect x="16" y="16" width="6" height="40" rx="2" fill="#FDE047" stroke="#A16207" strokeWidth="2.5" />
            <rect x="28" y="12" width="8" height="44" rx="3" fill="#FDE047" stroke="#A16207" strokeWidth="2.5" />
            <rect x="42" y="16" width="6" height="40" rx="2" fill="#FDE047" stroke="#A16207" strokeWidth="2.5" />
            <path d="M 12 30 L 52 30 M 12 44 L 52 44" fill="none" stroke="#A16207" strokeWidth="2.5" strokeLinecap="round" />
          </>
        );
      case 'fence_wooden':
        return (
          <>
            <path d="M 16 16 L 22 10 L 28 16 L 28 56 L 16 56 Z" fill="#D97706" stroke="#78350F" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M 36 16 L 42 10 L 48 16 L 48 56 L 36 56 Z" fill="#D97706" stroke="#78350F" strokeWidth="2.5" strokeLinejoin="round" />
            <rect x="12" y="28" width="40" height="8" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />
            <rect x="12" y="44" width="40" height="8" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />
          </>
        );
      case 'fence_clay_wall':
        return (
          <>
            <path d="M 8 36 C 16 32, 24 32, 32 36 C 40 40, 48 40, 56 36 L 56 56 L 8 56 Z" fill="#9A3412" stroke="#451A03" strokeWidth="3" strokeLinejoin="round" />
            <path d="M 8 36 L 8 44 C 16 40, 24 40, 32 44 C 40 48, 48 48, 56 44" fill="none" stroke="#EA580C" strokeWidth="2" opacity="0.3" />
          </>
        );

      // --- DECORATIONS ---
      case 'dec_fruit_basket':
        return (
          <>
            <path d="M 16 32 C 16 32, 24 56, 32 56 C 40 56, 48 32, 48 32 Z" fill="#FBBF24" stroke="#92400E" strokeWidth="3" strokeLinejoin="round" />
            <ellipse cx="32" cy="32" rx="16" ry="6" fill="#D97706" stroke="#92400E" strokeWidth="3" />
            <circle cx="28" cy="24" r="6" fill="#EF4444" stroke="#7F1D1D" strokeWidth="2.5" />
            <circle cx="36" cy="26" r="5" fill="#A3E635" stroke="#3F6212" strokeWidth="2.5" />
            <circle cx="22" cy="28" r="5" fill="#FDE047" stroke="#A16207" strokeWidth="2.5" />
            <path d="M 24 16 C 32 8, 40 8, 40 16" fill="none" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
          </>
        );
      case 'dec_mango_basket':
        return (
          <>
            <path d="M 14 36 C 14 36, 20 56, 32 56 C 44 56, 50 36, 50 36 Z" fill="#DEB887" stroke="#8B4513" strokeWidth="3" strokeLinejoin="round" />
            <ellipse cx="32" cy="36" rx="18" ry="6" fill="#B8860B" stroke="#8B4513" strokeWidth="3" />
            <path d="M 28 20 C 36 12, 44 20, 38 32 C 34 38, 24 38, 22 30 C 20 24, 24 20, 28 20 Z" fill="#FFD700" stroke="#DAA520" strokeWidth="2" />
            <path d="M 16 28 C 24 20, 32 28, 26 40 C 22 46, 12 46, 10 38 C 8 32, 12 28, 16 28 Z" fill="#FF8C00" stroke="#FF4500" strokeWidth="2" />
            <path d="M 40 24 C 48 16, 56 24, 50 36 C 46 42, 36 42, 34 34 C 32 28, 36 24, 40 24 Z" fill="#FFD700" stroke="#DAA520" strokeWidth="2" />
          </>
        );
      case 'dec_butterfly':
        return (
          <>
            <path d="M 32 24 C 20 12, 12 24, 24 32 C 12 40, 20 52, 32 40 C 44 52, 52 40, 40 32 C 52 24, 44 12, 32 24 Z" fill="#A78BFA" stroke="#4C1D95" strokeWidth="3" strokeLinejoin="round" />
            <path d="M 32 16 L 32 48" stroke="#4C1D95" strokeWidth="3" strokeLinecap="round" />
            <circle cx="24" cy="24" r="3" fill="#FDF4FF" />
            <circle cx="40" cy="24" r="3" fill="#FDF4FF" />
          </>
        );
      case 'dec_bird':
        return (
          <>
            <path d="M 20 32 C 20 20, 36 16, 44 24 L 52 20 L 48 28 C 50 36, 40 48, 28 44 C 16 40, 16 36, 20 32 Z" fill="#60A5FA" stroke="#1E3A8A" strokeWidth="3" strokeLinejoin="round" />
            <path d="M 24 28 C 30 28, 34 36, 40 36 C 40 36, 36 44, 28 40" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="2" />
            <circle cx="36" cy="24" r="2" fill="#1E3A8A" />
            <path d="M 44 22 L 50 24 L 46 26" fill="#FBBF24" stroke="#B45309" strokeWidth="2" strokeLinejoin="round" />
          </>
        );
      case 'dec_small_pond':
        return (
          <>
            <ellipse cx="32" cy="40" rx="24" ry="12" fill="#38BDF8" stroke="#0284C7" strokeWidth="3" />
            <path d="M 16 36 C 24 32, 28 40, 36 36" fill="none" stroke="#BAE6FD" strokeWidth="2" strokeLinecap="round" />
            {/* Lily pad */}
            <path d="M 40 38 A 6 3 0 1 1 50 42 A 6 3 0 0 1 40 38" fill="#4ADE80" stroke="#166534" strokeWidth="2" strokeLinejoin="round" />
          </>
        );
      case 'dec_clay_lamp':
        return (
          <>
            {/* Base */}
            <path d="M 20 44 L 44 44 L 38 52 L 26 52 Z" fill="#9A3412" stroke="#451A03" strokeWidth="3" strokeLinejoin="round" />
            {/* Top bowl */}
            <path d="M 12 36 C 12 36, 24 48, 32 48 C 40 48, 52 36, 52 36 C 36 42, 28 42, 12 36 Z" fill="#C2410C" stroke="#451A03" strokeWidth="3" strokeLinejoin="round" />
            {/* Flame */}
            <path d="M 32 36 C 28 28, 28 20, 32 12 C 36 20, 36 28, 32 36 Z" fill="#FDE047" stroke="#CA8A04" strokeWidth="2.5" strokeLinejoin="round" />
            <circle cx="32" cy="28" r="3" fill="#F97316" />
          </>
        );
      case 'dec_rickshaw_sign':
        return (
          <>
            <rect x="12" y="16" width="40" height="24" fill="#F43F5E" stroke="#881337" strokeWidth="3" />
            <path d="M 12 16 L 24 28 M 52 16 L 40 28" stroke="#FCD34D" strokeWidth="2" />
            <circle cx="32" cy="28" r="6" fill="#34D399" stroke="#064E3B" strokeWidth="2" />
            <path d="M 20 40 L 20 56 M 44 40 L 44 56" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
          </>
        );
      case 'dec_kolshi':
        return (
          <>
            <circle cx="32" cy="36" r="16" fill="#B45309" stroke="#78350F" strokeWidth="3" />
            <path d="M 26 12 L 38 12 L 36 22 L 28 22 Z" fill="#D97706" stroke="#78350F" strokeWidth="3" strokeLinejoin="round" />
            <path d="M 26 12 C 26 8, 38 8, 38 12 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="3" strokeLinejoin="round" />
            <path d="M 20 36 C 20 44, 44 44, 44 36" fill="none" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
          </>
        );

      // --- SEASONAL ---
      case 'seasonal_boishakh':
        return (
          <>
            <path d="M 12 20 L 52 20 M 12 24 L 52 24" stroke="#DC2626" strokeWidth="3" />
            <path d="M 16 24 L 24 50 L 32 24 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M 32 24 L 40 50 L 48 24 Z" fill="#FFFFFF" stroke="#991B1B" strokeWidth="2.5" strokeLinejoin="round" />
          </>
        );
      case 'seasonal_eid_lights':
        return (
          <>
            <path d="M 8 24 Q 24 36 40 24 Q 48 16 56 24" fill="none" stroke="#64748B" strokeWidth="2" />
            <circle cx="20" cy="30" r="4" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
            <circle cx="32" cy="34" r="4" fill="#60A5FA" stroke="#2563EB" strokeWidth="2" />
            <circle cx="44" cy="26" r="4" fill="#F43F5E" stroke="#E11D48" strokeWidth="2" />
            <path d="M 20 20 L 20 26 M 32 28 L 32 30 M 44 20 L 44 22" stroke="#64748B" strokeWidth="2" />
          </>
        );
      case 'seasonal_ramadan_lantern':
        return (
          <>
            <path d="M 24 24 L 40 24 L 36 40 L 28 40 Z" fill="#FDE047" stroke="#A16207" strokeWidth="3" strokeLinejoin="round" />
            <path d="M 28 16 L 36 16 L 40 24 L 24 24 Z" fill="#FCD34D" stroke="#A16207" strokeWidth="3" strokeLinejoin="round" />
            <path d="M 32 8 L 32 16" stroke="#A16207" strokeWidth="3" strokeLinecap="round" />
            <circle cx="32" cy="6" r="3" fill="none" stroke="#A16207" strokeWidth="2" />
            <path d="M 26 40 L 38 40 L 36 46 L 28 46 Z" fill="#CA8A04" stroke="#A16207" strokeWidth="3" strokeLinejoin="round" />
            <path d="M 32 28 C 30 28, 30 36, 32 36 C 36 36, 36 28, 32 28 Z" fill="#FEF08A" />
          </>
        );
      case 'seasonal_rain_cloud':
        return (
          <>
            <path d="M 20 32 C 16 32, 12 28, 12 24 C 12 20, 16 16, 20 16 C 24 10, 36 10, 40 16 C 48 16, 52 24, 48 32 C 46 36, 24 36, 20 32 Z" fill="#93C5FD" stroke="#3B82F6" strokeWidth="3" strokeLinejoin="round" />
            <path d="M 20 40 L 16 48 M 32 40 L 28 48 M 44 40 L 40 48" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
          </>
        );
      case 'seasonal_winter_sun':
        return (
          <>
            <circle cx="32" cy="32" r="14" fill="#FDE047" stroke="#CA8A04" strokeWidth="3" />
            <g stroke="#CA8A04" strokeWidth="3" strokeLinecap="round">
               <path d="M 32 10 L 32 4 M 32 60 L 32 54 M 10 32 L 4 32 M 60 32 L 54 32" />
               <path d="M 16 16 L 12 12 M 48 48 L 52 52 M 48 16 L 52 12 M 16 48 L 12 52" />
            </g>
            <circle cx="28" cy="28" r="2" fill="#A16207" />
            <circle cx="36" cy="28" r="2" fill="#A16207" />
            <path d="M 28 36 Q 32 40 36 36" fill="none" stroke="#A16207" strokeWidth="2.5" strokeLinecap="round" />
          </>
        );

      case 'boost_recovery_water':
        return (
          <>
            <rect x="24" y="24" width="16" height="28" rx="4" fill="#60A5FA" stroke="#1E3A8A" strokeWidth="3" />
            <path d="M 28 36 L 36 36 M 32 32 L 32 40" stroke="#EFF6FF" strokeWidth="3" strokeLinecap="round" />
            <path d="M 28 24 L 36 24 M 32 24 L 32 16 L 24 16 M 22 24 L 20 16 M 42 24 L 44 16" fill="none" stroke="#1E3A8A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case 'item_streak_freeze':
        return (
          <>
            <path d="M 32 8 L 32 56 M 8 32 L 56 32 M 16 16 L 48 48 M 16 48 L 48 16" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" />
            <polygon points="32,20 24,24 20,32 24,40 32,44 40,40 44,32 40,24" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="3" strokeLinejoin="round" />
            <circle cx="32" cy="32" r="6" fill="#3B82F6" />
          </>
        );
      case 'boost_streak_repair':
        return (
          <>
            <path d="M 16 16 L 24 16 L 36 28 L 48 28 L 48 48 L 36 48 L 24 36 L 16 36 Z" fill="#F43F5E" stroke="#9F1239" strokeWidth="3" strokeLinejoin="round" />
            <path d="M 40 20 L 52 32 M 36 36 L 28 44" stroke="#9F1239" strokeWidth="3" strokeLinecap="round" />
            <circle cx="42" cy="38" r="3" fill="#FDA4AF" />
          </>
        );

      case 'dec_nakshi_kantha':
        return (
          <>
            <rect x="12" y="24" width="40" height="24" rx="2" fill="#E11D48" stroke="#881337" strokeWidth="2" />
            <path d="M 12 28 L 52 28 M 12 32 L 52 32 M 12 36 L 52 36 M 12 40 L 52 40 M 12 44 L 52 44" stroke="#FDE047" strokeWidth="0.5" opacity="0.6" strokeDasharray="2 2" />
            <path d="M 32 28 L 36 34 L 32 40 L 28 34 Z" fill="#FDE047" />
          </>
        );

      case 'bg_zamindar_palace':
        return (
          <>
            <rect x="8" y="24" width="48" height="32" fill="#FDE68A" stroke="#B45309" strokeWidth="3" />
            <path d="M 8 24 L 32 8 L 56 24 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="3" strokeLinejoin="round" />
            <rect x="24" y="32" width="16" height="24" fill="#B45309" stroke="#78350F" strokeWidth="2" />
            <path d="M 24 32 C 24 24, 40 24, 40 32" fill="#D97706" stroke="#92400E" strokeWidth="2" />
          </>
        );

      case 'dec_golden_rickshaw':
        return (
          <>
            <circle cx="20" cy="40" r="10" fill="none" stroke="#EAB308" strokeWidth="3" />
            <circle cx="44" cy="40" r="10" fill="none" stroke="#EAB308" strokeWidth="3" />
            <path d="M 20 40 L 44 40 L 40 20 L 24 20 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="3" strokeLinejoin="round" />
            <path d="M 24 20 C 32 10, 40 20, 32 30" fill="none" stroke="#EAB308" strokeWidth="3" strokeLinecap="round" />
            <circle cx="20" cy="40" r="3" fill="#EAB308" />
            <circle cx="44" cy="40" r="3" fill="#EAB308" />
          </>
        );

      default:
        return (
          <rect x="16" y="16" width="32" height="32" rx="8" fill="#4B5563" stroke="#1F2937" strokeWidth="3" />
        );
    }
  };

  return (
    <div className={className + " flex items-center justify-center p-2"}>
       <div className="w-16 h-16 rounded-xl bg-slate-800/50 border border-surface-alt flex items-center justify-center text-slate-400 mx-auto">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
            {renderShape()}
          </svg>
       </div>
    </div>
  );
};

