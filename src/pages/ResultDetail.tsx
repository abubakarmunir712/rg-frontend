import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHistoryStore } from '../store/historyStore';
import { useResearchStore } from '../store/researchStore';
import { ResultsDisplay } from '../components/research';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import type { ResearchResult, GenerateRequest } from '../types/research.types';
import { ArrowLeft } from 'lucide-react';

export function ResultDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items } = useHistoryStore();
  const { generateGap } = useResearchStore();
  
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch result data from localStorage (mock implementation)
        const historyKey = 'research-history';
        const historyData = localStorage.getItem(historyKey);
        
        if (!historyData) {
          setError('No history data found');
          setIsLoading(false);
          return;
        }

        const history = JSON.parse(historyData);
        const historyItem = history.find((item: any) => item.id === id);

        if (!historyItem) {
          setError('Result not found');
          setIsLoading(false);
          return;
        }

        // Construct full result from history item
        // In a real app, this would fetch from an API endpoint
        const fullResult: ResearchResult = {
          id: historyItem.id,
          domain: historyItem.domain,
          gaps: historyItem.preview ? [historyItem.preview] : [],
          papers: historyItem.papers || [],
          filters: historyItem.filters,
          createdAt: historyItem.date,
          updatedAt: historyItem.date,
        };

        // Try to get more complete data if available
        const resultsKey = `research-result-${id}`;
        const storedResult = localStorage.getItem(resultsKey);
        
        if (storedResult) {
          const parsedResult = JSON.parse(storedResult);
          setResult(parsedResult);
        } else {
          setResult(fullResult);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch result:', err);
        setError('Failed to load result data');
        setIsLoading(false);
      }
    };

    if (id) {
      fetchResult();
    }
  }, [id]);

  const handleRegenerate = async () => {
    if (!result) return;

    const request: GenerateRequest = {
      domain: result.domain,
      filters: result.filters,
    };

    // Navigate back to home and trigger generation
    navigate('/');
    await generateGap(request);
  };

  const handleBackToHistory = () => {
    navigate('/history');
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <LoadingState count={3} />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ErrorState
          message={error || 'Result not found'}
          onRetry={handleBackToHistory}
          retryLabel="Back to History"
        />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Back button */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <button
          onClick={handleBackToHistory}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-lg px-3 py-2 -ml-3"
          data-testid="back-to-history-button"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm sm:text-base">Back to History</span>
        </button>
      </div>

      {/* Results Display */}
      <ResultsDisplay result={result} onRegenerate={handleRegenerate} />
    </div>
  );
}
