"use client";

import React from 'react';
import { Button } from './ui/Button';

interface CounterProps {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  className?: string;
}

export function Counter({
  label,
  value,
  onIncrement,
  onDecrement,
  className = '',
}: CounterProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <Button
          onClick={onDecrement}
          variant="outline"
          aria-label="Decrement counter"
        >
          <MinusIcon className="h-5 w-5" />
        </Button>
        <div className="flex-1 text-center text-2xl font-bold">
          {value}
        </div>
        <Button
          onClick={onIncrement}
          variant="outline"
          aria-label="Increment counter"
        >
          <PlusIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

function MinusIcon({ className = '' }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function PlusIcon({ className = '' }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
} 