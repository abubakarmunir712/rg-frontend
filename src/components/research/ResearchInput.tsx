import { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { validateDomain } from '../../utils/validation';
import type { GenerateRequest } from '../../types/research.types';

interface ResearchInputProps {
  onSubmit: (data: GenerateRequest) => void;
  isLoading: boolean;
}

export function ResearchInput({ onSubmit, isLoading }: ResearchInputProps) {
  const [domain, setDomain] = useState('');
  const [validationError, setValidationError] = useState<string | undefined>();
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Advanced filters state
  const [yearStart, setYearStart] = useState<string>('');
  const [yearEnd, setYearEnd] = useState<string>('');
  const [numberOfPapers, setNumberOfPapers] = useState<string>('');
  const [includeKeywords, setIncludeKeywords] = useState<string>('');
  const [excludeKeywords, setExcludeKeywords] = useState<string>('');

  const handleDomainChange = (value: string) => {
    setDomain(value);
    // Clear validation error when user types
    if (validationError) {
      setValidationError(undefined);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate domain
    const validation = validateDomain(domain);
    if (!validation.isValid) {
      setValidationError(validation.error);
      return;
    }

    // Build request with filters
    const request: GenerateRequest = {
      domain: domain.trim(),
    };

    // Add filters if any are provided
    const hasFilters =
      yearStart || yearEnd || numberOfPapers || includeKeywords || excludeKeywords;

    if (hasFilters) {
      request.filters = {};

      if (yearStart || yearEnd) {
        request.filters.yearRange = {
          start: yearStart ? parseInt(yearStart) : 1900,
          end: yearEnd ? parseInt(yearEnd) : new Date().getFullYear(),
        };
      }

      if (numberOfPapers) {
        request.filters.numberOfPapers = parseInt(numberOfPapers);
      }

      if (includeKeywords) {
        request.filters.includeKeywords = includeKeywords
          .split(',')
          .map((k) => k.trim())
          .filter((k) => k.length > 0);
      }

      if (excludeKeywords) {
        request.filters.excludeKeywords = excludeKeywords
          .split(',')
          .map((k) => k.trim())
          .filter((k) => k.length > 0);
      }
    }

    onSubmit(request);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="space-y-4">
        {/* Main domain input */}
        <div>
          <label
            htmlFor="domain"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Research Domain
          </label>
          <div className="relative">
            <input
              id="domain"
              type="text"
              value={domain}
              onChange={(e) => handleDomainChange(e.target.value)}
              placeholder="e.g., Machine Learning, Climate Science, Quantum Computing"
              disabled={isLoading}
              className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                validationError
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
          </div>
          {validationError && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {validationError}
            </p>
          )}
        </div>

        {/* Advanced filters toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          disabled={isLoading}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          aria-expanded={showAdvanced}
          aria-controls="advanced-filters"
          aria-label={showAdvanced ? 'Hide advanced filters' : 'Show advanced filters'}
        >
          {showAdvanced ? (
            <>
              <ChevronUp className="w-4 h-4" aria-hidden="true" />
              Hide Advanced Filters
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
              Show Advanced Filters
            </>
          )}
        </button>

        {/* Advanced filters section */}
        {showAdvanced && (
          <div id="advanced-filters" className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 space-y-4" role="region" aria-label="Advanced search filters">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Advanced Filters
            </h3>

            {/* Year range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="yearStart"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Start Year
                </label>
                <input
                  id="yearStart"
                  type="number"
                  value={yearStart}
                  onChange={(e) => setYearStart(e.target.value)}
                  placeholder="e.g., 2010"
                  disabled={isLoading}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="yearEnd"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  End Year
                </label>
                <input
                  id="yearEnd"
                  type="number"
                  value={yearEnd}
                  onChange={(e) => setYearEnd(e.target.value)}
                  placeholder="e.g., 2024"
                  disabled={isLoading}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Number of papers */}
            <div>
              <label
                htmlFor="numberOfPapers"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Number of Papers
              </label>
              <input
                id="numberOfPapers"
                type="number"
                value={numberOfPapers}
                onChange={(e) => setNumberOfPapers(e.target.value)}
                placeholder="e.g., 50"
                disabled={isLoading}
                min="1"
                max="1000"
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Include keywords */}
            <div>
              <label
                htmlFor="includeKeywords"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Include Keywords
              </label>
              <input
                id="includeKeywords"
                type="text"
                value={includeKeywords}
                onChange={(e) => setIncludeKeywords(e.target.value)}
                placeholder="e.g., neural networks, deep learning (comma-separated)"
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Separate multiple keywords with commas
              </p>
            </div>

            {/* Exclude keywords */}
            <div>
              <label
                htmlFor="excludeKeywords"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Exclude Keywords
              </label>
              <input
                id="excludeKeywords"
                type="text"
                value={excludeKeywords}
                onChange={(e) => setExcludeKeywords(e.target.value)}
                placeholder="e.g., survey, review (comma-separated)"
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Separate multiple keywords with commas
              </p>
            </div>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generating...' : 'Generate Research Gaps'}
        </button>
      </div>
    </form>
  );
}
