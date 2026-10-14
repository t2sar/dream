# Implementation Plan: 9 Built-in Theme Presets with Category Badges & OS Sync

## Problem Statement & User Intent
Users need rich aesthetic personalization for their habit tracking garden. We need to add 9 built-in theme presets categorized into **Light**, **Dark**, and **Specialty** palettes, along with a dynamic **System Default** mode that responds in real-time to OS `prefers-color-scheme` changes. Per user preference, the theme selector will be housed inside the **Settings** modal under an **Appearance** section, utilizing a **compact dropdown menu with categorized theme badges** and color palette previews.

## 9 Theme Presets Definition & Palette Taxonomy

### 1. Light Palettes
1. **System Default (`system_default`)**
   - Automatically detects OS light/dark mode (`window.matchMedia('(prefers-color-scheme: dark)')`)
   - Light fallback: Crisp Daylight; Dark fallback: Midnight Slate
   - Listens to system theme change events dynamically
2. **Crisp Daylight (`crisp_daylight`)**
   - Clean white surfaces (`#FFFFFF`), cool slate borders (`#E2E8F0`), high-contrast dark ink text (`#0F172A`), refreshing sky-blue and emerald accents
3. **Warm Paper / Sepia (`warm_paper`)**
   - Soft cream parchment background (`#FDFBF7`), warm espresso text (`#292524`), amber-tinted borders (`#E7E0D2`), terracotta and sage accents
4. **Matcha / Botanical (`matcha_botanical`)**
   - Sage-tinted light background (`#F4F7F4`), soft tea card surfaces (`#EAF0EA`), deep forest green text (`#1C3322`), leaf green accents

### 2. Dark Palettes
5. **Midnight Slate (`midnight_slate`)**
   - Deep charcoal-blue surfaces (`#0B101B`), card surface (`#151B2C`), crisp off-white text (`#F1F5F9`), cyan & cool slate accents
6. **OLED Pitch Black (`oled_pitch_black`)**
   - True `#000000` pitch black background, zinc cards (`#0A0A0A` to `#121212`), high-contrast pure white text (`#FFFFFF`), vibrant emerald accents
7. **Nord / Arctic (`nord_arctic`)**
   - Frosty blue-gray dark surfaces (`#242933` / `#2E3440`), soft glacier off-white text (`#ECEFF4`), muted cyan (`#88C0D0`) and ice blue (`#81A1C1`) highlights

### 3. Specialty Palettes
8. **Cyberpunk / Synthwave (`cyberpunk_neon`)**
   - Deep obsidian-violet background (`#08040F`), neon magenta (`#ED1E79`) and electric cyan (`#00F0FF`) accents, glowing violet surfaces (`#140B25`)
9. **Sunset / Terracotta (`sunset_terracotta`)**
   - Warm dusk charcoal surfaces (`#1A1412`), cards (`#251D19`), burnt orange (`#F97316`), coral (`#FB7185`), and goldenrod highlights

---

## Proposed Changes

### 1. Theme Configuration & Engine (`App.tsx` & Theme Definitions)
- Define `APP_THEMES` with full category metadata (`category: 'light' | 'dark' | 'specialty'`), descriptions, accent colors, preview color dots, and complete CSS variables:
  - `--color-background-main` / `--background`
  - `--color-surface-card` / `--surface`
  - `--color-surface-alt` / `--surface-alt`
  - `--color-surface-soft`
  - `--color-primary-text` / `--color-primary-anchor` / `--primary-anchor`
  - `--color-secondary-text` / `--text-secondary`
  - `--color-muted-text` / `--text-muted`
  - `--color-primary-mint` / `--accent-seafoam`
  - CSS root color-scheme property (`light` vs `dark`)
- Implement `applyAppTheme(themeId, customAccentColor, cornerRoundness, borderStyle)`:
  - For `system_default`, resolve effective theme based on `window.matchMedia('(prefers-color-scheme: dark)')`
  - Attach a matchMedia change listener to smoothly update styles when the OS switches between light and dark
  - Apply custom CSS variables directly to `document.documentElement`
  - Set `data-theme` attribute and `dark` class appropriately on `<html>` for Tailwind dark mode support

### 2. Appearance Section in Settings Modal (`App.tsx`)
- In the Settings modal, introduce a dedicated **Appearance** card:
  - Header with Palette icon, title, and descriptive subtitle
  - **Compact Dropdown Menu with Theme Badges**:
    - Grouped `<optgroup>` by **Light Palettes**, **Dark Palettes**, and **Specialty Palettes**
    - Showing active theme badge indicator (tagging as Light / Dark / Special / Auto)
    - Preview swatch row displaying the 4 core colors (Background, Surface, Accent, Text) of the currently selected theme
  - Live instantaneous switching on selection
  - Persists preference directly into `extraStats.themeId` through `persistData` (saving to Firestore and localStorage) to satisfy the **Absolute Data Preservation Rule**.

### 3. Data Safety & Version Bumping
- Increment `package.json` version (e.g. to `"1.0.5"`) per the **Automatic Version Bumping Rule**.
- Ensure state persistence cleanly maintains existing user habit logs, streak counts, and inventory without regression.

---

## Verification Plan

### Automated Tests & Compilation
- Run `compile_applet` to ensure zero TypeScript errors and clean bundle build.
- Run `lint_applet` to verify no import or syntax regressions.

### Manual Verification Steps
1. **Appearance Section Visibility**:
   - Open Settings modal; verify the "Appearance & Themes" section is clearly visible with category badges.
2. **Preset Switching**:
   - Test selecting each of the 9 themes (`crisp_daylight`, `warm_paper`, `matcha_botanical`, `midnight_slate`, `oled_pitch_black`, `nord_arctic`, `cyberpunk_neon`, `sunset_terracotta`, `system_default`).
   - Confirm background, cards, text, accents, and borders update instantaneously across the entire app.
3. **System Default Behavior**:
   - Choose "System Default"; verify it switches to light or dark matching system preferences, and updates dynamically.
4. **Data Preservation**:
   - Reload page / inspect persisted `extraStats` to verify selected `themeId` survives page reloads and synchronizes cleanly.
