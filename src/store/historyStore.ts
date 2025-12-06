import { create } from 'zustand';
import type { HistoryItem, SortOption } from '../types/research.types';
import { generateMockHistory } from '../utils/mockData';

interface HistoryState {
  items: HistoryItem[];
  isLoading: boolean;
  searchQuery: string;
  sortBy: SortOption;
  fetchHistory: () => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: SortOption) => void;
  getFilteredAndSortedItems: () => HistoryItem[];
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  items: [],
  isLoading: false,
  searchQuery: '',
  sortBy: 'newest',

  fetchHistory: async () => {
    set({ isLoading: true });

    try {
      // Try to get history from localStorage first
      const historyKey = 'research-history';
      const existingHistory = localStorage.getItem(historyKey);

      let items: HistoryItem[];

      if (existingHistory) {
        items = JSON.parse(existingHistory);
      } else {
        // Generate mock history if none exists
        items = generateMockHistory(10);
        localStorage.setItem(historyKey, JSON.stringify(items));
      }

      set({ items, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch history:', error);
      set({ isLoading: false });
    }
  },

  deleteItem: async (id: string) => {
    const { items } = get();
    const updatedItems = items.filter((item) => item.id !== id);

    set({ items: updatedItems });

    // Update localStorage
    const historyKey = 'research-history';
    localStorage.setItem(historyKey, JSON.stringify(updatedItems));
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  setSortBy: (sortBy: SortOption) => set({ sortBy }),

  getFilteredAndSortedItems: () => {
    const { items, searchQuery, sortBy } = get();

    // Filter by search query
    let filtered = items;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = items.filter(
        (item) =>
          item.topic.toLowerCase().includes(query) ||
          item.domain.toLowerCase().includes(query) ||
          item.preview.toLowerCase().includes(query)
      );
    }

    // Sort items
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'topic':
          return a.topic.localeCompare(b.topic);
        default:
          return 0;
      }
    });

    return sorted;
  },
}));
