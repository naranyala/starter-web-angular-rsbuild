import { beforeEach, describe, expect, test } from 'bun:test';
import { THEMES, ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    service = new ThemeService();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should have default theme as Light', () => {
    expect(service.currentTheme().name).toBe('Light');
    expect(service.isDarkMode()).toBe(false);
  });

  test('should have all available themes', () => {
    expect(service.availableThemes.length).toBe(4);
    expect(service.availableThemes).toEqual(THEMES);
  });

  test('should set theme successfully', () => {
    const result = service.setTheme('Dark');
    expect(result).toBe(true);
    expect(service.currentTheme().name).toBe('Dark');
    expect(service.isDarkMode()).toBe(true);
  });

  test('should return false when setting non-existent theme', () => {
    const result = service.setTheme('NonExistent');
    expect(result).toBe(false);
    expect(service.currentTheme().name).toBe('Light');
  });

  test('should toggle dark mode', () => {
    // Start with Light (not dark)
    expect(service.isDarkMode()).toBe(false);

    service.toggleDarkMode();
    expect(service.isDarkMode()).toBe(true);

    service.toggleDarkMode();
    expect(service.isDarkMode()).toBe(false);
  });

  test('should cycle through themes with nextTheme', () => {
    expect(service.currentTheme().name).toBe('Light');

    service.nextTheme();
    expect(service.currentTheme().name).toBe('Dark');

    service.nextTheme();
    expect(service.currentTheme().name).toBe('Ocean');

    service.nextTheme();
    expect(service.currentTheme().name).toBe('Forest');

    // Should wrap around
    service.nextTheme();
    expect(service.currentTheme().name).toBe('Light');
  });

  test('should apply theme CSS variables', () => {
    service.setTheme('Ocean');

    const root = document.documentElement;
    expect(root.style.getPropertyValue('--theme-primary')).toBe('#0077b6');
    expect(root.style.getPropertyValue('--theme-secondary')).toBe('#00b4d8');
    expect(root.getAttribute('data-theme')).toBe('ocean');
  });

  test('should compute isDarkMode based on current theme', () => {
    service.setTheme('Light');
    expect(service.isDarkMode()).toBe(false);

    service.setTheme('Dark');
    expect(service.isDarkMode()).toBe(true);

    service.setTheme('Ocean');
    expect(service.isDarkMode()).toBe(false);
  });
});
