'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { DatasetList } from '@/components/dashboard/DatasetList';
import { AddDatasetForm } from '@/components/dashboard/AddDatasetForm';
import { RequestsModal } from '@/components/dashboard/RequestsModal';
import { UserProfile } from '@/components/profile/UserProfile';
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
    fileSize: '2.3 GB'
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
    fileSize: '1.8 GB'
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
    fileSize: '890 MB'
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
    fileSize: '1.5 GB'
  },
  {
    id: '5',
    title: 'Educational Performance Metrics 2023',
    source: 'UNESCO',
    category: ['Education'],
    country: ['Multiple'],
    tags: ['education', 'performance', 'schools', 'literacy'],
    accessibility: 'public',
    description: 'Educational performance data including literacy rates, graduation rates, and academic achievement scores.',
    uploadDate: '2023-12-28',
    views: 780,
    downloads: 123,
    requests: 7,
    status: 'active',
    fileSize: '650 MB'
  },
  {
    id: '6',
    title: 'Renewable Energy Production Statistics',
    source: 'IEA',
    category: ['Energy', 'Environment'],
    country: ['Global'],
    tags: ['renewable', 'energy', 'solar', 'wind', 'production'],
    accessibility: 'public',
    description: 'Global renewable energy production statistics including solar, wind, and hydroelectric power generation data.',
    uploadDate: '2023-12-25',
    views: 1100,
    downloads: 245,
    requests: 15,
    status: 'active',
    fileSize: '980 MB'
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
  }
];

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'datasets' | 'add-dataset' | 'profile'>('dashboard');
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [requestsType, setRequestsType] = useState<'received' | 'sent'>('received');
  const [datasets, setDatasets] = useState(mockDatasets);
  const [requests, setRequests] = useState(mockRequests);
  const [user, setUser] = useState(mockUser);

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
    console.log('Edit dataset:', dataset);
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
    setCurrentPage('datasets');
  };

  const handleUpdateProfile = (data: Partial<UserProfileType>) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  const handleUpdatePassword = (data: { currentPassword: string; newPassword: string }) => {
    console.log('Update password:', data);
    // In real app, this would call an API to update the password
  };

  const handleUpdateAvatar = (file: File) => {
    console.log('Update avatar:', file);
    // In real app, upload file and update user avatar URL
    // For demo, we'll just show a success message
    const reader = new FileReader();
    reader.onload = (e) => {
      setUser(prev => ({ ...prev, avatar: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    console.log('Logout');
    // In real app, clear auth and redirect
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <DashboardStats stats={mockStats} onViewRequests={handleViewRequests} />
            <DatasetList
              datasets={datasets.slice(0, 6)}
              onViewDataset={handleViewDataset}
              onEditDataset={handleEditDataset}
              onDeleteDataset={handleDeleteDataset}
              showAddButton={true}
              onAddDataset={() => setCurrentPage('add-dataset')}
            />
          </div>
        );
      
      case 'datasets':
        return (
          <DatasetList
            datasets={datasets}
            onViewDataset={handleViewDataset}
            onEditDataset={handleEditDataset}
            onDeleteDataset={handleDeleteDataset}
          />
        );
      
      case 'add-dataset':
        return (
          <AddDatasetForm
            onSubmit={handleAddDataset}
            onCancel={() => setCurrentPage('datasets')}
          />
        );
      
      case 'profile':
        return (
          <UserProfile
            user={user}
            onUpdateProfile={handleUpdateProfile}
            onUpdatePassword={handleUpdatePassword}
            onUpdateAvatar={handleUpdateAvatar}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <DashboardLayout
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        user={user}
        onLogout={handleLogout}
      >
        {renderContent()}
      </DashboardLayout>

      <RequestsModal
        isOpen={showRequestsModal}
        onClose={() => setShowRequestsModal(false)}
        requests={requests}
        type={requestsType}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
      />
    </>
  );
}