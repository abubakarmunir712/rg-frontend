import { ResearchInput, ResultsDisplay } from '../components/research';
import { ProcessingScreen } from '../components/common';
import { useResearchStore } from '../store/researchStore';
import type { GenerateRequest } from '../types/research.types';

export function Home() {
  const { generateGap, isGenerating, currentResult, clearResult } = useResearchStore();

  const handleSubmit = async (request: GenerateRequest) => {
    // Clear previous result before generating new one
    clearResult();
    await generateGap(request);
  };

  const handleRegenerate = async () => {
    if (currentResult) {
      const request: GenerateRequest = {
        domain: currentResult.domain,
        filters: currentResult.filters,
      };
      await handleSubmit(request);
    }
  };

  return (
    <main className="min-h-[calc(100vh-200px)] flex flex-col">
      {/* Processing Screen Overlay */}
      {isGenerating && <ProcessingScreen />}

      {/* Show input or results based on state */}
      {!currentResult ? (
        <>
          {/* Hero Section */}
          <section className="text-center py-8 sm:py-12 px-4" aria-labelledby="hero-heading">
            <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 leading-tight">
              Discover Research Gaps with AI
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Enter your research domain and let our AI analyze thousands of papers to identify
              unexplored areas and emerging opportunities in your field.
            </p>
          </section>

          {/* Research Input Section */}
          <section className="flex-1 px-4 pb-12" aria-label="Research gap generation form">
            <ResearchInput onSubmit={handleSubmit} isLoading={isGenerating} />
          </section>
        </>
      ) : (
        <>
          {/* Results Display */}
          <section aria-label="Research gap analysis results">
            <ResultsDisplay result={currentResult} onRegenerate={handleRegenerate} />
          </section>

          {/* New Search Button */}
          <section className="text-center pb-8 sm:pb-12 px-4" aria-label="Start new search">
            <button
              onClick={clearResult}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 hover:shadow-lg"
              aria-label="Start a new research gap search"
            >
              New Search
            </button>
          </section>
        </>
      )}
    </main>
  );
}
