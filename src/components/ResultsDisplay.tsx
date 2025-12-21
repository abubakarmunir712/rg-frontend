
import { ResultCard } from './ResultCard';
import { LoadingSpinner } from './LoadingSpinner';

interface GapItem {
    statement: string;
    score: number;
}

interface ResultsDisplayProps {
    loading: boolean;
    error: string;
    results: GapItem[] | null;
}

export function ResultsDisplay({ loading, error, results }: ResultsDisplayProps) {
    return (
        <section className="max-w-4xl mx-auto min-h-[20rem]">
            {loading && <LoadingSpinner />}
            {error && (
                <div className="bg-danger/10 border border-danger text-danger px-6 py-4 rounded-xl text-center animate-fade-in">
                    <strong className="font-bold text-lg">An Error Occurred</strong>
                    <span className="block mt-1">{error}</span>
                </div>
            )}
            {results && (
                <div className="space-y-6 animate-fade-in">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Identified Research Gaps</h2>
                    {results.map((gap, index) => (
                        <ResultCard key={index} gap={gap} />
                    ))}
                </div>
            )}
        </section>
    );
}
