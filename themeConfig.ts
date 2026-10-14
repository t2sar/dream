export type ThemeCategory = 'System' | 'Light' | 'Dark' | 'Specialty';

export interface ThemeColors {
  '--bg-base': string;
  '--surface': string;
  '--surface-soft': string;
  '--surface-alt': string;
  '--surface-card': string;
  '--primary-anchor': string;
  '--primary-text': string;
  '--text-secondary': string;
  '--text-muted': string;
  '--text-status-healthy': string;
  '--accent-coral': string;
  '--accent-mustard': string;
  '--accent-seafoam': string;
  '--accent-periwinkle': string;
  '--accent-blush': string;
  '--color-background-main': string;
  '--color-primary-mint': string;
}

export interface ThemePreset {
  id: string;
  name: string;
  category: ThemeCategory;
  description: string;
  isDark: boolean;
  colors: ThemeColors;
  preview: {
    bg: string;
    card: string;
    accent: string;
    text: string;
  };
  accentColor: string; // RGB string for alpha-blending
}

export const CRISP_DAYLIGHT_THEME: ThemePreset = {
  id: 'crisp_daylight',
  name: 'Crisp Daylight',
  category: 'Light',
  description: 'Clean white surfaces, cool slate borders, high-contrast ink text.',
  isDark: false,
  accentColor: '13 148 136', // Teal 600
  preview: {
    bg: '#FFFFFF',
    card: '#F8FAFC',
    accent: '#0D9488',
    text: '#0F172A',
  },
  colors: {
    '--bg-base': '#FFFFFF',
    '--surface': '#FFFFFF',
    '--surface-soft': '#F8FAFC',
    '--surface-alt': '#E2E8F0',
    '--surface-card': '#FFFFFF',
    '--primary-anchor': '#0F172A',
    '--primary-text': '#0F172A',
    '--text-secondary': '#334155',
    '--text-muted': '#64748B',
    '--text-status-healthy': '#0D9488',
    '--accent-coral': '#E11D48',
    '--accent-mustard': '#D97706',
    '--accent-seafoam': '#0D9488',
    '--accent-periwinkle': '#2563EB',
    '--accent-blush': '#DB2777',
    '--color-background-main': '#FFFFFF',
    '--color-primary-mint': '#0D9488',
  },
};

export const WARM_PAPER_THEME: ThemePreset = {
  id: 'warm_paper',
  name: 'Warm Paper / Sepia',
  category: 'Light',
  description: 'Soft cream parchment background, warm espresso text, amber-tinted borders.',
  isDark: false,
  accentColor: '62 142 126',
  preview: {
    bg: '#FBF7EE',
    card: '#FFFDF9',
    accent: '#CF5C36',
    text: '#2B2118',
  },
  colors: {
    '--bg-base': '#FBF7EE',
    '--surface': '#FFFDF9',
    '--surface-soft': '#F5EEDB',
    '--surface-alt': '#E8DEC8',
    '--surface-card': '#FFFDF9',
    '--primary-anchor': '#2B2118',
    '--primary-text': '#2B2118',
    '--text-secondary': '#5A483C',
    '--text-muted': '#857264',
    '--text-status-healthy': '#356859',
    '--accent-coral': '#CF5C36',
    '--accent-mustard': '#D49A3D',
    '--accent-seafoam': '#3E8E7E',
    '--accent-periwinkle': '#6D7993',
    '--accent-blush': '#DE8971',
    '--color-background-main': '#FBF7EE',
    '--color-primary-mint': '#3E8E7E',
  },
};

