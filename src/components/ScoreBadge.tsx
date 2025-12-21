
import { useMemo } from 'react';

export const ScoreBadge = ({ score }: { score: number }) => {
    const badgeStyle = useMemo(() => {
      if (score > 7) {
        return {
          className: 'bg-success/20 text-success',
          text: 'High Impact',
        };
      }
      if (score > 4) {
        return {
          className: 'bg-warning/20 text-warning',
          text: 'Medium Impact',
        };
      }
      return {
        className: 'bg-danger/20 text-danger',
        text: 'Potential Gap',
      };
    }, [score]);
  
    return (
      <div className={`px-3 py-1 text-xs font-semibold rounded-full ${badgeStyle.className}`}>
        {badgeStyle.text}
      </div>
    );
  };
