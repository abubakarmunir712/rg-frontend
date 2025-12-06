import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { validateDomain } from './validation';

/**
 * Feature: research-gennie-frontend, Property 1: Short domain rejection
 * Validates: Requirements 1.1
 */
describe('Input Validation Properties', () => {
  it('Property 1: should reject domains with fewer than 3 characters', () => {
    fc.assert(
      fc.property(
        fc.string({ maxLength: 2 }), // Generate strings with 0-2 chars
        (shortDomain) => {
          const result = validateDomain(shortDomain);
          expect(result.isValid).toBe(false);
          expect(result.error).toBeDefined();
          expect(result.error).toContain('at least 3 characters');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: research-gennie-frontend, Property 2: Special character rejection
   * Validates: Requirements 1.2
   */
  it('Property 2: should reject domains containing special symbols', () => {
    // Generate strings that contain at least one special character
    const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '=', '+', '[', ']', '{', '}', '|', '\\', ';', ':', '"', '<', '>', ',', '.', '?', '/'];
    
    fc.assert(
      fc.property(
        fc.string({ minLength: 3 }), // Valid length
        fc.constantFrom(...specialChars), // Pick a special character
        fc.nat({ max: 10 }), // Position to insert special char
        (baseString, specialChar, position) => {
          // Insert special character into the string
          const pos = Math.min(position, baseString.length);
          const domainWithSpecial = baseString.slice(0, pos) + specialChar + baseString.slice(pos);
          
          const result = validateDomain(domainWithSpecial);
          expect(result.isValid).toBe(false);
          expect(result.error).toBeDefined();
          expect(result.error).toContain('special symbols');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: Valid domains should be accepted
   */
  it('should accept valid domains (3+ chars, no special symbols)', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-zA-Z0-9\s-]{3,50}$/), // Valid domain pattern
        (validDomain) => {
          const result = validateDomain(validDomain);
          expect(result.isValid).toBe(true);
          expect(result.error).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });
});