export const MATCHA_BOTANICAL_THEME: ThemePreset = {
  id: 'matcha_botanical',
  name: 'Matcha / Botanical',
  category: 'Light',
  description: 'Sage-tinted light background, deep forest green text and organic accents.',
  isDark: false,
  accentColor: '46 139 87',
  preview: {
    bg: '#F1F7F2',
    card: '#FCFDFC',
    accent: '#2E8B57',
    text: '#112A18',
  },
  colors: {
    '--bg-base': '#F1F7F2',
    '--surface': '#FCFDFC',
    '--surface-soft': '#E6EFE7',
    '--surface-alt': '#D2E2D4',
    '--surface-card': '#FCFDFC',
    '--primary-anchor': '#112A18',
    '--primary-text': '#112A18',
    '--text-secondary': '#284B32',
    '--text-muted': '#4D7057',
    '--text-status-healthy': '#1F6F3A',
    '--accent-coral': '#D96B4F',
    '--accent-mustard': '#BFA12C',
    '--accent-seafoam': '#2E8B57',
    '--accent-periwinkle': '#4A7C59',
    '--accent-blush': '#CF8893',
    '--color-background-main': '#F1F7F2',
    '--color-primary-mint': '#2E8B57',
  },
};

export const MIDNIGHT_SLATE_THEME: ThemePreset = {
  id: 'midnight_slate',
  name: 'Midnight Slate',
  category: 'Dark',
  description: 'Deep charcoal-blue surfaces with crisp off-white text.',
  isDark: true,
  accentColor: '56 189 248',
  preview: {
    bg: '#0B101B',
    card: '#141C2E',
    accent: '#38BDF8',
    text: '#F1F5F9',
  },
  colors: {
    '--bg-base': '#0B101B',
    '--surface': '#141C2E',
    '--surface-soft': '#0E1524',
    '--surface-alt': '#1F2B44',
    '--surface-card': '#141C2E',
    '--primary-anchor': '#F1F5F9',
    '--primary-text': '#F1F5F9',
    '--text-secondary': '#94A3B8',
    '--text-muted': '#64748B',
    '--text-status-healthy': '#38BDF8',
    '--accent-coral': '#F43F5E',
    '--accent-mustard': '#FBBF24',
    '--accent-seafoam': '#38BDF8',
    '--accent-periwinkle': '#60A5FA',
    '--accent-blush': '#F472B6',
    '--color-background-main': '#0B101B',
    '--color-primary-mint': '#38BDF8',
  },
};

export const OLED_PITCH_BLACK_THEME: ThemePreset = {
  id: 'oled_pitch_black',
  name: 'OLED Pitch Black',
  category: 'Dark',
  description: 'True #000000 background, darkzinc cards, high-contrast white text for battery saving.',
  isDark: true,
  accentColor: '16 185 129',
  preview: {
    bg: '#000000',
    card: '#121215',
    accent: '#10B981',
    text: '#FFFFFF',
  },
  colors: {
    '--bg-base': '#000000',
    '--surface': '#121215',
    '--surface-soft': '#08080A',
    '--surface-alt': '#27272A',
    '--surface-card': '#121215',
    '--primary-anchor': '#FFFFFF',
    '--primary-text': '#FFFFFF',
    '--text-secondary': '#D4D4D8',
    '--text-muted': '#71717A',
    '--text-status-healthy': '#10B981',
    '--accent-coral': '#F43F5E',
    '--accent-mustard': '#F59E0B',
    '--accent-seafoam': '#10B981',
    '--accent-periwinkle': '#38BDF8',
    '--accent-blush': '#EC4899',
    '--color-background-main': '#000000',
    '--color-primary-mint': '#10B981',
  },
};

