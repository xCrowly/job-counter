export type JobStatus = 'applied' | 'interview' | 'rejected' | 'offer';

export interface JobApplication {
  id: string;
  companyName: string;
  jobTitle: string;
  applicationDate: string;
  status: JobStatus;
  notes: string;
}

export interface JobTrackerState {
  targetJobCount: number;
  appliedJobCount: number;
  applications: JobApplication[];
} 