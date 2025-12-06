import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Brain, FileSearch, Lightbulb } from "lucide-react";

interface ProcessingScreenProps {
  messages?: string[];
  className?: string;
}

const defaultMessages = [
  "Analyzing research domain...",
  "Fetching relevant papers...",
  "Identifying research gaps...",
  "Generating comprehensive analysis...",
];

const messageIcons = [Brain, FileSearch, Sparkles, Lightbulb];

export function ProcessingScreen({
  messages = defaultMessages,
  className,
}: ProcessingScreenProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);

    // Progress through stages faster to match loading time (2-3 seconds)
    // Each stage takes ~750ms, completing all 4 stages in ~3 seconds
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => {
        const next = prev + 1;
        // Stop at the last stage instead of looping
        return next >= messages.length ? prev : next;
      });
    }, 750);

    return () => clearInterval(interval);
  }, [messages.length]);

  const CurrentIcon = messageIcons[currentMessageIndex % messageIcons.length];

  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
      data-testid="processing-screen"
    >
      <div 
        className={cn(
          "bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-500",
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        )}
      >
        <div className="flex flex-col items-center">
          {/* Animated spinner with pulsing rings */}
          <div className="relative mb-6">
            {/* Outer pulsing ring */}
            <div className="absolute inset-0 w-24 h-24 sm:w-28 sm:h-28 -m-4 sm:-m-4 rounded-full bg-blue-500/20 animate-ping"></div>
            
            {/* Middle pulsing ring */}
            <div className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 -m-2 sm:-m-2 rounded-full bg-blue-500/30 animate-pulse"></div>
            
            {/* Main spinner */}
            <div className="relative">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
                data-testid="processing-spinner"
              ></div>
              
              {/* Center icon with rotation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <CurrentIcon 
                  className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 animate-pulse" 
                  key={currentMessageIndex}
                />
              </div>
            </div>
          </div>

          {/* Animated title */}
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center animate-pulse">
            Processing Your Request
          </h3>

          {/* Progress bar with percentage */}
          <div className="w-full mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Step {currentMessageIndex + 1} of {messages.length}
              </span>
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                {Math.round(((currentMessageIndex + 1) / messages.length) * 100)}%
              </span>
            </div>
            
            {/* Animated progress bar */}
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                style={{
                  width: `${((currentMessageIndex + 1) / messages.length) * 100}%`,
                }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-fast"></div>
              </div>
            </div>
          </div>

          {/* Stage indicators with icons */}
          <div className="flex justify-between w-full mb-6 px-2">
            {messages.map((_, index) => {
              const StageIcon = messageIcons[index % messageIcons.length];
              const isCompleted = index < currentMessageIndex;
              const isCurrent = index === currentMessageIndex;
              
              return (
                <div
                  key={index}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                      isCurrent && "bg-blue-600 scale-110 shadow-lg shadow-blue-500/50",
                      isCompleted && "bg-green-500",
                      !isCurrent && !isCompleted && "bg-gray-300 dark:bg-gray-600"
                    )}
                  >
                    {isCompleted ? (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <StageIcon 
                        className={cn(
                          "w-4 h-4 transition-all duration-300",
                          isCurrent ? "text-white animate-bounce-subtle" : "text-gray-500 dark:text-gray-400"
                        )}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Animated message with fade transition */}
          <div className="relative h-14 sm:h-16 w-full overflow-hidden mt-2">
            {messages.map((message, index) => (
              <p
                key={index}
                className={cn(
                  "absolute inset-0 text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center transition-all duration-500 flex items-center justify-center px-4",
                  index === currentMessageIndex
                    ? "opacity-100 translate-y-0"
                    : index < currentMessageIndex
                    ? "opacity-0 -translate-y-4"
                    : "opacity-0 translate-y-4"
                )}
                data-testid={index === currentMessageIndex ? "processing-message" : undefined}
              >
                {message}
              </p>
            ))}
          </div>

          {/* Animated particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full animate-float"
                style={{
                  left: `${20 + i * 15}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + i * 0.5}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