export const NORD_ARCTIC_THEME: ThemePreset = {
  id: 'nord_arctic',
  name: 'Nord / Arctic',
  category: 'Dark',
  description: 'Frosty blue-gray dark surfaces with muted glacier cyan and ice blue highlights.',
  isDark: true,
  accentColor: '136 192 208',
  preview: {
    bg: '#242933',
    card: '#2E3440',
    accent: '#88C0D0',
    text: '#ECEFF4',
  },
  colors: {
    '--bg-base': '#242933',
    '--surface': '#2E3440',
    '--surface-soft': '#1E222A',
    '--surface-alt': '#3B4252',
    '--surface-card': '#2E3440',
    '--primary-anchor': '#ECEFF4',
    '--primary-text': '#ECEFF4',
    '--text-secondary': '#D8DEE9',
    '--text-muted': '#8190A5',
    '--text-status-healthy': '#88C0D0',
    '--accent-coral': '#BF616A',
    '--accent-mustard': '#EBCB8B',
    '--accent-seafoam': '#88C0D0',
    '--accent-periwinkle': '#81A1C1',
    '--accent-blush': '#B48EAD',
    '--color-background-main': '#242933',
    '--color-primary-mint': '#88C0D0',
  },
};

export const CYBERPUNK_SYNTHWAVE_THEME: ThemePreset = {
  id: 'cyberpunk_synthwave',
  name: 'Cyberpunk / Synthwave',
  category: 'Specialty',
  description: 'Deep obsidian-violet background with neon magenta and electric cyan accents.',
  isDark: true,
  accentColor: '0 240 255',
  preview: {
    bg: '#0B0614',
    card: '#160C26',
    accent: '#00F0FF',
    text: '#FAF5FF',
  },
  colors: {
    '--bg-base': '#0B0614',
    '--surface': '#160C26',
    '--surface-soft': '#08040F',
    '--surface-alt': '#2A1448',
    '--surface-card': '#160C26',
    '--primary-anchor': '#FAF5FF',
    '--primary-text': '#FAF5FF',
    '--text-secondary': '#E9D5FF',
    '--text-muted': '#A855F7',
    '--text-status-healthy': '#00F0FF',
    '--accent-coral': '#FF007F',
    '--accent-mustard': '#FFE600',
    '--accent-seafoam': '#00F0FF',
    '--accent-periwinkle': '#BD00FF',
    '--accent-blush': '#FF2A85',
    '--color-background-main': '#0B0614',
    '--color-primary-mint': '#00F0FF',
  },
};

export const SUNSET_TERRACOTTA_THEME: ThemePreset = {
  id: 'sunset_terracotta',
  name: 'Sunset / Terracotta',
  category: 'Specialty',
  description: 'Warm dusk charcoal surfaces with burnt orange, coral, and goldenrod highlights.',
  isDark: true,
  accentColor: '255 107 74',
  preview: {
    bg: '#181314',
    card: '#241C1E',
    accent: '#FF6B4A',
    text: '#FFF1EE',
  },
  colors: {
    '--bg-base': '#181314',
    '--surface': '#241C1E',
    '--surface-soft': '#140F10',
    '--surface-alt': '#382A2D',
    '--surface-card': '#241C1E',
    '--primary-anchor': '#FFF1EE',
    '--primary-text': '#FFF1EE',
    '--text-secondary': '#F5CAC2',
    '--text-muted': '#B58781',
    '--text-status-healthy': '#FF6B4A',
    '--accent-seafoam': '#FF6B4A',
    '--accent-coral': '#FF7F66',
    '--accent-mustard': '#F59E0B',
    '--accent-periwinkle': '#E07A5F',
    '--accent-blush': '#F28482',
    '--color-background-main': '#181314',
    '--color-primary-mint': '#FF6B4A',
  },
};

export const SYSTEM_DEFAULT_THEME: ThemePreset = {
  id: 'system_default',
  name: 'System Default',
  category: 'System',
  description: 'Automatically syncs with the user\'s OS prefers-color-scheme media query.',
  isDark: false, // dynamically resolved
  accentColor: '13 148 136',
  preview: {
    bg: '#FFFFFF',
    card: '#F8FAFC',
    accent: '#38BDF8',
    text: '#0F172A',
  },
  colors: CRISP_DAYLIGHT_THEME.colors,
};

