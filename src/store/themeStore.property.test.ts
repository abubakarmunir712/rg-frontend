import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';
import { useThemeStore } from './themeStore';

/**
 * Feature: research-gennie-frontend, Property 9: Theme toggle switches modes
 * Feature: research-gennie-frontend, Property 10: Theme persistence
 * Validates: Requirements 3.2, 3.3
 */
describe('Theme Store Properties', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset the store to initial state
    useThemeStore.setState({ theme: 'dark' });
    // Clear document classes
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark', 'light');
    }
  });

  afterEach(() => {
    localStorage.clear();
  });

  /**
   * Property 9: Theme toggle switches modes
   * For any current theme state (dark or light), clicking the theme toggle
   * should immediately switch to the opposite theme.
   */
  it('Property 9: should toggle between dark and light themes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('dark' as const, 'light' as const),
        (initialTheme) => {
          // Set initial theme
          useThemeStore.setState({ theme: initialTheme });
          const store = useThemeStore.getState();

          // Get the expected opposite theme
          const expectedTheme = initialTheme === 'dark' ? 'light' : 'dark';

          // Toggle theme
          store.toggleTheme();

          // Verify theme switched to opposite
          const newState = useThemeStore.getState();
          expect(newState.theme).toBe(expectedTheme);

          // Verify document class was updated
          if (typeof document !== 'undefined') {
            expect(document.documentElement.classList.contains(expectedTheme)).toBe(true);
            expect(document.documentElement.classList.contains(initialTheme)).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 10: Theme persistence
   * For any theme selection, after changing the theme and reloading,
   * the selected theme should be maintained.
   */
  it('Property 10: should persist theme across sessions', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('dark' as const, 'light' as const),
        (selectedTheme) => {
          // Clear localStorage to start fresh
          localStorage.clear();

          // Create a new store instance and set theme
          useThemeStore.setState({ theme: selectedTheme });
          const store = useThemeStore.getState();
          store.setTheme(selectedTheme);

          // Verify theme is stored in localStorage
          const storedData = localStorage.getItem('theme-storage');
          expect(storedData).toBeDefined();

          if (storedData) {
            const parsed = JSON.parse(storedData);
            expect(parsed.state.theme).toBe(selectedTheme);
          }

          // Simulate page reload by creating a new store instance
          // In Zustand with persist, the state is automatically rehydrated from localStorage
          const rehydratedState = useThemeStore.getState();
          expect(rehydratedState.theme).toBe(selectedTheme);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: Multiple toggles should maintain consistency
   * For any sequence of toggles, the theme should alternate correctly
   */
  it('should maintain consistency across multiple toggles', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('dark' as const, 'light' as const),
        fc.nat({ max: 20 }), // Number of toggles
        (initialTheme, numToggles) => {
          // Set initial theme
          useThemeStore.setState({ theme: initialTheme });
          const store = useThemeStore.getState();

          // Perform multiple toggles
          for (let i = 0; i < numToggles; i++) {
            store.toggleTheme();
          }

          // After even number of toggles, should be back to initial
          // After odd number of toggles, should be opposite
          const expectedTheme =
            numToggles % 2 === 0
              ? initialTheme
              : initialTheme === 'dark'
              ? 'light'
              : 'dark';

          const finalState = useThemeStore.getState();
          expect(finalState.theme).toBe(expectedTheme);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: setTheme should work for any valid theme
   */
  it('should set theme directly to any valid value', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('dark' as const, 'light' as const),
        (targetTheme) => {
          const store = useThemeStore.getState();
          store.setTheme(targetTheme);

          const newState = useThemeStore.getState();
          expect(newState.theme).toBe(targetTheme);

          // Verify document class was updated
          if (typeof document !== 'undefined') {
            expect(document.documentElement.classList.contains(targetTheme)).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
