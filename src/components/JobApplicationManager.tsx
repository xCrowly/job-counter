"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { StatusBadge } from './ui/StatusBadge';
import { JobApplicationForm } from './JobApplicationForm';
import { useJobTracker } from '../hooks';
import type { JobApplication, JobStatus } from '../types';

// Define sorting types
type SortField = 'companyName' | 'jobTitle' | 'applicationDate' | 'status';
type SortDirection = 'asc' | 'desc';

export function JobApplicationManager() {
  const {
    state,
    addApplication,
    updateApplication,
    deleteApplication,
    updateStatus,
  } = useJobTracker();

  const [isAddingApplication, setIsAddingApplication] = useState(false);
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Sorting state
  const [sortField, setSortField] = useState<SortField>('applicationDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Calculate pagination values
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(state.applications.length / pageSize));
  }, [state.applications.length, pageSize]);

  // Ensure current page is valid when applications are deleted or page size changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [totalPages, currentPage]);

  // Sort and paginate data
  const sortedAndPaginatedApplications = useMemo(() => {
    // First sort the applications
    const sortedApplications = [...state.applications].sort((a, b) => {
      let compareA, compareB;
      
      // Handle different field types
      if (sortField === 'applicationDate') {
        compareA = new Date(a[sortField]).getTime();
        compareB = new Date(b[sortField]).getTime();
      } else {
        compareA = a[sortField].toLowerCase();
        compareB = b[sortField].toLowerCase();
      }
      
      // Apply sort direction
      if (sortDirection === 'asc') {
        return compareA > compareB ? 1 : compareA < compareB ? -1 : 0;
      } else {
        return compareA < compareB ? 1 : compareA > compareB ? -1 : 0;
      }
    });
    
    // Then paginate
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedApplications.slice(startIndex, endIndex);
  }, [state.applications, sortField, sortDirection, currentPage, pageSize]);

  // Handle sorting
  const handleSort = (field: SortField) => {
    // If clicking the same field, toggle direction
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking a new field, set it as the sort field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
    
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };

  // Render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return <span className="ml-1 text-gray-400">↕</span>;
    return sortDirection === 'asc' 
      ? <span className="ml-1">↑</span> 
      : <span className="ml-1">↓</span>;
  };

  const handleAddSubmit = (data: Omit<JobApplication, 'id'>) => {
    addApplication(data);
    setIsAddingApplication(false);
  };

  const handleEditSubmit = (data: Omit<JobApplication, 'id'>) => {
    if (editingApplication) {
      updateApplication(editingApplication.id, data);
      setEditingApplication(null);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      deleteApplication(id);
      if (editingApplication?.id === id) {
        setEditingApplication(null);
      }
      if (showDetails === id) {
        setShowDetails(null);
      }
      
      // Check if after deletion the current page would be empty (except for the last page)
      const remainingItems = state.applications.length - 1;
      const newTotalPages = Math.max(1, Math.ceil(remainingItems / pageSize));
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
    }
  };

  const handleStatusChange = (id: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    updateStatus(id, e.target.value as JobStatus);
  };

  const toggleDetails = (id: string) => {
    setShowDetails(prevId => prevId === id ? null : id);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value);
    setPageSize(newPageSize);
    // Reset to first page when changing page size
    setCurrentPage(1);
  };

  // Pagination controls
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Job Applications</CardTitle>
        {!isAddingApplication && !editingApplication && (
          <Button 
            onClick={() => setIsAddingApplication(true)}
            variant="primary"
            size="sm"
          >
            Add Application
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isAddingApplication && (
          <div className="mb-6 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
            <h3 className="text-lg font-medium mb-4">Add New Application</h3>
            <JobApplicationForm 
              onSubmit={handleAddSubmit} 
              onCancel={() => setIsAddingApplication(false)}
            />
          </div>
        )}

        {editingApplication && (
          <div className="mb-6 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
            <h3 className="text-lg font-medium mb-4">Edit Application</h3>
            <JobApplicationForm 
              initialData={editingApplication}
              onSubmit={handleEditSubmit} 
              onCancel={() => setEditingApplication(null)}
            />
          </div>
        )}

        {state.applications.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th 
                      className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => handleSort('companyName')}
                    >
                      <div className="flex items-center">
                        Company
                        {renderSortIndicator('companyName')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => handleSort('jobTitle')}
                    >
                      <div className="flex items-center">
                        Job Title
                        {renderSortIndicator('jobTitle')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => handleSort('applicationDate')}
                    >
                      <div className="flex items-center">
                        Date
                        {renderSortIndicator('applicationDate')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center">
                        Status
                        {renderSortIndicator('status')}
                      </div>
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAndPaginatedApplications.map((app) => (
                    <React.Fragment key={app.id}>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{app.companyName}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{app.jobTitle}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                          {new Date(app.applicationDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <StatusBadge status={app.status} />
                            <select
                              value={app.status}
                              onChange={(e) => handleStatusChange(app.id, e)}
                              className="ml-2 px-2 py-1 text-xs rounded border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600"
                              aria-label="Change application status"
                            >
                              <option value="applied">Applied</option>
                              <option value="interview">Interview</option>
                              <option value="rejected">Rejected</option>
                              <option value="offer">Offer</option>
                            </select>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => toggleDetails(app.id)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              {showDetails === app.id ? 'Hide' : 'Details'}
                            </button>
                            <button
                              onClick={() => setEditingApplication(app)}
                              className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(app.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                      {showDetails === app.id && (
                        <tr>
                          <td colSpan={5} className="px-4 py-2 bg-gray-50 dark:bg-gray-800">
                            <div className="text-sm">
                              <h4 className="font-medium mb-1">Notes:</h4>
                              <p className="whitespace-pre-line">{app.notes || 'No notes added.'}</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">
                  Show
                </span>
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="px-2 py-1 text-sm rounded border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="40">40</option>
                  <option value="50">50</option>
                </select>
                <span className="text-sm text-gray-700 dark:text-gray-300 ml-2">
                  per page
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 dark:text-gray-300 hidden md:inline">
                  {state.applications.length > 0 
                    ? `Showing ${(currentPage - 1) * pageSize + 1} to ${Math.min(currentPage * pageSize, state.applications.length)} of ${state.applications.length}`
                    : 'No results'
                  }
                </span>
                <div className="flex space-x-1">
                  <Button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="px-2 py-1"
                  >
                    First
                  </Button>
                  <Button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="px-2 py-1"
                  >
                    Prev
                  </Button>
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currentPage} / {totalPages || 1}
                  </span>
                  <Button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    variant="outline"
                    size="sm"
                    className="px-2 py-1"
                  >
                    Next
                  </Button>
                  <Button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    variant="outline"
                    size="sm"
                    className="px-2 py-1"
                  >
                    Last
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No applications yet. Start tracking your job applications!
          </div>
        )}
      </CardContent>
    </Card>
  );
} 