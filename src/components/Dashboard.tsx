"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { ProgressBar } from './ui/ProgressBar';
import { Counter } from './Counter';
import { TargetInput } from './TargetInput';
import { JobApplicationManager } from './JobApplicationManager';
import { JobApplicationForm } from './JobApplicationForm';
import { useJobTracker } from '../hooks';
import type { JobApplication } from '../types';

export function Dashboard() {
  const {
    state,
    setTargetJobCount,
    decrementAppliedCount,
    addApplication,
    getProgressPercentage,
  } = useJobTracker();

  const [showAddForm, setShowAddForm] = useState(false);

  const handleIncrement = () => {
    setShowAddForm(true);
  };

  const handleAddApplication = (data: Omit<JobApplication, 'id'>) => {
    addApplication(data);
    setShowAddForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Job Application Tracker
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Job Target</CardTitle>
          </CardHeader>
          <CardContent>
            <TargetInput
              currentTarget={state.targetJobCount}
              onTargetChange={setTargetJobCount}
              className="mb-4"
            />
            <ProgressBar
              value={state.appliedJobCount}
              max={state.targetJobCount}
              className="mt-4"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Applications Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <Counter
              label="Applied Jobs"
              value={state.appliedJobCount}
              onIncrement={handleIncrement}
              onDecrement={decrementAppliedCount}
            />
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {state.appliedJobCount} out of {state.targetJobCount} applications submitted
              ({Math.round(getProgressPercentage())}% complete)
            </div>
          </CardContent>
        </Card>
      </div>

      {showAddForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add Job Application</CardTitle>
          </CardHeader>
          <CardContent>
            <JobApplicationForm 
              onSubmit={handleAddApplication} 
              onCancel={() => setShowAddForm(false)}
            />
          </CardContent>
        </Card>
      )}

      <JobApplicationManager />
    </div>
  );
} 