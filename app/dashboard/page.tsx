'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { RequestsModal } from '@/components/dashboard/RequestsModal';
import { UploadDatasetModal } from '@/components/modals/UploadDatasetModal';
import { 
  DashboardStats as StatsType, 
  UserDataset, 
  DatasetRequest, 
  UserProfile as UserProfileType,
  NewDatasetForm 
} from '@/types/dashboard';

// Mock data
const mockUser: UserProfileType = {
  id: '1',
  fullName: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@university.edu',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
  dateJoined: '2023-06-15',
  bio: 'Climate researcher specializing in global temperature analysis and environmental data science. Passionate about making climate data accessible to researchers worldwide.',
  organization: 'Stanford University',
  location: 'California, USA'
};

const mockStats: StatsType = {
  datasetsUploaded: 12,
  requestsReceived: 8,
  requestsSent: 3
};

const mockDatasets: UserDataset[] = [
  {
    id: '1',
    title: 'Global Climate Temperature Anomalies 1880-2023',
    source: 'NASA GISS',
    category: ['Climate', 'Environment'],
    country: ['Global'],
    tags: ['temperature', 'climate', 'global warming'],
    accessibility: 'public',
    description: 'Comprehensive dataset containing global temperature anomalies from 1880 to 2023, including land and ocean temperature measurements from weather stations worldwide.',
    uploadDate: '2024-01-15',
    views: 1250,
    downloads: 340,
    requests: 12,
    status: 'active',
    fileSize: '2.3 GB',
    externalUrl: 'https://data.giss.nasa.gov/gistemp/'
  },
  {
    id: '2',
    title: 'Urban Air Quality Index - Major Cities 2023',
    source: 'EPA',
    category: ['Environment', 'Health'],
    country: ['United States'],
    tags: ['air quality', 'pollution', 'urban'],
    accessibility: 'private',
    description: 'Air quality measurements from 50 major US cities throughout 2023, including PM2.5, PM10, ozone, and other pollutant levels.',
    uploadDate: '2024-01-10',
    views: 890,
    downloads: 156,
    requests: 8,
    status: 'active',
    fileSize: '1.8 GB',
    fileUrl: 'air-quality-data.csv'
  },
  {
    id: '3',
    title: 'Economic Growth Indicators - Developing Nations',
    source: 'World Bank',
    category: ['Economy', 'Demographics'],
    country: ['Multiple'],
    tags: ['economy', 'GDP', 'development'],
    accessibility: 'public',
    description: 'Economic indicators and growth metrics for developing nations from 2000-2023.',
    uploadDate: '2024-01-05',
    views: 650,
    downloads: 89,
    requests: 5,
    status: 'active',
    fileSize: '890 MB',
    externalUrl: 'https://databank.worldbank.org/source/world-development-indicators'
  },
  {
    id: '4',
    title: 'Healthcare Treatment Outcomes Database',
    source: 'WHO',
    category: ['Health', 'Medical'],
    country: ['Global'],
    tags: ['healthcare', 'treatment', 'outcomes', 'medical'],
    accessibility: 'private',
    description: 'Comprehensive database of healthcare treatment outcomes across different medical procedures and conditions.',
    uploadDate: '2024-01-02',
    views: 420,
    downloads: 67,
    requests: 3,
    status: 'active',
    fileSize: '1.5 GB',
    fileUrl: 'healthcare-outcomes.json'
  }
];

const mockRequests: DatasetRequest[] = [
  {
    id: '1',
    datasetId: '2',
    datasetTitle: 'Urban Air Quality Index - Major Cities 2023',
    requesterName: 'Dr. Michael Chen',
    requesterEmail: 'michael.chen@research.org',
    requestDate: '2024-01-20',
    status: 'pending',
    message: 'I would like to use this dataset for my research on urban pollution patterns. This data would be invaluable for my upcoming publication on air quality trends.'
  },
  {
    id: '2',
    datasetId: '1',
    datasetTitle: 'Global Climate Temperature Anomalies 1880-2023',
    requesterName: 'Prof. Emily Rodriguez',
    requesterEmail: 'emily.rodriguez@university.edu',
    requestDate: '2024-01-18',
    status: 'approved',
    message: 'Requesting access for climate modeling research project funded by NSF.'
  },
  {
    id: '3',
    datasetId: '4',
    datasetTitle: 'Healthcare Treatment Outcomes Database',
    requesterName: 'Dr. James Wilson',
    requesterEmail: 'james.wilson@medcenter.org',
    requestDate: '2024-01-16',
    status: 'pending',
    message: 'Need this data for comparative analysis of treatment effectiveness across different healthcare systems.'
  },
  {
    id: '4',
    datasetId: '3',
    datasetTitle: 'Economic Growth Indicators - Developing Nations',
    requesterName: 'Dr. Sarah Johnson',
    requesterEmail: 'sarah.johnson@university.edu',
    requestDate: '2024-01-14',
    status: 'rejected',
    message: 'Requesting access for economic research on developing nations.'
  }
];

