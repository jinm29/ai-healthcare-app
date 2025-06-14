import React, { useEffect, useState } from 'react';

interface MatrixCounterProps {
  current: number;
  total: number;
  label: string;
}

export const MatrixCounter: React.FC<MatrixCounterProps> = ({ current, total, label }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Animate the counter
    const duration = 300;
    const steps = 20;
    const increment = (current - displayValue) / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      if (step <= steps) {
        setDisplayValue(prev => Math.min(prev + increment, current));
      } else {
        clearInterval(timer);
        setDisplayValue(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [current]);

  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="relative bg-gray-900/50 rounded-lg p-4 border border-gray-800">
      {/* Content */}
      <div className="relative z-10">
        <div className="text-gray-400 text-sm mb-2">{label}</div>
        
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-semibold text-white tabular-nums">
            {Math.floor(displayValue).toLocaleString()}
          </span>
          <span className="text-gray-400 text-sm">/ {total.toLocaleString()}</span>
        </div>

        {/* Progress bar */}
        <div className="relative h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-600 to-green-500 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="mt-2 text-xs text-gray-500">
          {percentage.toFixed(1)}% complete
        </div>
      </div>
    </div>
  );
}; 