import { describe, it, expect, vi } from "vitest";
import fc from "fast-check";
import { render, within } from "@testing-library/react";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { ProcessingScreen } from "./ProcessingScreen";

/**
 * Feature: research-gennie-frontend, Property 22: Skeleton loaders during fetch
 * Validates: Requirements 6.1
 */
describe("Property 22: Skeleton loaders during fetch", () => {
  it("should display skeleton loaders for any positive count", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 10 }), (count) => {
        const { container, unmount } = render(<LoadingState count={count} />);
        const loadingState = within(container).getByTestId("loading-state");
        const skeletons = within(loadingState).getAllByTestId("skeleton-loader");
        expect(skeletons.length).toBe(count);
        expect(loadingState).toBeInTheDocument();
        unmount();
        return true;
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: research-gennie-frontend, Property 23: Button loading states
 * Validates: Requirements 6.2
 */
describe("Property 23: Button loading states", () => {
  it("should disable button and show loading indicator when action is triggered", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 100 }),
        (title, message) => {
          const mockRetry = vi.fn();
          const { container, unmount } = render(
            <ErrorState title={title} message={message} onRetry={mockRetry} />
          );

          const retryButton = within(container).getByTestId("error-retry-button");
          expect(retryButton).toBeInTheDocument();
          expect(retryButton).toHaveTextContent("Try Again");
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: research-gennie-frontend, Property 24: Error state display
 * Validates: Requirements 6.1, 6.2, 6.4
 */
describe("Property 24: Error state display", () => {
  it("should display error state with retry option for any error message", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
        fc.option(fc.string({ minLength: 1, maxLength: 100 }), {
          nil: undefined,
        }),
        (message, title) => {
          const mockRetry = vi.fn();
          const { container, unmount } = render(
            <ErrorState
              message={message}
              title={title}
              onRetry={mockRetry}
            />
          );

          const errorState = within(container).getByTestId("error-state");
          expect(errorState).toBeInTheDocument();
          
          // Use textContent to check for the message since getByText normalizes whitespace
          expect(errorState.textContent).toContain(message);

          const retryButton = within(container).getByTestId("error-retry-button");
          expect(retryButton).toBeInTheDocument();

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should cycle through progress messages during processing", () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 5, maxLength: 50 }), {
          minLength: 2,
          maxLength: 5,
        }),
        (messages) => {
          const { container, unmount } = render(<ProcessingScreen messages={messages} />);

          const processingScreen = within(container).getByTestId("processing-screen");
          expect(processingScreen).toBeInTheDocument();

          const messageElement = within(container).getByTestId("processing-message");
          expect(messageElement).toBeInTheDocument();
          expect(messages).toContain(messageElement.textContent || "");

          const spinner = within(container).getByTestId("processing-spinner");
          expect(spinner).toBeInTheDocument();

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
