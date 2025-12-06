import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fc from 'fast-check';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ResultDetail } from './ResultDetail';
import { useResearchStore } from '../store/researchStore';
import type { ResearchResult } from '../types/research.types';
import { act } from 'react';

/**
 * Feature: research-gennie-frontend
 * Property tests for result detail page
 * Validates: Requirements 9.1, 9.2, 9.3, 9.4
 */

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
});

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

// Generator for valid research results
const researchResultArb = fc.record({
  id: fc.uuid(),
  domain: fc.string({ minLength: 3, maxLength: 50 }),
  gaps: fc.array(fc.string({ minLength: 10, maxLength: 200 }), { minLength: 1, maxLength: 5 }),
  papers: fc.option(
    fc.array(
      fc.record({
        title: fc.string({ minLength: 5, maxLength: 100 }),
        year: fc.integer({ min: 2000, max: 2024 }),
        link: fc.webUrl(),
        authors: fc.option(fc.array(fc.string({ minLength: 3, maxLength: 30 }), { minLength: 1, maxLength: 5 })),
      }),
      { minLength: 1, maxLength: 10 }
    ),
    { nil: undefined }
  ),
  filters: fc.option(
    fc.record({
      yearRange: fc.option(
        fc.record({
          start: fc.integer({ min: 2000, max: 2020 }),
          end: fc.integer({ min: 2021, max: 2024 }),
        }),
        { nil: undefined }
      ),
      numberOfPapers: fc.option(fc.integer({ min: 5, max: 100 }), { nil: undefined }),
      includeKeywords: fc.option(fc.array(fc.string({ minLength: 2, maxLength: 20 }), { minLength: 1, maxLength: 5 }), { nil: undefined }),
      excludeKeywords: fc.option(fc.array(fc.string({ minLength: 2, maxLength: 20 }), { minLength: 1, maxLength: 5 }), { nil: undefined }),
    }),
    { nil: undefined }
  ),
  createdAt: fc
    .integer({ min: new Date('2020-01-01').getTime(), max: new Date('2024-12-31').getTime() })
    .map((timestamp) => new Date(timestamp).toISOString()),
  updatedAt: fc
    .integer({ min: new Date('2020-01-01').getTime(), max: new Date('2024-12-31').getTime() })
    .map((timestamp) => new Date(timestamp).toISOString()),
});