export default function DashboardPage() {
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [requestsType, setRequestsType] = useState<'received' | 'sent'>('received');
  const [datasets, setDatasets] = useState(mockDatasets);
  const [requests, setRequests] = useState(mockRequests);
  const [editingDataset, setEditingDataset] = useState<UserDataset | null>(null);

  const handleViewRequests = (type: 'received' | 'sent') => {
    setRequestsType(type);
    setShowRequestsModal(true);
  };

  const handleApproveRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'approved' as const } : req
    ));
  };

  const handleRejectRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'rejected' as const } : req
    ));
  };

  const handleViewDataset = (dataset: UserDataset) => {
    console.log('View dataset:', dataset);
  };

  const handleEditDataset = (dataset: UserDataset) => {
    setEditingDataset(dataset);
    setShowUploadModal(true);
  };

  const handleDeleteDataset = (datasetId: string) => {
    setDatasets(prev => prev.filter(d => d.id !== datasetId));
  };

  const handleAddDataset = (data: NewDatasetForm) => {
    const newDataset: UserDataset = {
      id: Date.now().toString(),
      title: data.title,
      source: data.source,
      category: data.category,
      country: data.country,
      tags: data.tags,
      accessibility: data.accessibility,
      description: data.description,
      uploadDate: new Date().toISOString().split('T')[0],
      views: 0,
      downloads: 0,
      requests: 0,
      status: 'pending',
      fileUrl: data.dataType === 'file' ? 'uploaded-file.csv' : undefined,
      externalUrl: data.dataType === 'link' ? data.externalUrl : undefined,
      fileSize: data.dataType === 'file' ? '1.2 GB' : undefined
    };
    
    setDatasets(prev => [newDataset, ...prev]);
  };

  const handleUpdateDataset = (id: string, data: NewDatasetForm) => {
    setDatasets(prev => prev.map(dataset => {
      if (dataset.id === id) {
        return {
          ...dataset,
          title: data.title,
          source: data.source,
          category: data.category,
          country: data.country,
          tags: data.tags,
          accessibility: data.accessibility,
          description: data.description,
          fileUrl: data.dataType === 'file' && data.file ? 'updated-file.csv' : dataset.fileUrl,
          externalUrl: data.dataType === 'link' ? data.externalUrl : dataset.externalUrl,
          fileSize: data.dataType === 'file' && data.file ? '1.5 GB' : dataset.fileSize
        };
      }
      return dataset;
    }));
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setEditingDataset(null);
  };

  return (
    <DashboardLayout user={mockUser}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your datasets.</p>
        </div>

        <DashboardOverview
          stats={mockStats}
          recentDatasets={datasets}
          requests={requests}
          onViewRequests={handleViewRequests}
          onUploadDataset={() => setShowUploadModal(true)}
          onViewDataset={handleViewDataset}
          onEditDataset={handleEditDataset}
          onDeleteDataset={handleDeleteDataset}
          onApproveRequest={handleApproveRequest}
          onRejectRequest={handleRejectRequest}
        />
      </div>

      {/* Modals */}
      <RequestsModal
        isOpen={showRequestsModal}
        onClose={() => setShowRequestsModal(false)}
        requests={requests}
        type={requestsType}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
      />

      <UploadDatasetModal
        isOpen={showUploadModal}
        onClose={handleCloseUploadModal}
        onSubmit={handleAddDataset}
        onUpdate={handleUpdateDataset}
        editDataset={editingDataset}
        mode={editingDataset ? 'edit' : 'create'}
      />
    </DashboardLayout>
  );
}