import { Download, Copy, RefreshCw, FileText } from 'lucide-react';
import type { ResearchResult } from '../../types/research.types';
import { downloadAsPdf, downloadAsTxt, copyToClipboard } from '../../utils/download';
import { useState } from 'react';

interface ResultsDisplayProps {
  result: ResearchResult;
  onRegenerate: () => void;
}

export function ResultsDisplay({ result, onRegenerate }: ResultsDisplayProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    try {
      await copyToClipboard(result);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleDownloadPdf = () => {
    downloadAsPdf(result);
  };

  const handleDownloadTxt = () => {
    downloadAsTxt(result);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8" data-testid="results-display">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Research Gap Analysis
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 break-words">
            Domain: {result.domain}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Generated: {new Date(result.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 hover:shadow-md flex-1 sm:flex-initial"
            data-testid="download-pdf-button"
            aria-label="Download results as PDF"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span className="hidden xs:inline">PDF</span>
          </button>
          <button
            onClick={handleDownloadTxt}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 hover:shadow-md flex-1 sm:flex-initial"
            data-testid="download-txt-button"
            aria-label="Download results as text file"
          >
            <FileText className="w-4 h-4" aria-hidden="true" />
            <span className="hidden xs:inline">TXT</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 hover:shadow-md flex-1 sm:flex-initial"
            data-testid="copy-button"
            aria-label={copySuccess ? 'Results copied to clipboard' : 'Copy results to clipboard'}
          >
            <Copy className="w-4 h-4" aria-hidden="true" />
            <span className="hidden xs:inline">{copySuccess ? 'Copied!' : 'Copy'}</span>
          </button>
          <button
            onClick={onRegenerate}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 hover:shadow-md w-full sm:w-auto"
            data-testid="regenerate-button"
            aria-label="Regenerate research gap analysis with same parameters"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            <span>Regenerate</span>
          </button>
        </div>
      </div>

      {/* Research Gaps */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 transition-all duration-200 hover:shadow-lg">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Identified Research Gaps
        </h3>
        <div className="space-y-3 sm:space-y-4">
          {result.gaps.map((gap, index) => (
            <div
              key={index}
              className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600"
            >
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-blue-600 text-white rounded-full text-xs sm:text-sm font-semibold shadow-md">
                  {index + 1}
                </span>
                <p className="flex-1 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {gap}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Papers (if available) */}
      {result.papers && result.papers.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-all duration-200 hover:shadow-lg">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Referenced Papers
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {result.papers.map((paper, index) => (
              <div
                key={index}
                className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600"
              >
                <h4 className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-2 leading-snug">
                  {paper.title}
                </h4>
                <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <span>Year: {paper.year}</span>
                  {paper.authors && paper.authors.length > 0 && (
                    <span className="truncate max-w-xs">Authors: {paper.authors.join(', ')}</span>
                  )}
                </div>
                <a
                  href={paper.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded px-1"
                >
                  View Paper →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
