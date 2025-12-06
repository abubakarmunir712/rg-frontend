import { cn } from "@/lib/utils";

interface LoadingStateProps {
  className?: string;
  count?: number;
}

export function LoadingState({ className, count = 3 }: LoadingStateProps) {
  return (
    <div className={cn("space-y-4", className)} data-testid="loading-state">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse space-y-3"
          data-testid="skeleton-loader"
        >
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}