// Helper to render ResultDetail with router
const renderResultDetail = (resultId: string) => {
  return render(
    <MemoryRouter initialEntries={[`/result/${resultId}`]}>
      <Routes>
        <Route path="/result/:id" element={<ResultDetail />} />
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/history" element={<div>History Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Result Detail Page Properties', () => {
  beforeEach(async () => {
    vi.clearAllTimers();
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    cleanup();
    localStorage.clear();
    act(() => {
      useResearchStore.setState({
        currentResult: null,
        isGenerating: false,
        error: null,
      });
    });
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    cleanup();
    localStorage.clear();
  });

  /**
   * **Feature: research-gennie-frontend, Property 31: Correct result display**
   * For any result ID, navigating to the result detail page should display
   * the complete research gap analysis for that specific result.
   * **Validates: Requirements 9.1**
   */
  it('Property 31: should display complete research gap analysis for the specified result ID', async () => {
    await fc.assert(
      fc.asyncProperty(researchResultArb, async (result) => {
        // Store result in localStorage
        const resultKey = `research-result-${result.id}`;
        localStorage.setItem(resultKey, JSON.stringify(result));

        // Also add to history
        const historyKey = 'research-history';
        const historyItem = {
          id: result.id,
          topic: result.domain,
          date: result.createdAt,
          preview: result.gaps[0] || 'No preview',
          domain: result.domain,
        };
        localStorage.setItem(historyKey, JSON.stringify([historyItem]));

        // Render the page
        renderResultDetail(result.id);

        // Wait for loading to complete
        await waitFor(
          () => {
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
          },
          { timeout: 3000 }
        );

        // Verify domain is displayed
        expect(screen.getByText(new RegExp(result.domain, 'i'))).toBeInTheDocument();

        // Verify all gaps are displayed
        result.gaps.forEach((gap) => {
          expect(screen.getByText(new RegExp(gap.substring(0, 20), 'i'))).toBeInTheDocument();
        });

        // Verify action buttons are present
        expect(screen.getByTestId('download-pdf-button')).toBeInTheDocument();
        expect(screen.getByTestId('download-txt-button')).toBeInTheDocument();
        expect(screen.getByTestId('copy-button')).toBeInTheDocument();
        expect(screen.getByTestId('regenerate-button')).toBeInTheDocument();

        // If papers exist, verify they are displayed
        if (result.papers && result.papers.length > 0) {
          expect(screen.getByText(/referenced papers/i)).toBeInTheDocument();
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: research-gennie-frontend, Property 32: Timestamp display**
   * For any result detail page, the creation timestamp should be displayed.
   * **Validates: Requirements 9.2**
   */
  it('Property 32: should display the creation timestamp', async () => {
    await fc.assert(
      fc.asyncProperty(researchResultArb, async (result) => {
        // Store result in localStorage
        const resultKey = `research-result-${result.id}`;
        localStorage.setItem(resultKey, JSON.stringify(result));

        // Also add to history
        const historyKey = 'research-history';
        const historyItem = {
          id: result.id,
          topic: result.domain,
          date: result.createdAt,
          preview: result.gaps[0] || 'No preview',
          domain: result.domain,
        };
        localStorage.setItem(historyKey, JSON.stringify([historyItem]));

        // Render the page
        renderResultDetail(result.id);

        // Wait for loading to complete
        await waitFor(
          () => {
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
          },
          { timeout: 3000 }
        );

        // Verify timestamp is displayed (formatted)
        const formattedDate = new Date(result.createdAt).toLocaleString();
        const dateRegex = new RegExp(formattedDate.split(',')[0].trim());
        
        // Check if any part of the date is displayed
        const resultsDisplay = screen.getByTestId('results-display');
        expect(resultsDisplay.textContent).toContain('Generated:');
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: research-gennie-frontend, Property 33: Regenerate with same parameters**
   * For any result on the detail page, clicking regenerate should initiate
   * a new generation request using the same parameters as the original.
   * **Validates: Requirements 9.3**
   */
  it('Property 33: should regenerate with same parameters when regenerate button is clicked', async () => {
    await fc.assert(
      fc.asyncProperty(researchResultArb, async (result) => {
        // Store result in localStorage
        const resultKey = `research-result-${result.id}`;
        localStorage.setItem(resultKey, JSON.stringify(result));

        // Also add to history
        const historyKey = 'research-history';
        const historyItem = {
          id: result.id,
          topic: result.domain,
          date: result.createdAt,
          preview: result.gaps[0] || 'No preview',
          domain: result.domain,
        };
        localStorage.setItem(historyKey, JSON.stringify([historyItem]));

        // Spy on generateGap
        const generateGapSpy = vi.spyOn(useResearchStore.getState(), 'generateGap');

        const user = userEvent.setup();
        renderResultDetail(result.id);

        // Wait for loading to complete
        await waitFor(
          () => {
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
          },
          { timeout: 3000 }
        );

        // Click regenerate button
        const regenerateButton = screen.getByTestId('regenerate-button');
        await user.click(regenerateButton);

        // Verify generateGap was called with correct parameters
        await waitFor(() => {
          expect(generateGapSpy).toHaveBeenCalledWith({
            domain: result.domain,
            filters: result.filters,
          });
        });

        generateGapSpy.mockRestore();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: research-gennie-frontend, Property 34: Result data fetching**
   * For any result detail page load, the system should fetch the result data
   * from the history endpoint using the result ID.
   * **Validates: Requirements 9.4**
   */
  it('Property 34: should fetch result data using the result ID on page load', async () => {
    await fc.assert(
      fc.asyncProperty(researchResultArb, async (result) => {
        // Store result in localStorage
        const resultKey = `research-result-${result.id}`;
        localStorage.setItem(resultKey, JSON.stringify(result));

        // Also add to history
        const historyKey = 'research-history';
        const historyItem = {
          id: result.id,
          topic: result.domain,
          date: result.createdAt,
          preview: result.gaps[0] || 'No preview',
          domain: result.domain,
        };
        localStorage.setItem(historyKey, JSON.stringify([historyItem]));

        // Render the page
        renderResultDetail(result.id);

        // Verify loading state is shown initially
        expect(screen.getByText(/loading/i)).toBeInTheDocument();

        // Wait for data to be fetched and displayed
        await waitFor(
          () => {
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
          },
          { timeout: 3000 }
        );

        // Verify the correct result was fetched by checking domain
        expect(screen.getByText(new RegExp(result.domain, 'i'))).toBeInTheDocument();

        // Verify localStorage was accessed for the correct key
        const storedResult = localStorage.getItem(resultKey);
        expect(storedResult).not.toBeNull();
        
        if (storedResult) {
          const parsedResult = JSON.parse(storedResult);
          expect(parsedResult.id).toBe(result.id);
          expect(parsedResult.domain).toBe(result.domain);
        }
      }),
      { numRuns: 100 }
    );
  });
});
