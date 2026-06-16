import React from 'react';

export const CompanionSVGs: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  'projapoti': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Butterfly (Projapoti) */}
      {/* Shadow */}
      <ellipse cx="50" cy="85" rx="20" ry="5" fill="#1E293B" opacity="0.3" />
      {/* Left Back Wing */}
      <path d="M 50 50 C 40 30, 10 10, 5 35 C 0 55, 30 55, 50 65 Z" fill="#8B5CF6" />
      <path d="M 50 60 C 40 50, 15 50, 20 70 C 25 85, 45 75, 50 65 Z" fill="#A855F7" />
      {/* Right Back Wing */}
      <path d="M 50 50 C 60 30, 90 10, 95 35 C 100 55, 70 55, 50 65 Z" fill="#8B5CF6" />
      <path d="M 50 60 C 60 50, 85 50, 80 70 C 75 85, 55 75, 50 65 Z" fill="#A855F7" />
      {/* Wing Patterns */}
      <circle cx="20" cy="35" r="5" fill="#FDE047" />
      <circle cx="80" cy="35" r="5" fill="#FDE047" />
      <circle cx="28" cy="65" r="4" fill="#FBCFE8" />
      <circle cx="72" cy="65" r="4" fill="#FBCFE8" />
      <path d="M 15 45 L 35 50" stroke="#4C1D95" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M 85 45 L 65 50" stroke="#4C1D95" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      {/* Body */}
      <rect x="46" y="35" width="8" height="35" rx="4" fill="#334155" />
      <circle cx="50" cy="30" r="5" fill="#1E293B" />
      {/* Antennae */}
      <path d="M 50 25 C 45 15, 35 15, 35 15" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 50 25 C 55 15, 65 15, 65 15" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  ),
  'moumachhi': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Honeybee (Moumachhi) */}
      <ellipse cx="50" cy="85" rx="15" ry="4" fill="#1E293B" opacity="0.3" />
      {/* Back Wings */}
      <ellipse cx="40" cy="35" rx="8" ry="15" transform="rotate(-30 40 35)" fill="#E0F2FE" opacity="0.8" />
      <ellipse cx="60" cy="35" rx="8" ry="15" transform="rotate(30 60 35)" fill="#E0F2FE" opacity="0.8" />
      {/* Stinger */}
      <path d="M 50 75 L 48 85 L 52 85 Z" fill="#1E293B" />
      {/* Body */}
      <ellipse cx="50" cy="60" rx="18" ry="22" fill="#FACC15" />
      <path d="M 33 55 C 40 60, 60 60, 67 55 C 68 58, 68 62, 67 65 C 60 70, 40 70, 33 65 C 32 62, 32 58, 33 55 Z" fill="#1E293B" />
      <path d="M 36 45 C 45 42, 55 42, 64 45 C 65 48, 65 52, 64 55 C 55 52, 45 52, 36 55 C 35 52, 35 48, 36 45 Z" fill="#1E293B" />
      {/* Head */}
      <circle cx="50" cy="40" r="12" fill="#FACC15" />
      {/* Antennas */}
      <path d="M 45 30 Q 40 20 35 25" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 55 30 Q 60 20 65 25" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Eyes */}
      <circle cx="43" cy="38" r="3" fill="#1E293B" />
      <circle cx="57" cy="38" r="3" fill="#1E293B" />
      {/* Wings Front */}
      <ellipse cx="30" cy="45" rx="12" ry="20" transform="rotate(-45 30 45)" fill="#BAE6FD" opacity="0.7" />
      <ellipse cx="70" cy="45" rx="12" ry="20" transform="rotate(45 70 45)" fill="#BAE6FD" opacity="0.7" />
    </svg>
  ),
  'ladybug': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="50" cy="85" rx="25" ry="5" fill="#1E293B" opacity="0.3" />
      {/* Legs */}
      <path d="M 25 50 L 15 60 L 15 75 M 20 60 L 10 70 L 10 75 M 35 70 L 25 80 L 25 85" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M 75 50 L 85 60 L 85 75 M 80 60 L 90 70 L 90 75 M 65 70 L 75 80 L 75 85" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Head */}
      <path d="M 35 40 C 35 25, 65 25, 65 40 Z" fill="#1E293B" />
      {/* Shell */}
      <ellipse cx="50" cy="60" rx="30" ry="25" fill="#EF4444" />
      {/* Pattern details */}
      <path d="M 50 35 L 50 85" stroke="#991B1B" strokeWidth="2" />
      <path d="M 45 40 C 35 45, 30 65, 45 75 Z" fill="#1E293B" />
      <path d="M 55 40 C 65 45, 70 65, 55 75 Z" fill="#1E293B" />
      <circle cx="35" cy="55" r="5" fill="#1E293B" />
      <circle cx="65" cy="55" r="5" fill="#1E293B" />
      {/* Antennae */}
      <path d="M 42 25 Q 35 15 30 18" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 58 25 Q 65 15 70 18" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Little highlight */}
      <path d="M 25 55 A 10 15 0 0 1 40 45" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.4" fill="none" />
    </svg>
  ),
  'chorui': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="50" cy="85" rx="15" ry="4" fill="#1E293B" opacity="0.3" />
      {/* Legs */}
      <path d="M 45 70 L 40 85 M 40 85 L 35 85 M 40 85 L 45 85 M 55 70 L 50 85 M 50 85 L 45 85 M 50 85 L 55 85" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Tail */}
      <path d="M 68 55 L 85 45 L 80 55 L 85 60 Z" fill="#78350F" />
      {/* Body */}
      <ellipse cx="50" cy="60" rx="20" ry="18" fill="#D97706" />
      <ellipse cx="45" cy="62" rx="15" ry="12" fill="#FEF3C7" />
      <path d="M 33 45 Q 30 40 35 25 Q 45 20 53 25 Q 65 30 68 55 Z" fill="#92400E" />
      {/* Wing */}
      <path d="M 50 50 Q 80 50 70 65 Q 40 65 50 50 Z" fill="#78350F" />
      <path d="M 55 52 Q 75 53 65 62 Q 45 61 55 52 Z" fill="#92400E" />
      {/* Head */}
      <circle cx="38" cy="32" r="14" fill="#92400E" />
      <circle cx="35" cy="35" r="10" fill="#FEF3C7" />
      {/* Eye */}
      <circle cx="32" cy="30" r="2.5" fill="#1E293B" />
      <circle cx="31" cy="29" r="1" fill="#FFFFFF" />
      {/* Beak */}
      <path d="M 23 32 L 15 34 L 24 37 Z" fill="#1E293B" />
    </svg>
  ),
  'tuntuni': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="50" cy="85" rx="12" ry="3" fill="#1E293B" opacity="0.3" />
      {/* Legs */}
      <path d="M 45 70 L 40 85 M 40 85 L 35 85 M 40 85 L 45 85 M 55 70 L 50 85 M 50 85 L 45 85 M 50 85 L 55 85" stroke="#92400E" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Tail (Long pointing up) */}
      <path d="M 65 55 Q 85 10 90 20 Q 80 40 65 60 Z" fill="#65A30D" />
      {/* Body */}
      <ellipse cx="50" cy="60" rx="16" ry="14" fill="#A3E635" />
      <ellipse cx="46" cy="62" rx="12" ry="10" fill="#FEF3C7" />
      {/* Wing */}
      <path d="M 50 55 Q 70 50 65 65 Q 40 65 50 55 Z" fill="#84CC16" />
      {/* Head */}
      <circle cx="38" cy="40" r="12" fill="#A3E635" />
      <circle cx="36" cy="42" r="8" fill="#FEF3C7" />
      {/* Eye */}
      <circle cx="34" cy="38" r="2" fill="#1E293B" />
      <circle cx="33" cy="37" r="0.8" fill="#FFFFFF" />
      {/* Beak (Long thin) */}
      <path d="M 27 40 L 10 42 L 26 44 Z" fill="#CA8A04" />
    </svg>
  ),
  'phoring': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="50" cy="90" rx="20" ry="4" fill="#1E293B" opacity="0.3" />
      {/* Long tail/body */}
      <path d="M 50 40 Q 60 70 50 95 Q 40 70 50 40 Z" fill="#22C55E" />
      <path d="M 45 50 L 55 50 M 47 60 L 53 60 M 48 70 L 52 70 M 49 80 L 51 80" stroke="#166534" strokeWidth="2" strokeLinecap="round" />
      {/* Back Wings */}
      <ellipse cx="75" cy="35" rx="20" ry="6" transform="rotate(-15 75 35)" fill="#67E8F9" opacity="0.6" />
      <ellipse cx="25" cy="35" rx="20" ry="6" transform="rotate(15 25 35)" fill="#67E8F9" opacity="0.6" />
      {/* Front Wings */}
      <ellipse cx="80" cy="45" rx="22" ry="7" transform="rotate(5 80 45)" fill="#22D3EE" opacity="0.7" />
      <ellipse cx="20" cy="45" rx="22" ry="7" transform="rotate(-5 20 45)" fill="#22D3EE" opacity="0.7" />
      {/* Thorax */}
      <circle cx="50" cy="38" r="8" fill="#15803D" />
      <circle cx="50" cy="30" r="10" fill="#16A34A" />
      {/* Eyes */}
      <circle cx="43" cy="28" r="5" fill="#0284C7" />
      <circle cx="57" cy="28" r="5" fill="#0284C7" />
      <circle cx="42" cy="27" r="1.5" fill="#FFFFFF" />
      <circle cx="56" cy="27" r="1.5" fill="#FFFFFF" />
    </svg>
  ),
  'doel': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="50" cy="88" rx="20" ry="5" fill="#1E293B" opacity="0.3" />
      {/* Legs */}
      <path d="M 45 75 L 40 88 M 40 88 L 35 88 M 40 88 L 45 88 M 55 75 L 50 88 M 50 88 L 45 88 M 50 88 L 55 88" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Tail pointing up */}
      <path d="M 65 60 Q 90 20 95 30 Q 80 50 65 65 Z" fill="#0F172A" />
      <path d="M 70 60 Q 95 25 95 35 Q 85 55 70 65 Z" fill="#F8FAFC" />
      {/* Body */}
      <ellipse cx="50" cy="65" rx="22" ry="18" fill="#F8FAFC" />
      <path d="M 33 50 Q 30 40 38 30 Q 48 20 58 35 Q 70 35 70 65 Q 40 70 33 50 Z" fill="#0F172A" />
      <path d="M 35 60 Q 55 60 65 72 Q 40 75 35 60 Z" fill="#F8FAFC" />
      {/* Wing */}
      <path d="M 50 55 Q 75 55 70 70 Q 40 70 50 55 Z" fill="#334155" />
      <path d="M 52 60 Q 65 60 65 68 Q 45 68 52 60 Z" fill="#F8FAFC" />
      {/* Head */}
      <circle cx="38" cy="35" r="14" fill="#0F172A" />
      {/* Eye */}
      <circle cx="32" cy="32" r="2.5" fill="#1E293B" />
      <circle cx="31" cy="31" r="1" fill="#FFFFFF" />
      {/* Beak */}
      <path d="M 24 35 L 12 37 L 24 40 Z" fill="#475569" />
    </svg>
  ),
  'jonaki': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="50" cy="90" rx="30" ry="4" fill="#1E293B" opacity="0.3" />
      {/* Firefly 1 */}
      <g transform="translate(50, 40) rotate(-15)">
        <circle cx="0" cy="15" r="15" fill="#FEF08A" opacity="0.4" />
        <circle cx="0" cy="15" r="8" fill="#FDE047" opacity="0.6" />
        <ellipse cx="0" cy="15" rx="4" ry="6" fill="#FACC15" />
        <ellipse cx="0" cy="5" rx="4" ry="8" fill="#334155" />
        <circle cx="0" cy="-2" r="3" fill="#1E293B" />
        <ellipse cx="-8" cy="5" rx="6" ry="3" transform="rotate(-20 -8 5)" fill="#E0F2FE" opacity="0.5" />
        <ellipse cx="8" cy="5" rx="6" ry="3" transform="rotate(20 8 5)" fill="#E0F2FE" opacity="0.5" />
      </g>
      {/* Firefly 2 */}
      <g transform="translate(25, 60) rotate(20) scale(0.7)">
        <circle cx="0" cy="15" r="15" fill="#FEF08A" opacity="0.4" />
        <circle cx="0" cy="15" r="8" fill="#FDE047" opacity="0.6" />
        <ellipse cx="0" cy="15" rx="4" ry="6" fill="#FACC15" />
        <ellipse cx="0" cy="5" rx="4" ry="8" fill="#334155" />
        <circle cx="0" cy="-2" r="3" fill="#1E293B" />
        <ellipse cx="-8" cy="5" rx="6" ry="3" transform="rotate(-20 -8 5)" fill="#E0F2FE" opacity="0.5" />
        <ellipse cx="8" cy="5" rx="6" ry="3" transform="rotate(20 8 5)" fill="#E0F2FE" opacity="0.5" />
      </g>
      {/* Firefly 3 */}
      <g transform="translate(75, 55) rotate(-35) scale(0.8)">
        <circle cx="0" cy="15" r="15" fill="#FEF08A" opacity="0.4" />
        <circle cx="0" cy="15" r="8" fill="#FDE047" opacity="0.6" />
        <ellipse cx="0" cy="15" rx="4" ry="6" fill="#FACC15" />
        <ellipse cx="0" cy="5" rx="4" ry="8" fill="#334155" />
        <circle cx="0" cy="-2" r="3" fill="#1E293B" />
        <ellipse cx="-8" cy="5" rx="6" ry="3" transform="rotate(-20 -8 5)" fill="#E0F2FE" opacity="0.5" />
        <ellipse cx="8" cy="5" rx="6" ry="3" transform="rotate(20 8 5)" fill="#E0F2FE" opacity="0.5" />
      </g>
    </svg>
  ),
  'bang': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="50" cy="88" rx="28" ry="6" fill="#1E293B" opacity="0.3" />
      {/* Back legs */}
      <path d="M 25 70 Q 15 50 10 75 Q 15 85 30 85 Z" fill="#15803D" />
      <path d="M 75 70 Q 85 50 90 75 Q 85 85 70 85 Z" fill="#15803D" />
      <path d="M 12 75 L 5 85 M 12 75 L 10 88 M 12 75 L 15 88" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 88 75 L 95 85 M 88 75 L 90 88 M 88 75 L 85 88" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
      {/* Body */}
      <ellipse cx="50" cy="65" rx="28" ry="22" fill="#22C55E" />
      <ellipse cx="50" cy="72" rx="22" ry="12" fill="#86EFAC" />
      {/* Front legs */}
      <path d="M 35 75 L 30 90 M 30 90 L 25 92 M 30 90 L 32 94" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
      <path d="M 65 75 L 70 90 M 70 90 L 75 92 M 70 90 L 68 94" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
      {/* Texture */}
      <circle cx="35" cy="55" r="2.5" fill="#15803D" opacity="0.4" />
      <circle cx="65" cy="55" r="2.5" fill="#15803D" opacity="0.4" />
      <circle cx="50" cy="50" r="2.5" fill="#15803D" opacity="0.4" />
      <circle cx="42" cy="62" r="1.5" fill="#15803D" opacity="0.4" />
      <circle cx="58" cy="62" r="1.5" fill="#15803D" opacity="0.4" />
      {/* Head */}
      <path d="M 28 50 Q 50 30 72 50 Z" fill="#22C55E" />
      <circle cx="36" cy="42" r="8" fill="#22C55E" />
      <circle cx="64" cy="42" r="8" fill="#22C55E" />
      {/* Eyes */}
      <circle cx="36" cy="40" r="5" fill="#FEF08A" />
      <circle cx="64" cy="40" r="5" fill="#FEF08A" />
      <path d="M 34 38 L 38 42" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 62 38 L 66 42" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
      {/* Mouth */}
      <path d="M 35 52 Q 50 58 65 52" fill="none" stroke="#14532D" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  'shalik': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="50" cy="85" rx="18" ry="4" fill="#1E293B" opacity="0.3" />
      <path d="M 45 70 L 40 85 M 40 85 L 35 85 M 40 85 L 45 85 M 55 70 L 50 85 M 50 85 L 45 85 M 50 85 L 55 85" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Tail */}
      <path d="M 65 55 L 85 65 L 80 70 Z" fill="#1E293B" />
      <path d="M 65 60 L 80 65 L 75 70 Z" fill="#F8FAFC" />
      {/* Body */}
      <ellipse cx="50" cy="60" rx="22" ry="16" fill="#4B5563" />
      <ellipse cx="45" cy="65" rx="15" ry="10" fill="#E2E8F0" />
      {/* Wing */}
      <path d="M 50 50 Q 75 52 68 68 Q 42 66 50 50 Z" fill="#1E293B" />
      <path d="M 52 56 L 62 62 M 54 60 L 64 66" stroke="#F8FAFC" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      {/* Head/Neck */}
      <path d="M 32 45 Q 28 30 38 25 Q 50 25 55 45 Z" fill="#1E293B" />
      <circle cx="38" cy="32" r="14" fill="#1E293B" />
      {/* Yellow Eye Patch */}
      <circle cx="32" cy="28" r="4.5" fill="#FACC15" />
      {/* Eye */}
      <circle cx="32" cy="28" r="2" fill="#1E293B" />
      {/* Yellow Beak */}
      <path d="M 24 30 L 12 32 L 25 35 Z" fill="#FACC15" />
    </svg>
  ),
  'machranga': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="50" cy="85" rx="15" ry="4" fill="#1E293B" opacity="0.3" />
      {/* Legs */}
      <path d="M 45 70 L 40 85 M 40 85 L 35 85 M 40 85 L 45 85 M 55 70 L 50 85 M 50 85 L 45 85 M 50 85 L 55 85" stroke="#F97316" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Tail (Stubby) */}
      <path d="M 68 55 L 85 60 L 80 65 L 65 65 Z" fill="#0EA5E9" />
      {/* Body */}
      <ellipse cx="50" cy="55" rx="20" ry="18" fill="#FDE047" strokeWidth="0" />
      <path d="M 33 45 Q 30 40 38 25 Q 50 25 55 40 Q 68 50 68 65 Q 40 70 33 45 Z" fill="#F97316" />
      {/* Wing */}
      <path d="M 48 45 Q 75 45 70 70 Q 40 65 48 45 Z" fill="#0EA5E9" />
      <path d="M 52 50 Q 68 50 65 65 Q 45 60 52 50 Z" fill="#38BDF8" />
      {/* Head */}
      <circle cx="38" cy="28" r="14" fill="#F97316" />
      <path d="M 38 14 Q 30 14 26 28 Q 50 28 52 14 Z" fill="#0EA5E9" />
      {/* Eye */}
      <circle cx="34" cy="25" r="2.5" fill="#1E293B" />
      <circle cx="33" cy="24" r="1" fill="#FFFFFF" />
      {/* Beak (Very long sword-like) */}
      <path d="M 26 26 L -2 30 L 26 34 Z" fill="#EF4444" />
      <path d="M 26 26 L -2 30 L 26 30 Z" fill="#DC2626" />
    </svg>
  ),
  'pecha': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="50" cy="85" rx="25" ry="5" fill="#1E293B" opacity="0.5" />
      {/* Feet */}
      <path d="M 40 75 L 35 85 M 35 85 L 30 85 M 35 85 L 40 85 M 60 75 L 65 85 M 65 85 L 60 85 M 65 85 L 70 85" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Big Body */}
      <ellipse cx="50" cy="55" rx="25" ry="28" fill="#94A3B8" />
      <ellipse cx="50" cy="60" rx="18" ry="20" fill="#E2E8F0" />
      {/* Chest Texture (Feathers) */}
      <path d="M 45 50 Q 50 55 55 50" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 40 60 Q 45 65 50 60" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 50 60 Q 55 65 60 60" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 45 70 Q 50 75 55 70" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Wings */}
      <path d="M 25 45 C 15 55, 15 75, 25 80 Z" fill="#64748B" />
      <path d="M 75 45 C 85 55, 85 75, 75 80 Z" fill="#64748B" />
      {/* Head */}
      <ellipse cx="50" cy="30" rx="22" ry="18" fill="#94A3B8" />
      {/* Ear Tufts */}
      <path d="M 33 20 L 25 5 L 42 16 Z" fill="#64748B" />
      <path d="M 67 20 L 75 5 L 58 16 Z" fill="#64748B" />
      {/* Mask */}
      <ellipse cx="38" cy="30" rx="10" ry="12" fill="#F8FAFC" />
      <ellipse cx="62" cy="30" rx="10" ry="12" fill="#F8FAFC" />
      {/* Big Eyes */}
      <circle cx="38" cy="30" r="5" fill="#F59E0B" />
      <circle cx="62" cy="30" r="5" fill="#F59E0B" />
      <circle cx="38" cy="30" r="2.5" fill="#1E293B" />
      <circle cx="62" cy="30" r="2.5" fill="#1E293B" />
      {/* Beak */}
      <path d="M 48 35 L 52 35 L 50 42 Z" fill="#F59E0B" />
    </svg>
  )
};
