import { create } from 'zustand';
import type { ResearchResult, GenerateRequest } from '../types/research.types';
import { generateMockResearchResult, mockDelay } from '../utils/mockData';

interface ResearchState {
  currentResult: ResearchResult | null;
  isGenerating: boolean;
  error: string | null;
  generateGap: (request: GenerateRequest) => Promise<void>;
  clearResult: () => void;
}

export const useResearchStore = create<ResearchState>((set) => ({
  currentResult: null,
  isGenerating: false,
  error: null,

  generateGap: async (request: GenerateRequest) => {
    set({ isGenerating: true, error: null });

    try {
      // Simulate API call with 2-3 second delay
      await mockDelay(2000 + Math.random() * 1000);

      // Generate mock result
      const result = generateMockResearchResult(request.domain);

      // Apply filters if provided
      if (request.filters) {
        result.filters = request.filters;
      }

      set({ currentResult: result, isGenerating: false });

      // Store complete result for detail page access
      const resultKey = `research-result-${result.id}`;
      localStorage.setItem(resultKey, JSON.stringify(result));

      // Auto-save to history (will be handled by historyStore in real implementation)
      // For now, we'll just store it in localStorage
      const historyKey = 'research-history';
      const existingHistory = localStorage.getItem(historyKey);
      const history = existingHistory ? JSON.parse(existingHistory) : [];

      const historyItem = {
        id: result.id,
        topic: result.domain,
        date: result.createdAt,
        preview: result.gaps[0] || 'No preview available',
        domain: result.domain,
      };

      history.unshift(historyItem);
      localStorage.setItem(historyKey, JSON.stringify(history));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to generate research gaps',
        isGenerating: false,
      });
    }
  },

  clearResult: () => set({ currentResult: null, error: null }),
}));
