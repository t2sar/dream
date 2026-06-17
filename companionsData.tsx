import React from 'react';

export interface CompanionDef {
  id: string;
  name: string;
  banglaName: string;
  unlockConditionStr: string;
}

export const COMPANIONS: CompanionDef[] = [
  { id: 'projapoti', name: 'Butterfly', banglaName: 'Projapoti', unlockConditionStr: 'Complete your first 7-day streak' },
  { id: 'moumachhi', name: 'Honeybee', banglaName: 'Moumachhi', unlockConditionStr: 'Complete 25 total check-ins' },
  { id: 'ladybug', name: 'Ladybug', banglaName: 'Ladybug', unlockConditionStr: 'Grow your first plant to stage 6' },
  { id: 'chorui', name: 'Sparrow', banglaName: 'Chorui', unlockConditionStr: 'Reach Level 10' },
  { id: 'tuntuni', name: 'Tailorbird', banglaName: 'Tuntuni', unlockConditionStr: 'Complete 15 perfect garden days' },
  { id: 'phoring', name: 'Dragonfly', banglaName: 'Phoring', unlockConditionStr: 'Complete a 7-day Garden Challenge' },
  { id: 'doel', name: 'Doel', banglaName: 'Doel', unlockConditionStr: '30-day streak on any habit' },
  { id: 'shongee', name: 'Honeybee', banglaName: 'Mouchak Bee', unlockConditionStr: 'Complete 25 total check-ins' },
  { id: 'kaktadhua', name: 'Scarecrow', banglaName: 'Kaktadhua', unlockConditionStr: 'Grow your first plant to stage 6' },
  { id: 'jonaki', name: 'Firefly swarm', banglaName: 'Jonaki', unlockConditionStr: 'Complete habits 10 evenings (after 7 PM)' },
  { id: 'bang', name: 'Frog', banglaName: 'Bang', unlockConditionStr: 'Complete all habits on 5 rainy-season days' },
  { id: 'shalik', name: 'Myna', banglaName: 'Shalik', unlockConditionStr: 'Resist bad habits 25 times (Pest system)' },
  { id: 'machranga', name: 'Kingfisher', banglaName: 'Machranga', unlockConditionStr: 'Maintain 3 habits simultaneously for 30 days' },
  { id: 'pecha', name: 'Owl', banglaName: 'Pecha', unlockConditionStr: 'Complete habits 15 nights (after 10 PM)' },
];

