
interface SearchFormProps {
    query: string;
    setQuery: (query: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    loading: boolean;
}

export function SearchForm({ query, setQuery, handleSubmit, loading }: SearchFormProps) {
    return (
        <section className="max-w-3xl mx-auto mb-16">
            <form onSubmit={handleSubmit}>
                <div className="relative">
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., 'The impact of quantum computing on protein folding simulation...'"
                        className="w-full h-36 md:h-28 p-4 pr-32 bg-black/30 rounded-xl border-2 border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 resize-none shadow-lg"
                    />
                    <button
                        type="submit"
                        disabled={loading || !query.trim()}
                        className="absolute top-1/2 right-4 -translate-y-1/2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:scale-105 transition-transform duration-300 disabled:bg-muted disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? 'Analyzing...' : 'Discover'}
                    </button>
                </div>
            </form>
        </section>
    );
}
