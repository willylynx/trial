export interface DashboardStats {
  datasetsUploaded: number;
  requestsReceived: number;
  requestsSent: number;
}

export interface DatasetRequest {
  id: string;
  datasetId: string;
  datasetTitle: string;
  requesterName: string;
  requesterEmail: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
}

export interface UserDataset {
  id: string;
  title: string;
  source: string;
  category: string[];
  country: string[];
  tags: string[];
  accessibility: 'public' | 'private';
  description: string;
  uploadDate: string;
  views: number;
  downloads: number;
  requests: number;
  fileUrl?: string;
  externalUrl?: string;
  fileSize?: string;
  fileExtension?: string;
  isLink?: boolean;
  status: 'active' | 'pending' | 'rejected';
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  dateJoined: string;
  bio?: string;
  organization?: string;
  location?: string;
}

export interface NewDatasetForm {
  title: string;
  source: string;
  tags: string[];
  country: string[];
  category: string[];
  accessibility: 'public' | 'private';
  description: string;
  dataType: 'link' | 'file';
  externalUrl?: string;
  file?: File;
}