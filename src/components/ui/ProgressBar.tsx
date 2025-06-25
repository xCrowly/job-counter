"use client";

import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  // Determine color based on percentage
  let colorClass = 'bg-blue-600';
  if (percentage >= 100) {
    colorClass = 'bg-green-600';
  } else if (percentage < 30) {
    colorClass = 'bg-red-600';
  } else if (percentage < 70) {
    colorClass = 'bg-yellow-600';
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Progress
        </div>
        {showLabel && (
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(percentage)}%
          </div>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className={`h-2.5 rounded-full ${colorClass} transition-all duration-300 ease-in-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
} 