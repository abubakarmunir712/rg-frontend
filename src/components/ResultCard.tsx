
import { ScoreBadge } from './ScoreBadge';

interface GapItem {
    statement: string;
    score: number;
  }

interface ResultCardProps {
    gap: GapItem;
}

export function ResultCard({ gap }: ResultCardProps) {
    return (
        <article className="bg-black/20 border border-white/10 backdrop-blur-sm p-6 rounded-xl shadow-md transition-transform hover:scale-[1.02] hover:border-primary/50">
            <p className="text-lg md:text-xl text-foreground mb-4">{gap.statement}</p>
            <div className="flex justify-end items-center gap-4">
                <span className="text-sm font-bold text-primary">Score: {gap.score}</span>
                <ScoreBadge score={gap.score} />
            </div>
        </article>
    );
}
