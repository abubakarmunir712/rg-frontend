import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fc from 'fast-check';
import { AppRoutes } from './AppRoutes';
import { useAuthStore } from '../store/authStore';

/**
 * Feature: research-gennie-frontend, Property 13: SPA navigation without reload
 * Validates: Requirements 4.1
 */
describe('Property 13: SPA navigation without reload', () => {
  beforeEach(() => {
    // Clear auth state before each test
    useAuthStore.getState().logout();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('should navigate between valid routes without full page reload', () => {
    // Define valid public routes
    const validRoutes = fc.constantFrom(
      '/',
      '/about',
      '/login',
      '/register',
      '/forgot-password'
    );

    fc.assert(
      fc.property(validRoutes, (route) => {
        // Render the app with the route using MemoryRouter (SPA behavior)
        const { container } = render(
          <MemoryRouter initialEntries={[route]}>
            <AppRoutes />
          </MemoryRouter>
        );

        // Verify content is rendered (SPA successfully rendered)
        expect(container.firstChild).toBeTruthy();

        // Verify we're on a valid page (not 404)
        const notFoundHeading = screen.queryByText('404');
        expect(notFoundHeading).toBeNull();

        // Clean up after each property test iteration
        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it('should maintain SPA behavior when navigating between routes', () => {
    // Generate pairs of valid routes to test navigation
    const routePairs = fc.tuple(
      fc.constantFrom('/', '/about', '/login', '/register'),
      fc.constantFrom('/', '/about', '/login', '/register')
    );

    fc.assert(
      fc.property(routePairs, ([startRoute, endRoute]) => {
        // Render with multiple entries simulates navigation in SPA
        const { container } = render(
          <MemoryRouter initialEntries={[startRoute, endRoute]} initialIndex={1}>
            <AppRoutes />
          </MemoryRouter>
        );

        // Verify content is rendered at the end route
        expect(container.firstChild).toBeTruthy();

        // Verify we're on a valid page (not 404)
        const notFoundHeading = screen.queryByText('404');
        expect(notFoundHeading).toBeNull();

        // Clean up after each property test iteration
        cleanup();
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: research-gennie-frontend, Property 14: 404 handling for invalid routes
 * Validates: Requirements 4.3
 */
describe('Property 14: 404 handling for invalid routes', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('should display 404 page for any non-existent route', () => {
    // Generate random invalid routes
    const invalidRoutes = fc
      .string({ minLength: 1, maxLength: 50 })
      .filter((str) => {
        // Filter out valid routes and special characters that affect routing
        const validRoutes = [
          '/',
          '/about',
          '/login',
          '/register',
          '/forgot-password',
          '/history',
        ];
        const path = str.startsWith('/') ? str : `/${str}`;
        
        // Exclude hash routes, query params, and valid routes
        return (
          !validRoutes.includes(path) &&
          !path.startsWith('/result/') &&
          !path.includes('#') &&
          !path.includes('?')
        );
      })
      .map((str) => (str.startsWith('/') ? str : `/${str}`));

    fc.assert(
      fc.property(invalidRoutes, (route) => {
        render(
          <MemoryRouter initialEntries={[route]}>
            <AppRoutes />
          </MemoryRouter>
        );

        // Verify 404 page is displayed
        const notFoundHeading = screen.getByText('404');
        expect(notFoundHeading).toBeInTheDocument();

        // Verify navigation options are provided
        const homeLink = screen.getByText('Go to Home');
        expect(homeLink).toBeInTheDocument();
        expect(homeLink).toHaveAttribute('href', '/');

        // Clean up after each property test iteration
        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it('should provide navigation options on 404 page', () => {
    const invalidRoutes = fc
      .string({ minLength: 1, maxLength: 30 })
      .filter((str) => {
        // Exclude valid routes and special routing characters
        return (
          !['', 'about', 'login', 'register', 'history', 'forgot-password'].includes(str) &&
          !str.includes('#') &&
          !str.includes('?') &&
          !str.startsWith('result/')
        );
      })
      .map((str) => `/${str}`);

    fc.assert(
      fc.property(invalidRoutes, (route) => {
        render(
          <MemoryRouter initialEntries={[route]}>
            <AppRoutes />
          </MemoryRouter>
        );

        // Verify 404 content
        expect(screen.getByText('404')).toBeInTheDocument();
        expect(screen.getByText('Page not found')).toBeInTheDocument();

        // Verify navigation links exist
        const homeLink = screen.getByText('Go to Home');
        const aboutLink = screen.getByText('Learn More');

        expect(homeLink).toHaveAttribute('href', '/');
        expect(aboutLink).toHaveAttribute('href', '/about');

        // Clean up after each property test iteration
        cleanup();
      }),
      { numRuns: 100 }
    );
  });
});
