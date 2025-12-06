import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { sanitizeInput, sanitizeObject } from './sanitize';

/**
 * Feature: research-gennie-frontend, Property 41: Input sanitization
 * Validates: Requirements 11.4
 */
describe('Input Sanitization Properties', () => {
  it('Property 41: should sanitize input to prevent XSS attacks', () => {
    // Test that dangerous HTML characters are escaped
    const dangerousChars = ['<', '>', '&', '"', "'", '/'];
    
    fc.assert(
      fc.property(
        fc.string(), // Any string
        fc.constantFrom(...dangerousChars), // Pick a dangerous character
        fc.nat({ max: 10 }), // Position to insert
        (baseString, dangerousChar, position) => {
          // Insert dangerous character into the string
          const pos = Math.min(position, baseString.length);
          const inputWithDangerousChar = baseString.slice(0, pos) + dangerousChar + baseString.slice(pos);
          
          const sanitized = sanitizeInput(inputWithDangerousChar);
          
          // The sanitized output should not contain the raw dangerous character
          // It should be escaped
          const escapedVersions: Record<string, string> = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;',
          };
          
          // If the input contained a dangerous char, the output should contain its escaped version
          if (inputWithDangerousChar.includes(dangerousChar)) {
            expect(sanitized).toContain(escapedVersions[dangerousChar]);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should escape script tags to prevent XSS', () => {
    fc.assert(
      fc.property(
        fc.string(), // Any string content
        (content) => {
          const maliciousInput = `<script>${content}</script>`;
          const sanitized = sanitizeInput(maliciousInput);
          
          // Should not contain raw script tags
          expect(sanitized).not.toContain('<script>');
          expect(sanitized).not.toContain('</script>');
          
          // Should contain escaped versions
          expect(sanitized).toContain('&lt;script&gt;');
          expect(sanitized).toContain('&lt;&#x2F;script&gt;');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should sanitize objects recursively', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.string(),
        (str1, str2) => {
          const obj = {
            field1: `<script>${str1}</script>`,
            nested: {
              field2: `<img src="x" onerror="${str2}">`,
            },
          };
          
          const sanitized = sanitizeObject(obj);
          
          // Check that nested strings are sanitized
          expect(sanitized.field1).not.toContain('<script>');
          expect(sanitized.nested.field2).not.toContain('<img');
          expect(sanitized.field1).toContain('&lt;');
          expect(sanitized.nested.field2).toContain('&lt;');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle arrays in objects', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string(), { minLength: 1, maxLength: 5 }),
        (strings) => {
          const obj = {
            items: strings.map(s => `<div>${s}</div>`),
          };
          
          const sanitized = sanitizeObject(obj);
          
          // All array items should be sanitized
          sanitized.items.forEach((item: string) => {
            expect(item).not.toContain('<div>');
            expect(item).toContain('&lt;div&gt;');
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve safe strings without modification', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-zA-Z0-9\s]+$/), // Only safe characters
        (safeString) => {
          const sanitized = sanitizeInput(safeString);
          // Safe strings should remain unchanged
          expect(sanitized).toBe(safeString);
        }
      ),
      { numRuns: 100 }
    );
  });
});