export const CompanionAssetsDictionary: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  // 1. Doel Bird (Magpie Robin)
  'doel': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Grounding Log/Branch Segment */}
      <path d="M 20 85 C 30 82, 70 82, 80 85 Z" fill="#78350F" />
      <path d="M 22 83 C 32 80, 68 80, 78 83 Z" fill="#92400E" />
      <ellipse cx="20" cy="85" rx="3" ry="2" fill="#451A03" />
      <ellipse cx="80" cy="85" rx="4" ry="2" fill="#B45309" />
      
      {/* Feet */}
      <path d="M 45 78 L 40 84 M 40 84 L 35 84 M 40 84 L 45 84 M 55 78 L 50 84 M 50 84 L 45 84 M 50 84 L 55 84" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      
      {/* Tail (pointing upward) */}
      <path d="M 65 60 C 80 40, 93 25, 95 30 C 90 45, 75 60, 65 65 Z" fill="#0F172A" />
      <path d="M 68 62 C 82 48, 91 35, 92 38 C 88 50, 75 62, 68 65 Z" fill="#F8FAFC" />

      {/* Body Area */}
      <ellipse cx="50" cy="62" rx="22" ry="18" fill="#F8FAFC" />
      {/* Upper Black Body Segment */}
      <path d="M 33 48 C 30 40, 38 30, 48 20 C 58 35, 70 35, 70 65 C 40 70, 33 48, 33 48 Z" fill="#0F172A" />
      {/* Light fluffy belly accent */}
      <path d="M 35 60 C 50 55, 60 70, 35 60 Z" fill="#E2E8F0" opacity="0.5" />

      {/* Folded Wing */}
      <path d="M 50 55 C 65 55, 70 65, 70 70 C 55 75, 40 70, 50 55 Z" fill="#334155" />
      <path d="M 50 58 C 60 58, 65 64, 65 68 C 55 70, 45 68, 50 58 Z" fill="#F8FAFC" />

      {/* Head */}
      <circle cx="38" cy="35" r="14" fill="#0F172A" />

      {/* Eye */}
      <circle cx="32" cy="32" r="2.5" fill="#1E293B" />
      <circle cx="31" cy="31" r="1" fill="#FFFFFF" />

      {/* Beak */}
      <path d="M 24 35 L 12 37 L 24 40 Z" fill="#334155" />
      <path d="M 24 38 L 15 38 L 24 40 Z" fill="#1E293B" />
    </svg>
  ),

  // 2. Shongee Honeybee (Mouchak Bee)
  'shongee': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Hovering Shadow */}
      <ellipse cx="50" cy="90" rx="15" ry="4" fill="#1E293B" opacity="0.25" />

      {/* Back Wings (Translucent Seafoam) */}
      <ellipse cx="38" cy="35" rx="8" ry="16" transform="rotate(-35 38 35)" fill="#CCFBF1" opacity="0.8" />
      <ellipse cx="62" cy="35" rx="8" ry="16" transform="rotate(35 62 35)" fill="#CCFBF1" opacity="0.8" />

      {/* Tiny Stinger */}
      <path d="M 50 78 L 48 85 L 52 85 Z" fill="#334155" />

      {/* Rounded Plump Body Base (Pastel Yellow) */}
      <ellipse cx="50" cy="62" rx="18" ry="20" fill="#FEF08A" />

      {/* Dark Charcoal Stripes (Soft curved shapes) */}
      <path d="M 32 58 C 45 64, 55 64, 68 58 C 67 62, 65 65, 63 67 C 55 72, 45 72, 37 67 C 35 65, 33 62, 32 58 Z" fill="#334155" />
      <path d="M 33 48 C 45 44, 55 44, 67 48 C 67 52, 66 55, 64 57 C 55 53, 45 53, 36 57 C 34 55, 33 52, 33 48 Z" fill="#334155" />

      {/* Cute Head */}
      <circle cx="50" cy="40" r="12" fill="#FEF08A" />

      {/* Fluffy Collar/Cheeks (Optional little cute touches) */}
      <circle cx="41" cy="48" r="4" fill="#FEF08A" />
      <circle cx="59" cy="48" r="4" fill="#FEF08A" />

      {/* Antennae */}
      <path d="M 45 31 Q 40 22 35 25" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M 55 31 Q 60 22 65 25" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="35" cy="25" r="1.5" fill="#334155" />
      <circle cx="65" cy="25" r="1.5" fill="#334155" />

      {/* Friendly Eyes */}
      <ellipse cx="45" cy="38" rx="2" ry="3" fill="#334155" />
      <ellipse cx="55" cy="38" rx="2" ry="3" fill="#334155" />
      
      {/* Blushing Cheeks */}
      <circle cx="42" cy="42" r="2.5" fill="#FCA5A5" opacity="0.6" />
      <circle cx="58" cy="42" r="2.5" fill="#FCA5A5" opacity="0.6" />

      {/* Front Wings (Translucent Seafoam) */}
      <ellipse cx="30" cy="45" rx="12" ry="22" transform="rotate(-50 30 45)" fill="#99F6E4" opacity="0.85" />
      <ellipse cx="70" cy="45" rx="12" ry="22" transform="rotate(50 70 45)" fill="#99F6E4" opacity="0.85" />

      {/* Wing Highlights */}
      <path d="M 22 40 C 26 35, 32 35, 35 40" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M 78 40 C 74 35, 68 35, 65 40" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
    </svg>
  ),

  // 3. Kaktadhua (Traditional Scarecrow)
  'kaktadhua': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Ground Mound / Dirt Patch Component */}
      <path d="M 35 90 C 45 85, 55 85, 65 90 C 60 95, 40 95, 35 90 Z" fill="#854D0E" />
      <ellipse cx="50" cy="92" rx="15" ry="3" fill="#713F12" />

      {/* Bamboo Frame Sticks */}
      <rect x="47" y="55" width="6" height="35" rx="2" fill="#D97706" />
      <path d="M 47 55 C 50 60, 53 60, 53 55 Z" fill="#B45309" opacity="0.5" />
      
      {/* Arm Stick (Cross) */}
      <rect x="25" y="45" width="50" height="6" rx="2" fill="#D97706" />
      {/* Wrapping tie at the cross */ }
      <rect x="46" y="44" width="8" height="8" rx="1" fill="#78350F" />
      <path d="M 45 46 L 55 48 M 45 49 L 55 45 M 46 51 L 54 50" stroke="#B45309" strokeWidth="1" strokeLinecap="round" />

      {/* Gamcha Cloth (Red Checkered) Draping around the neck area */}
      <path d="M 35 42 C 45 35, 55 35, 65 42 C 60 55, 40 55, 35 42 Z" fill="#EF4444" />
      {/* Gamcha Droping tails */}
      <path d="M 40 50 C 35 60, 30 70, 35 75 C 40 65, 45 55, 42 50 Z" fill="#DC2626" />
      <path d="M 58 50 C 60 62, 58 72, 65 78 C 65 65, 62 55, 58 50 Z" fill="#EF4444" />
      
      {/* Simple Checkered Pattern Lines on Gamcha */}
      <path d="M 38 45 L 62 45 M 36 48 L 64 48 M 38 42 L 50 52 M 62 42 L 50 52" stroke="#B91C1C" strokeWidth="1" strokeLinecap="round" />
      <path d="M 35 60 L 32 65 M 34 68 L 38 72" stroke="#991B1B" strokeWidth="1" />
      <path d="M 60 60 L 63 65 M 62 70 L 64 75" stroke="#991B1B" strokeWidth="1" />

      {/* The Clay Pot Head (Hari) */}
      <path d="M 40 37 C 35 15, 65 15, 60 37 Z" fill="#F59E0B" />
      {/* Pot Rim (Upside down pot on head) */}
      <ellipse cx="50" cy="38" rx="12" ry="3" fill="#D97706" />
      <ellipse cx="50" cy="37" rx="11" ry="2" fill="#B45309" opacity="0.3" />

      {/* Stylized Face painted on clay pot */}
      <circle cx="43" cy="27" r="2.5" fill="#1E293B" />
      <circle cx="57" cy="27" r="2.5" fill="#1E293B" />
      <path d="M 41 24 C 43 22, 45 22, 45 24" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M 55 24 C 57 22, 59 22, 59 24" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      
      <circle cx="40" cy="30" r="3" fill="#FCA5A5" opacity="0.7" />
      <circle cx="60" cy="30" r="3" fill="#FCA5A5" opacity="0.7" />

      {/* Friendly Smile */}
      <path d="M 46 32 C 48 35, 52 35, 54 32" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Straw sticking out from arms and neck */}
      <path d="M 25 45 L 20 42 M 25 47 L 18 48 M 25 50 L 21 53" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
      <path d="M 75 45 L 80 42 M 75 47 L 82 48 M 75 50 L 79 53" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  // 4. Projapoti (Butterfly)
  'projapoti': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Hovering Shadow */}
      <ellipse cx="50" cy="90" rx="15" ry="4" fill="#1E293B" opacity="0.25" />

      {/* Back Wings (Smaller, darker purple/pink) */}
      <path d="M 50 50 C 35 15, 10 30, 30 65 C 40 70, 50 50, 50 50 Z" fill="#D946EF" />
      <path d="M 50 50 C 65 15, 90 30, 70 65 C 60 70, 50 50, 50 50 Z" fill="#D946EF" />

      {/* Lower Wings */}
      <path d="M 50 54 C 30 75, 20 90, 45 85 C 55 80, 50 54, 50 54 Z" fill="#C026D3" />
      <path d="M 50 54 C 70 75, 80 90, 55 85 C 45 80, 50 54, 50 54 Z" fill="#C026D3" />

      {/* Wing Patterns */}
      <circle cx="30" cy="45" r="5" fill="#FDF4FF" opacity="0.6" />
      <circle cx="70" cy="45" r="5" fill="#FDF4FF" opacity="0.6" />
      <ellipse cx="38" cy="72" rx="3" ry="5" transform="rotate(-30 38 72)" fill="#FDF4FF" opacity="0.6" />
      <ellipse cx="62" cy="72" rx="3" ry="5" transform="rotate(30 62 72)" fill="#FDF4FF" opacity="0.6" />

      {/* Antennae */}
      <path d="M 47 35 Q 40 25 35 28" stroke="#334155" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 53 35 Q 60 25 65 28" stroke="#334155" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="35" cy="28" r="1.5" fill="#334155" />
      <circle cx="65" cy="28" r="1.5" fill="#334155" />

      {/* Body */}
      <rect x="46" y="32" width="8" height="30" rx="4" fill="#334155" />
      {/* Head */}
      <circle cx="50" cy="32" r="6" fill="#334155" />
      {/* Eyes */}
      <circle cx="48" cy="31" r="1" fill="#FDF4FF" />
      <circle cx="52" cy="31" r="1" fill="#FDF4FF" />
    </svg>
  ),

  // 5. Bang (Frog)
  'bang': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Lilypad / Leaf Base */}
      <path d="M 50 92 C 80 92, 90 85, 90 80 C 90 75, 80 70, 50 70 C 20 70, 10 75, 10 80 C 10 85, 20 92, 50 92 Z" fill="#166534" />
      <path d="M 50 90 C 75 90, 85 84, 85 80 C 85 76, 75 72, 50 72 C 25 72, 15 76, 15 80 C 15 84, 25 90, 50 90 Z" fill="#22C55E" />
      <path d="M 50 81 L 18 80 M 50 81 L 82 80 M 50 81 L 35 73 M 50 81 L 65 73" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 85 80 L 95 80 Z" fill="#166534" stroke="#166534" strokeWidth="2"/>

      {/* Back Legs */}
      <path d="M 25 75 C 15 65, 20 50, 35 60 C 40 65, 35 75, 25 75 Z" fill="#15803D" />
      <path d="M 75 75 C 85 65, 80 50, 65 60 C 60 65, 65 75, 75 75 Z" fill="#15803D" />
      {/* Feet */}
      <path d="M 25 73 L 15 78 L 22 80 L 17 83 L 28 80 Z" fill="#15803D" />
      <path d="M 75 73 L 85 78 L 78 80 L 83 83 L 72 80 Z" fill="#15803D" />

      {/* Main Body */}
      <ellipse cx="50" cy="58" rx="25" ry="22" fill="#22C55E" />
      {/* Belly */}
      <ellipse cx="50" cy="62" rx="18" ry="15" fill="#BBF7D0" />

      {/* Front Legs */}
      <path d="M 38 65 C 35 75, 30 80, 25 82 C 30 84, 38 78, 42 65 Z" fill="#22C55E" />
      <path d="M 62 65 C 65 75, 70 80, 75 82 C 70 84, 62 78, 58 65 Z" fill="#22C55E" />
      <circle cx="26" cy="82" r="2" fill="#22C55E" />
      <circle cx="29" cy="83" r="2" fill="#22C55E" />
      <circle cx="74" cy="82" r="2" fill="#22C55E" />
      <circle cx="71" cy="83" r="2" fill="#22C55E" />

      {/* Eyes (Bulging) */}
      <circle cx="35" cy="35" r="10" fill="#22C55E" />
      <circle cx="65" cy="35" r="10" fill="#22C55E" />
      <circle cx="35" cy="33" r="8" fill="#F8FAFC" />
      <circle cx="65" cy="33" r="8" fill="#F8FAFC" />
      
      <circle cx="35" cy="33" r="4" fill="#0F172A" />
      <circle cx="65" cy="33" r="4" fill="#0F172A" />
      <circle cx="33" cy="31" r="1.5" fill="#FFFFFF" />
      <circle cx="63" cy="31" r="1.5" fill="#FFFFFF" />

      {/* Blushing Cheeks */}
      <ellipse cx="30" cy="48" rx="4" ry="2.5" fill="#FCA5A5" opacity="0.6" />
      <ellipse cx="70" cy="48" rx="4" ry="2.5" fill="#FCA5A5" opacity="0.6" />

      {/* Mouth */}
      <path d="M 42 45 C 50 50, 58 45, 58 45" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  ),

  // 6. Machranga (Kingfisher)
  'machranga': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Branch (from side) */}
      <path d="M 0 75 C 20 70, 40 75, 45 72 L 45 80 C 30 82, 15 80, 0 85 Z" fill="#78350F" />
      <path d="M 0 78 C 20 73, 35 77, 45 76 L 45 80 C 30 82, 15 80, 0 85 Z" fill="#92400E" />

      {/* Tail pointing down */}
      <path d="M 25 55 L 15 85 L 22 83 L 30 65 Z" fill="#0284C7" />
      <path d="M 20 55 L 18 80 L 22 78 L 26 65 Z" fill="#38BDF8" />

      {/* Feet */}
      <path d="M 35 70 L 32 75 M 32 75 L 28 76 M 32 75 L 34 77" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Body Front (Orange/Yellow Belly) */}
      <path d="M 45 35 C 55 50, 50 65, 35 70 C 25 65, 20 50, 30 35 C 35 30, 40 30, 45 35 Z" fill="#F97316" />
      <path d="M 40 38 C 45 50, 42 60, 33 65 C 26 60, 24 50, 30 38 C 32 35, 36 35, 40 38 Z" fill="#FBBF24" opacity="0.8" />

      {/* Body Back (Vibrant Cyan) */}
      <path d="M 25 25 C 10 40, 15 60, 25 65 C 20 50, 20 40, 30 25 Z" fill="#0284C7" />
      
      {/* Wing */}
      <path d="M 32 40 C 20 55, 22 70, 28 72 C 30 65, 35 55, 38 40 C 36 38, 34 38, 32 40 Z" fill="#0369A1" />
      <path d="M 30 45 C 22 55, 24 65, 28 68 C 29 60, 32 50, 34 45 Z" fill="#38BDF8" />

      {/* Highlights/Feather pattern on wing */}
      <circle cx="28" cy="50" r="1.5" fill="#7DD3FC" />
      <circle cx="26" cy="55" r="1.5" fill="#7DD3FC" />
      <circle cx="29" cy="62" r="1.5" fill="#7DD3FC" />

      {/* Head (Large) */}
      <path d="M 30 25 C 30 15, 45 15, 50 25 C 55 35, 45 45, 40 45 C 30 45, 25 35, 30 25 Z" fill="#0284C7" />
      
      {/* White cheek/neck patch */}
      <path d="M 40 35 C 45 35, 48 30, 45 25 C 40 25, 38 30, 40 35 Z" fill="#F8FAFC" />
      <path d="M 35 45 C 40 45, 42 40, 38 38 C 35 36, 32 40, 35 45 Z" fill="#F8FAFC" />

      {/* Eye */}
      <circle cx="45" cy="22" r="3" fill="#0F172A" />
      <circle cx="46" cy="21" r="1" fill="#FFFFFF" />

      {/* Beak (Long, Red/Orange) */}
      <path d="M 48 20 L 85 24 L 46 26 Z" fill="#DC2626" />
      <path d="M 48 24 L 80 24 L 46 26 Z" fill="#991B1B" />
    </svg>
  ),

  // 7. Tuntuni (Tailorbird)
  'tuntuni': (props) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Grounding Base: Leaf nest/branch */}
      <path d="M 15 85 C 35 80, 65 80, 85 85 C 70 95, 30 95, 15 85 Z" fill="#65A30D" />
      <path d="M 25 83 C 45 78, 55 78, 75 83 C 60 90, 40 90, 25 83 Z" fill="#4D7C0F" />
      
      {/* Feet */}
      <path d="M 40 75 L 35 82 M 35 82 L 30 83 M 35 82 L 38 84" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 60 75 L 55 82 M 55 82 L 50 83 M 55 82 L 58 84" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Tail (Long and pointing up) */}
      <path d="M 70 55 C 85 30, 95 15, 95 20 C 85 40, 75 55, 72 60 Z" fill="#65A30D" />
      <path d="M 68 55 C 80 35, 90 25, 90 28 C 82 42, 72 55, 70 58 Z" fill="#84CC16" />

      {/* Body (Olive Green and Yellow) */}
      <ellipse cx="50" cy="55" rx="22" ry="18" fill="#84CC16" />
      <path d="M 35 55 C 45 70, 60 70, 68 55 C 60 45, 45 45, 35 55 Z" fill="#FEF08A" opacity="0.9" />

      {/* Wing */}
      <path d="M 50 50 C 65 45, 75 55, 75 62 C 60 65, 45 60, 50 50 Z" fill="#4D7C0F" />
      <path d="M 50 52 C 60 48, 68 55, 68 60 C 58 62, 48 58, 50 52 Z" fill="#65A30D" />

      {/* Head */}
      <circle cx="35" cy="40" r="14" fill="#84CC16" />
      
      {/* Rust/Red crown on head */}
      <path d="M 23 35 C 28 25, 42 25, 47 35 C 40 40, 30 40, 23 35 Z" fill="#D97706" />

      {/* Eye */}
      <circle cx="32" cy="38" r="2.5" fill="#0F172A" />
      <circle cx="31" cy="37" r="1" fill="#FFFFFF" />

      {/* Beak (Thin and slightly curved) */}
      <path d="M 22 41 C 12 43, 5 45, 10 46 C 15 45, 20 44, 22 44 Z" fill="#78350F" />
    </svg>
  )
};

