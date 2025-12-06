import { describe, it } from 'vitest';
import fc from 'fast-check';
import { cn } from './utils';

describe('cn utility - property tests', () => {
  it('should always return a string', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string()),
        (classNames) => {
          const result = cn(...classNames);
          return typeof result === 'string';
        }
      ),
      { numRuns: 100 }
    );
  });
});
