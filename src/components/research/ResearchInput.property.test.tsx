import { describe, it, expect, vi } from 'vitest';
import { render, cleanup, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fc from 'fast-check';
import { ResearchInput } from './ResearchInput';

/**
 * Feature: research-gennie-frontend, Property 3: Valid domain submission
 * 
 * For any valid domain string (3+ characters, no special symbols), 
 * submitting it should trigger an API call to the generation endpoint 
 * and transition the system to processing state.
 * 
 * Validates: Requirements 1.3
 */
describe('ResearchInput Property Tests', () => {
  describe('Property 3: Valid domain submission', () => {
    it('should trigger submission for any valid domain string', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate valid domain strings: 3+ chars, only letters, numbers, spaces, and hyphens
          // Exclude control characters and special whitespace
          fc
            .stringMatching(/^[a-zA-Z0-9 -]{3,50}$/)
            .filter((s) => s.trim().length >= 3 && !/[\r\n\t]/.test(s)), // Ensure trimmed length is at least 3 and no control chars
          async (validDomain) => {
            // Ensure clean state before each iteration
            cleanup();
            
            const user = userEvent.setup();
            const mockOnSubmit = vi.fn();

            const { container } = render(
              <ResearchInput onSubmit={mockOnSubmit} isLoading={false} />
            );

            // Use within to scope queries to this specific container
            const { getByLabelText, getByRole } = within(container);

            // Find the domain input field
            const input = getByLabelText(/research domain/i);
            const submitButton = getByRole('button', {
              name: /generate research gaps/i,
            });

            // Enter the valid domain
            await user.clear(input);
            await user.type(input, validDomain);

            // Submit the form
            await user.click(submitButton);

            // Verify that onSubmit was called with the domain
            expect(mockOnSubmit).toHaveBeenCalledTimes(1);
            expect(mockOnSubmit).toHaveBeenCalledWith(
              expect.objectContaining({
                domain: validDomain.trim(),
              })
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not trigger submission for invalid domains (too short)', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate strings with 0-2 characters (excluding empty string)
          fc.stringMatching(/^[a-zA-Z0-9\s-]{1,2}$/),
          async (shortDomain) => {
            // Ensure clean state before each iteration
            cleanup();
            
            const user = userEvent.setup();
            const mockOnSubmit = vi.fn();

            const { container } = render(
              <ResearchInput onSubmit={mockOnSubmit} isLoading={false} />
            );

            // Use within to scope queries to this specific container
            const { getByLabelText, getByRole, getByText } = within(container);

            const input = getByLabelText(/research domain/i);
            const submitButton = getByRole('button', {
              name: /generate research gaps/i,
            });

            // Enter the short domain
            await user.clear(input);
            await user.type(input, shortDomain);

            // Submit the form
            await user.click(submitButton);

            // Verify that onSubmit was NOT called
            expect(mockOnSubmit).not.toHaveBeenCalled();

            // Verify error message is displayed
            expect(
              getByText(/domain must be at least 3 characters long/i)
            ).toBeInTheDocument();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not trigger submission for domains with special symbols', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate strings with at least 3 chars that contain special symbols
          fc
            .tuple(
              fc.stringMatching(/^[a-zA-Z0-9 -]{2,20}$/), // Valid part (no \s to avoid control chars)
              fc.constantFrom('!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '=', '+', ';', ':', ',', '.', '?', '/') // Special symbols that don't conflict with userEvent
            )
            .map(([validPart, symbol]) => validPart + symbol), // Combine them
          async (invalidDomain) => {
            // Ensure clean state before each iteration
            cleanup();
            
            const user = userEvent.setup();
            const mockOnSubmit = vi.fn();

            const { container } = render(
              <ResearchInput onSubmit={mockOnSubmit} isLoading={false} />
            );

            // Use within to scope queries to this specific container
            const { getByLabelText, getByRole, getByText } = within(container);

            const input = getByLabelText(/research domain/i) as HTMLInputElement;
            const submitButton = getByRole('button', {
              name: /generate research gaps/i,
            });

            // Use paste instead of type to avoid userEvent special character issues
            await user.clear(input);
            await user.click(input);
            await user.paste(invalidDomain);

            // Submit the form
            await user.click(submitButton);

            // Verify that onSubmit was NOT called
            expect(mockOnSubmit).not.toHaveBeenCalled();

            // Verify error message is displayed
            expect(
              getByText(/domain must not contain special symbols/i)
            ).toBeInTheDocument();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
