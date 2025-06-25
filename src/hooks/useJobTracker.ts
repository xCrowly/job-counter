"use client";

import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from './useLocalStorage';
import type { JobApplication, JobStatus, JobTrackerState } from '../types';

const INITIAL_STATE: JobTrackerState = {
  targetJobCount: 50,
  appliedJobCount: 0,
  applications: [],
};

export function useJobTracker() {
  const [state, setState] = useLocalStorage<JobTrackerState>('job-tracker', INITIAL_STATE);

  // Target jobs handlers
  const setTargetJobCount = useCallback((count: number) => {
    setState((prev) => ({
      ...prev,
      targetJobCount: count,
    }));
  }, [setState]);

  // Applied jobs handlers
  const incrementAppliedCount = useCallback(() => {
    setState((prev) => ({
      ...prev,
      appliedJobCount: prev.appliedJobCount + 1,
    }));
  }, [setState]);

  const decrementAppliedCount = useCallback(() => {
    setState((prev) => ({
      ...prev,
      appliedJobCount: Math.max(0, prev.appliedJobCount - 1),
    }));
  }, [setState]);

  // Application management
  const addApplication = useCallback((application: Omit<JobApplication, 'id'>) => {
    const newApplication = {
      ...application,
      id: uuidv4(),
    };

    setState((prev) => ({
      ...prev,
      applications: [...prev.applications, newApplication],
      appliedJobCount: prev.appliedJobCount + 1,
    }));

    return newApplication;
  }, [setState]);

  const updateApplication = useCallback((id: string, updates: Partial<Omit<JobApplication, 'id'>>) => {
    setState((prev) => ({
      ...prev,
      applications: prev.applications.map((app) => 
        app.id === id ? { ...app, ...updates } : app
      ),
    }));
  }, [setState]);

  const deleteApplication = useCallback((id: string) => {
    setState((prev) => {
      const newApplications = prev.applications.filter((app) => app.id !== id);
      return {
        ...prev,
        applications: newApplications,
        appliedJobCount: Math.max(0, prev.appliedJobCount - 1),
      };
    });
  }, [setState]);

  const updateStatus = useCallback((id: string, status: JobStatus) => {
    setState((prev) => ({
      ...prev,
      applications: prev.applications.map((app) => 
        app.id === id ? { ...app, status } : app
      ),
    }));
  }, [setState]);

  // Stats calculations
  const getProgressPercentage = useCallback(() => {
    if (state.targetJobCount === 0) return 0;
    return Math.min(100, (state.appliedJobCount / state.targetJobCount) * 100);
  }, [state.appliedJobCount, state.targetJobCount]);

  return {
    state,
    setTargetJobCount,
    incrementAppliedCount,
    decrementAppliedCount,
    addApplication,
    updateApplication,
    deleteApplication,
    updateStatus,
    getProgressPercentage,
  };
} 