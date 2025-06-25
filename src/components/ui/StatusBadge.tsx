"use client";

import React from 'react';
import type { JobStatus } from '@/types';

interface StatusBadgeProps {
  status: JobStatus;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const colorMap: Record<JobStatus, string> = {
    applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    interview: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    offer: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[status]} ${className}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
} 