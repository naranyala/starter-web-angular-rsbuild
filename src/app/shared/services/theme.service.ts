import { computed, Injectable, signal } from '@angular/core';

export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  isDark: boolean;
}

export const THEMES: Theme[] = [
  { name: 'Light', primary: '#0f3460', secondary: '#e94560', isDark: false },
  { name: 'Dark', primary: '#16213e', secondary: '#0f3460', isDark: true },
  { name: 'Ocean', primary: '#0077b6', secondary: '#00b4d8', isDark: false },
  { name: 'Forest', primary: '#2d6a4f', secondary: '#40916c', isDark: false },
];

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentThemeIndex = signal(0);

  readonly currentTheme = computed(() => THEMES[this.currentThemeIndex()]);
  readonly isDarkMode = computed(() => this.currentTheme().isDark);
  readonly availableThemes = THEMES;

  setTheme(themeName: string): boolean {
    const index = THEMES.findIndex(t => t.name === themeName);
    if (index !== -1) {
      this.currentThemeIndex.set(index);
      this.applyTheme(THEMES[index]);
      return true;
    }
    return false;
  }

  toggleDarkMode(): void {
    const currentIndex = this.currentThemeIndex();
    const currentTheme = THEMES[currentIndex];

    // Find a theme with opposite dark/light mode
    const targetIndex = THEMES.findIndex(t => t.isDark !== currentTheme.isDark);
    if (targetIndex !== -1) {
      this.currentThemeIndex.set(targetIndex);
      this.applyTheme(THEMES[targetIndex]);
    }
  }

  nextTheme(): void {
    const currentIndex = this.currentThemeIndex();
    const nextIndex = (currentIndex + 1) % THEMES.length;
    this.currentThemeIndex.set(nextIndex);
    this.applyTheme(THEMES[nextIndex]);
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-secondary', theme.secondary);
    root.setAttribute('data-theme', theme.name.toLowerCase());
  }
}
