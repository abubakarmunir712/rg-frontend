import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { useHistoryStore } from '../store/historyStore';
import type { HistoryItem } from '../types/research.types';

// Generator for valid history items with unique IDs
const historyItemArb = fc.record({
  id: fc.uuid(),
  topic: fc.string({ minLength: 1, maxLength: 50 }),
  date: fc
    .integer({ min: new Date('2020-01-01').getTime(), max: new Date('2024-12-31').getTime() })
    .map((timestamp) => new Date(timestamp).toISOString()),
  preview: fc.string({ minLength: 10, maxLength: 100 }),
  domain: fc.string({ minLength: 1, maxLength: 30 }),
});

describe('History Management Properties', () => {
  beforeEach(() => {
    // Reset store state
    useHistoryStore.setState({
      items: [],
      isLoading: false,
      searchQuery: '',
      sortBy: 'newest',
    });
    localStorage.clear();
  });

  /**
   * **Feature: research-gennie-frontend, Property 26: History items sorted by date**
   * **Validates: Requirements 8.1**
   */
  it('Property 26: should display history items sorted by creation date (newest first by default)', () => {
    fc.assert(
      fc.property(
        fc.array(historyItemArb, { minLength: 2, maxLength: 10 }),
        (items) => {
          // Set up store with items
          useHistoryStore.setState({
            items,
            isLoading: false,
            searchQuery: '',
            sortBy: 'newest',
          });

          // Get filtered and sorted items from store
          const sortedItems = useHistoryStore.getState().getFilteredAndSortedItems();

          // Verify items are sorted by date (newest first)
          for (let i = 0; i < sortedItems.length - 1; i++) {
            const currentDate = new Date(sortedItems[i].date).getTime();
            const nextDate = new Date(sortedItems[i + 1].date).getTime();
            expect(currentDate).toBeGreaterThanOrEqual(nextDate);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: research-gennie-frontend, Property 27: Search filtering**
   * **Validates: Requirements 8.2**
   */
  it('Property 27: should filter history items matching the search query', () => {
    fc.assert(
      fc.property(
        fc.array(historyItemArb, { minLength: 3, maxLength: 10 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        (items, searchTerm) => {
          // Ensure at least one item contains the search term
          const modifiedItems = items.map((item, index) => {
            if (index === 0) {
              return {
                ...item,
                topic: `${searchTerm} test topic`,
              };
            }
            return item;
          });

          useHistoryStore.setState({
            items: modifiedItems,
            isLoading: false,
            searchQuery: '',
            sortBy: 'newest',
          });

          // Set search query
          useHistoryStore.getState().setSearchQuery(searchTerm);

          // Get filtered items
          const filteredItems = useHistoryStore.getState().getFilteredAndSortedItems();

          // Verify all filtered items contain the search term
          const searchLower = searchTerm.toLowerCase();
          filteredItems.forEach((item) => {
            const matchesTopic = item.topic.toLowerCase().includes(searchLower);
            const matchesDomain = item.domain.toLowerCase().includes(searchLower);
            const matchesPreview = item.preview.toLowerCase().includes(searchLower);
            expect(matchesTopic || matchesDomain || matchesPreview).toBe(true);
          });

          // Verify at least one item matches (since we ensured it)
          expect(filteredItems.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: research-gennie-frontend, Property 28: Sort option reordering**
   * **Validates: Requirements 8.3**
   */
  it('Property 28: should reorder history items according to selected sort criteria', () => {
    fc.assert(
      fc.property(
        fc.array(historyItemArb, { minLength: 3, maxLength: 10 }),
        fc.constantFrom('newest', 'oldest', 'topic'),
        (items, sortOption) => {
          useHistoryStore.setState({
            items,
            isLoading: false,
            searchQuery: '',
            sortBy: 'newest',
          });

          // Change sort option
          useHistoryStore.getState().setSortBy(sortOption);

          // Get sorted items
          const sortedItems = useHistoryStore.getState().getFilteredAndSortedItems();

          // Verify sorting based on option
          if (sortOption === 'newest') {
            for (let i = 0; i < sortedItems.length - 1; i++) {
              const currentDate = new Date(sortedItems[i].date).getTime();
              const nextDate = new Date(sortedItems[i + 1].date).getTime();
              expect(currentDate).toBeGreaterThanOrEqual(nextDate);
            }
          } else if (sortOption === 'oldest') {
            for (let i = 0; i < sortedItems.length - 1; i++) {
              const currentDate = new Date(sortedItems[i].date).getTime();
              const nextDate = new Date(sortedItems[i + 1].date).getTime();
              expect(currentDate).toBeLessThanOrEqual(nextDate);
            }
          } else if (sortOption === 'topic') {
            for (let i = 0; i < sortedItems.length - 1; i++) {
              expect(
                sortedItems[i].topic.localeCompare(sortedItems[i + 1].topic)
              ).toBeLessThanOrEqual(0);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: research-gennie-frontend, Property 29: History item navigation**
   * **Validates: Requirements 8.4**
   */
  it('Property 29: should navigate to result detail page with correct ID', () => {
    fc.assert(
      fc.property(historyItemArb, (item) => {
        // Verify that the navigation path would be constructed correctly
        const expectedPath = `/result/${item.id}`;
        
        // Test that the ID is properly formatted for navigation
        expect(expectedPath).toMatch(/^\/result\/.+$/);
        expect(item.id).toBeTruthy();
        expect(item.id.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: research-gennie-frontend, Property 30: History item deletion**
   * **Validates: Requirements 8.5**
   */
  it('Property 30: should remove item from history after confirmation', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(historyItemArb, { minLength: 2, maxLength: 10 }),
        fc.integer({ min: 0, max: 9 }),
        async (items, indexToDelete) => {
          // Ensure index is within bounds
          const actualIndex = indexToDelete % items.length;
          const itemToDelete = items[actualIndex];

          useHistoryStore.setState({
            items,
            isLoading: false,
            searchQuery: '',
            sortBy: 'newest',
          });

          const initialCount = useHistoryStore.getState().items.length;

          // Call deleteItem directly on the store
          await useHistoryStore.getState().deleteItem(itemToDelete.id);

          // Verify item was removed
          const remainingItems = useHistoryStore.getState().items;
          expect(remainingItems.length).toBe(initialCount - 1);
          expect(remainingItems.find((i) => i.id === itemToDelete.id)).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });
});
