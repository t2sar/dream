import React, { useState, useRef, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import {
  ALL_THEMES,
  ThemePreset,
  ThemeCategory,
  normalizeThemeId,
  isSystemDarkPreferred,
} from '../themeConfig';

interface AppearanceSettingsProps {
  currentThemeId?: string;
  onThemeChange: (themeId: string) => void;
}

export const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  currentThemeId,
  onThemeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const normalizedId = normalizeThemeId(currentThemeId);
  const currentTheme = ALL_THEMES.find((t) => t.id === normalizedId) || ALL_THEMES[0];
  const isSystemActive = normalizedId === 'system_default';
  const systemIsDark = isSystemDarkPreferred();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Group presets by category
  const categories: { label: string; category: ThemeCategory; icon: any }[] = [
    { label: 'System Sync', category: 'System', icon: LucideIcons.Laptop },
    { label: 'Light Palettes', category: 'Light', icon: LucideIcons.SunMedium },
    { label: 'Dark Palettes', category: 'Dark', icon: LucideIcons.Moon },
    { label: 'Specialty Palettes', category: 'Specialty', icon: LucideIcons.Sparkles },
  ];

  const getCategoryBadge = (category: ThemeCategory) => {
    switch (category) {
      case 'System':
        return (
          <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-indigo-500/15 text-indigo-500 border border-indigo-500/30 flex items-center gap-1">
            <LucideIcons.Laptop className="w-2.5 h-2.5" /> System
          </span>
        );
      case 'Light':
        return (
          <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <LucideIcons.SunMedium className="w-2.5 h-2.5" /> Light
          </span>
        );
      case 'Dark':
        return (
          <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-sky-500/15 text-sky-500 border border-sky-500/30 flex items-center gap-1">
            <LucideIcons.Moon className="w-2.5 h-2.5" /> Dark
          </span>
        );
      case 'Specialty':
        return (
          <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-fuchsia-500/15 text-fuchsia-500 border border-fuchsia-500/30 flex items-center gap-1">
            <LucideIcons.Sparkles className="w-2.5 h-2.5" /> Specialty
          </span>
        );
    }
  };

  return (
    <div className="bg-[var(--surface-alt)]/50 border-0 p-6 rounded-[32px] mb-6 shadow-sm transition-all hover:bg-[var(--surface-alt)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-seafoam)]/20 flex items-center justify-center text-[var(--accent-seafoam)]">
              <LucideIcons.Palette className="w-4 h-4" />
            </div>
            <h3 className="text-[var(--primary-anchor)] font-bold text-base">
              Appearance & Theme
            </h3>
          </div>
          <p className="text-[var(--text-muted)] font-medium text-xs mt-1 max-w-sm">
            Personalize your garden theme with 9 curated presets across Light, Dark, and Specialty palettes.
          </p>
        </div>

        {/* Compact Dropdown Menu with Theme Badges */}
        <div className="relative min-w-[240px]" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            className="w-full flex items-center justify-between gap-3 bg-[var(--surface)] text-[var(--primary-anchor)] font-bold text-sm px-4 py-2.5 rounded-2xl border-2 border-[var(--surface-alt)] hover:border-[var(--accent-seafoam)]/60 focus:outline-none transition-all shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-2.5 truncate">
              {/* Palette dots */}
              <div className="flex items-center -space-x-1.5 shrink-0">
                <div
                  className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                  style={{ backgroundColor: currentTheme.preview.bg }}
                  title="Background"
                />
                <div
                  className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                  style={{ backgroundColor: currentTheme.preview.card }}
                  title="Surface"
                />
                <div
                  className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                  style={{ backgroundColor: currentTheme.preview.accent }}
                  title="Accent"
                />
              </div>

              <span className="truncate text-xs font-bold tracking-tight">
                {currentTheme.name}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {getCategoryBadge(currentTheme.category)}
              <LucideIcons.ChevronDown
                className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {/* Dropdown Popover */}
          {isOpen && (
            <div
              role="listbox"
              className="absolute right-0 left-0 sm:left-auto sm:w-[320px] mt-2 z-50 bg-[var(--surface)] border-2 border-[var(--surface-alt)] rounded-2xl shadow-xl max-h-[380px] overflow-y-auto p-2 scrollbar-thin backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
            >
              {categories.map(({ label, category, icon: CatIcon }) => {
                const themesInCategory = ALL_THEMES.filter((t) => t.category === category);
                if (themesInCategory.length === 0) return null;

                return (
                  <div key={category} className="mb-2 last:mb-0">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-80">
                      <CatIcon className="w-3 h-3" />
                      <span>{label}</span>
                    </div>

                    <div className="space-y-1">
                      {themesInCategory.map((theme) => {
                        const isSelected = normalizedId === theme.id;
                        return (
                          <button
                            key={theme.id}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => {
                              onThemeChange(theme.id);
                              setIsOpen(false);
                            }}
                            className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[var(--accent-seafoam)]/15 border border-[var(--accent-seafoam)]/30 text-[var(--primary-anchor)]'
                                : 'hover:bg-[var(--surface-alt)]/60 text-[var(--primary-anchor)] border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              {/* Preview chips */}
                              <div className="flex items-center -space-x-1 shrink-0">
                                <div
                                  className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                                  style={{ backgroundColor: theme.preview.bg }}
                                />
                                <div
                                  className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                                  style={{ backgroundColor: theme.preview.card }}
                                />
                                <div
                                  className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                                  style={{ backgroundColor: theme.preview.accent }}
                                />
                              </div>

                              <div className="truncate">
                                <div className="text-xs font-bold leading-tight truncate">
                                  {theme.name}
                                </div>
                                <div className="text-[10px] text-[var(--text-muted)] font-medium leading-tight truncate">
                                  {theme.description}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {getCategoryBadge(theme.category)}
                              {isSelected && (
                                <LucideIcons.Check className="w-4 h-4 text-[var(--accent-seafoam)] shrink-0" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Dynamic status pill for System Default */}
      {isSystemActive && (
        <div className="mt-4 pt-3 border-t border-[var(--surface-alt)] flex items-center gap-2 text-[11px] font-semibold text-[var(--text-muted)]">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-seafoam)] animate-pulse" />
          <span>
            System sync active: rendering{' '}
            <strong className="text-[var(--primary-anchor)]">
              {systemIsDark ? 'Midnight Slate (Dark)' : 'Crisp Daylight (Light)'}
            </strong>{' '}
            based on your OS preference.
          </span>
        </div>
      )}
    </div>
  );
};
