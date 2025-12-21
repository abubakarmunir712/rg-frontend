import { useState } from 'react';
import { DefaultService, OpenAPI, type ResearchGapRequest, ApiError } from './api';
import { BackgroundScene } from './components/BackgroundScene';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { ResultsDisplay } from './components/ResultsDisplay';

// Configure the API base URL
OpenAPI.BASE = 'http://localhost:8000';

export interface GapItem {
  statement: string;
  score: number;
}

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GapItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults(null);

    const requestBody: ResearchGapRequest = { query };

    try {
      // Simulate a longer delay to enjoy the loading animation
      await new Promise(resolve => setTimeout(resolve, 1500));
      const response = await DefaultService.getResearchGapsEndpointResearchGapsPost(requestBody);
      if (response.detail && response.detail.gaps) {
        setResults(response.detail.gaps);
      } else {
        setError('Received an unexpected response format.');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        const apiErrorMessage = err.body?.detail?.message || 'An API error occurred.';
        setError(apiErrorMessage);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-foreground font-sans antialiased relative">
      <BackgroundScene />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10 bg-transparent rounded-lg mt-8 mb-8">
        <Header />
        <SearchForm
          query={query}
          setQuery={setQuery}
          handleSubmit={handleSubmit}
          loading={loading}
        />
        <ResultsDisplay
          loading={loading}
          error={error}
          results={results}
        />
      </main>
    </div>
  );
}

export default App;
