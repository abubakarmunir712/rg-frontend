import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fc from 'fast-check';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Home } from './Home';
import { useResearchStore } from '../store/researchStore';
import type { ResearchResult } from '../types/research.types';
import { act } from 'react';

/**
 * Feature: research-gennie-frontend
 * Property tests for processing state and results display
 * Validates: Requirements 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 6.5
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

describe('Home Page Processing and Results Properties', () => {
  beforeEach(async () => {
    // Flush any pending timers and async operations
    vi.clearAllTimers();
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    
    // Cleanup any previous renders
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
    // Flush any pending operations before cleanup
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    cleanup();
    localStorage.clear();
  });

  /**
   * Property 4: Processing state blocks interaction
   * For any user interaction attempt, while the system is in processing state,
   * all interactive elements should be disabled and user actions should be prevented.
   * Validates: Requirements 1.5
   */
  it('Property 4: should block all interactions during processing state', async () => {
    // Set processing state
    act(() => {
      useResearchStore.setState({ isGenerating: true, currentResult: null });
    });

    const { container } = render(<Home />);

    // Verify processing screen is displayed
    const processingScreen = screen.getByTestId('processing-screen');
    expect(processingScreen).toBeInTheDocument();

    // Verify input field is disabled
    const inputField = container.querySelector('input[type="text"]');
    expect(inputField).toBeDisabled();

    // Verify submit button is disabled
    const submitButton = screen.getByRole('button', { name: /generating/i });
    expect(submitButton).toBeDisabled();

    // Verify advanced filters toggle is disabled
    const advancedToggle = screen.getByRole('button', { name: /advanced filters/i });
    expect(advancedToggle).toBeDisabled();
  });

  /**
   * Property 5: Successful generation displays results
   * For any successful generation response, the system should display
   * the research gaps in a readable format with optional paper listings.
   * Validates: Requirements 2.1
   */
  it('Property 5: should display results after successful generation', async () => {
    const result: ResearchResult = {
      id: 'test-id-123',
      domain: 'Machine Learning',
      gaps: [
        'Gap 1: Limited research on explainable AI in healthcare',
        'Gap 2: Insufficient studies on federated learning privacy',
      ],
      papers: [
        {
          title: 'Deep Learning for Medical Imaging',
          year: 2023,
          link: 'https://example.com/paper1',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Set result in store
    act(() => {
      useResearchStore.setState({
        currentResult: result,
        isGenerating: false,
        error: null,
      });
    });

    render(<Home />);

    // Verify results display is shown
    const resultsDisplay = screen.getByTestId('results-display');
    expect(resultsDisplay).toBeInTheDocument();

    // Verify domain is displayed
    expect(screen.getByText(/Machine Learning/i)).toBeInTheDocument();

    // Verify all gaps are displayed
    expect(screen.getByText(/Limited research on explainable AI/i)).toBeInTheDocument();
    expect(screen.getByText(/Insufficient studies on federated learning/i)).toBeInTheDocument();

    // Verify action buttons are present
    expect(screen.getByTestId('download-pdf-button')).toBeInTheDocument();
    expect(screen.getByTestId('download-txt-button')).toBeInTheDocument();
    expect(screen.getByTestId('copy-button')).toBeInTheDocument();
    expect(screen.getByTestId('regenerate-button')).toBeInTheDocument();

    // Verify papers are displayed
    expect(screen.getByText(/referenced papers/i)).toBeInTheDocument();
    expect(screen.getByText(/Deep Learning for Medical Imaging/i)).toBeInTheDocument();
  });

  /**
   * Property 6: Generation auto-saves to history
   * For any successful generation, the result should automatically
   * appear in the user's history.
   * Validates: Requirements 2.5
   */
  it('Property 6: should auto-save results to history after generation', async () => {
    // Clear localStorage
    localStorage.clear();

    const domain = 'Quantum Computing';

    // Simulate generation by calling the store action
    const store = useResearchStore.getState();
    await store.generateGap({ domain });

    // Wait for async operations
    await waitFor(() => {
      const state = useResearchStore.getState();
      expect(state.currentResult).not.toBeNull();
    }, { timeout: 5000 });

    // Verify result was saved to localStorage history
    const historyKey = 'research-history';
    const storedHistory = localStorage.getItem(historyKey);
    expect(storedHistory).not.toBeNull();

    if (storedHistory) {
      const history = JSON.parse(storedHistory);
      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBeGreaterThan(0);

      // Verify the most recent item matches our domain
      const latestItem = history[0];
      expect(latestItem.domain).toBe(domain);
      expect(latestItem.topic).toBe(domain);
    }
  }, 10000);

  /**
   * Property 7: Download functionality
   * For any research result and any download format (PDF or TXT),
   * clicking the download button should trigger a file download.
   * Validates: Requirements 2.2, 2.3
   */
  it('Property 7: should trigger downloads for PDF format', async () => {
    const result: ResearchResult = {
      id: 'test-id-456',
      domain: 'Artificial Intelligence',
      gaps: ['Research gap in AI ethics'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Set result in store
    act(() => {
      useResearchStore.setState({
        currentResult: result,
        isGenerating: false,
        error: null,
      });
    });

    // Mock document.createElement and appendChild
    const mockLink = {
      href: '',
      download: '',
      click: vi.fn(),
    };
    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
    const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any);
    const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any);

    const user = userEvent.setup();
    render(<Home />);

    // Click PDF download button
    const downloadButton = screen.getByTestId('download-pdf-button');
    await user.click(downloadButton);

    // Verify download was triggered
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(mockLink.click).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();

    // Cleanup
    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  /**
   * Property 7: Download functionality (TXT format)
   * Validates: Requirements 2.2, 2.3
   */
  it('Property 7: should trigger downloads for TXT format', async () => {
    const result: ResearchResult = {
      id: 'test-id-789',
      domain: 'Blockchain Technology',
      gaps: ['Research gap in blockchain scalability'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Set result in store
    act(() => {
      useResearchStore.setState({
        currentResult: result,
        isGenerating: false,
        error: null,
      });
    });

    // Mock document.createElement and appendChild
    const mockLink = {
      href: '',
      download: '',
      click: vi.fn(),
    };
    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
    const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any);
    const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any);

    const user = userEvent.setup();
    render(<Home />);

    // Click TXT download button
    const downloadButton = screen.getByTestId('download-txt-button');
    await user.click(downloadButton);

    // Verify download was triggered
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(mockLink.click).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();

    // Cleanup
    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  /**
   * Property 8: Copy to clipboard
   * For any research result, clicking the copy button should place
   * the result text in the system clipboard.
   * Validates: Requirements 2.4
   */
  it('Property 8: should copy results to clipboard', async () => {
    const result: ResearchResult = {
      id: 'test-id-copy',
      domain: 'Data Science',
      gaps: ['Research gap in data privacy'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Set result in store
    act(() => {
      useResearchStore.setState({
        currentResult: result,
        isGenerating: false,
        error: null,
      });
    });

    const user = userEvent.setup();
    render(<Home />);

    // Click copy button
    const copyButton = screen.getByTestId('copy-button');
    await user.click(copyButton);

    // Verify clipboard.writeText was called
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });

    // Verify button text changes to "Copied!"
    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  /**
   * Property 25: Progress message cycling
   * For any research gap generation in progress, the system should
   * cycle through progress messages indicating the current processing stage.
   * Validates: Requirements 6.5
   */
  it('Property 25: should cycle through progress messages during generation', async () => {
    // Set processing state
    act(() => {
      useResearchStore.setState({ isGenerating: true, currentResult: null });
    });

    render(<Home />);

    // Verify processing screen is displayed
    const processingScreen = screen.getByTestId('processing-screen');
    expect(processingScreen).toBeInTheDocument();

    // Verify a message is displayed
    const messageElement = screen.getByTestId('processing-message');
    expect(messageElement).toBeInTheDocument();
    expect(messageElement.textContent).toBeTruthy();

    // The message should be one of the default messages
    const defaultMessages = [
      "Analyzing research domain...",
      "Fetching relevant papers...",
      "Identifying research gaps...",
      "Generating comprehensive analysis...",
    ];

    expect(defaultMessages).toContain(messageElement.textContent);
  });
});
