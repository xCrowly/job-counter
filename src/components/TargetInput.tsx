"use client";

import React, { useState } from 'react';
import { Button } from './ui/Button';

interface TargetInputProps {
  currentTarget: number;
  onTargetChange: (newTarget: number) => void;
  className?: string;
}

export function TargetInput({
  currentTarget,
  onTargetChange,
  className = '',
}: TargetInputProps) {
  const [inputValue, setInputValue] = useState(currentTarget.toString());
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTarget = parseInt(inputValue, 10);
    if (!isNaN(newTarget) && newTarget > 0) {
      onTargetChange(newTarget);
      setIsEditing(false);
    }
  };

  return (
    <div className={`${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Target Jobs
      </label>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            autoFocus
          />
          <Button type="submit" variant="primary" size="sm">
            Save
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => {
              setInputValue(currentTarget.toString());
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>
        </form>
      ) : (
        <div className="flex items-center space-x-2">
          <div className="flex-1 px-3 py-2 text-xl font-semibold">
            {currentTarget}
          </div>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        </div>
      )}
    </div>
  );
} 