export const ALL_THEMES: ThemePreset[] = [
  SYSTEM_DEFAULT_THEME,
  CRISP_DAYLIGHT_THEME,
  WARM_PAPER_THEME,
  MATCHA_BOTANICAL_THEME,
  MIDNIGHT_SLATE_THEME,
  OLED_PITCH_BLACK_THEME,
  NORD_ARCTIC_THEME,
  CYBERPUNK_SYNTHWAVE_THEME,
  SUNSET_TERRACOTTA_THEME,
];

// Backwards compatibility map for legacy IDs
const THEME_ALIASES: Record<string, string> = {
  system: 'system_default',
  cream_butter: 'warm_paper',
  retro_paper: 'warm_paper',
  forest_zen: 'matcha_botanical',
  cosmic_cyber: 'cyberpunk_synthwave',
  classic_obsidian: 'oled_pitch_black',
};

export function normalizeThemeId(themeId?: string | null): string {
  if (!themeId) return 'system_default';
  return THEME_ALIASES[themeId] || themeId;
}

export function isSystemDarkPreferred(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function getResolvedTheme(themeId?: string | null): ThemePreset {
  const normalized = normalizeThemeId(themeId);

  if (normalized === 'system_default') {
    const isDark = isSystemDarkPreferred();
    // In light mode -> Crisp Daylight; in dark mode -> Midnight Slate
    const baseTheme = isDark ? MIDNIGHT_SLATE_THEME : CRISP_DAYLIGHT_THEME;
    return {
      ...SYSTEM_DEFAULT_THEME,
      isDark,
      accentColor: baseTheme.accentColor,
      preview: baseTheme.preview,
      colors: baseTheme.colors,
    };
  }

  const found = ALL_THEMES.find((t) => t.id === normalized);
  return found || CRISP_DAYLIGHT_THEME;
}

// Global active theme cleanup listener reference
let _systemThemeMediaQueryCleanup: (() => void) | null = null;

export function applyAppTheme(
  themeId?: string | null,
  customAccentColor?: string,
  _cornerRoundness?: 'sharp' | 'medium' | 'soft',
  _borderStyle?: 'invisible' | 'subtle' | 'solid' | 'neon'
): void {
  if (typeof document === 'undefined') return;

  // Clean up any previously attached system theme listener
  if (_systemThemeMediaQueryCleanup) {
    _systemThemeMediaQueryCleanup();
    _systemThemeMediaQueryCleanup = null;
  }

  const applyColors = () => {
    const resolved = getResolvedTheme(themeId);
    const root = document.documentElement;

    // Apply CSS variables from theme
    Object.entries(resolved.colors).forEach(([cssVar, colorVal]) => {
      root.style.setProperty(cssVar, colorVal);
    });

    // Custom accent override if user chose one
    if (customAccentColor) {
      root.style.setProperty('--color-primary-mint', customAccentColor);
      root.style.setProperty('--accent-seafoam', customAccentColor);
    }

    // Toggle dark class for dark mode tailwind styles
    root.classList.toggle('dark', resolved.isDark);

    // Ensure document and body backgrounds match immediately
    const bgVal = resolved.colors['--color-background-main'];
    const textVal = resolved.colors['--primary-anchor'];
    root.style.backgroundColor = bgVal;
    root.style.color = textVal;
    if (document.body) {
      document.body.style.backgroundColor = bgVal;
      document.body.style.color = textVal;
    }

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', bgVal);
    }
  };

  // Initial application
  applyColors();

  // If System Default is chosen, listen to system dark mode change events
  const normalized = normalizeThemeId(themeId);
  if (normalized === 'system_default' && typeof window !== 'undefined' && window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      applyColors();
    };

    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
      _systemThemeMediaQueryCleanup = () => mq.removeEventListener('change', handler);
    } else if ((mq as any).addListener) {
      (mq as any).addListener(handler);
      _systemThemeMediaQueryCleanup = () => (mq as any).removeListener(handler);
    }
  }
}
