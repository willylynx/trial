'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DatasetList } from '@/components/dashboard/DatasetList';
import { UploadDatasetModal } from '@/components/modals/UploadDatasetModal';
import { 
  UserDataset, 
  UserProfile as UserProfileType,
  NewDatasetForm 
} from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Database, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock user data
const mockUser: UserProfileType = {
  id: '1',
  fullName: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@university.edu',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
  dateJoined: '2023-06-15',
  bio: 'Climate researcher specializing in global temperature analysis and environmental data science.',
  organization: 'Stanford University',
  location: 'California, USA'
};

// Extended mock datasets for pagination demo
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
    fileSize: '650 MB',
    externalUrl: 'https://uis.unesco.org/en/uis-student-flow'
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
    fileSize: '980 MB',
    externalUrl: 'https://www.iea.org/data-and-statistics'
  },
  {
    id: '7',
    title: 'Social Media Sentiment Analysis Dataset',
    source: 'Twitter API',
    category: ['Technology', 'Social'],
    country: ['Global'],
    tags: ['social media', 'sentiment', 'analysis', 'NLP'],
    accessibility: 'private',
    description: 'Large-scale social media sentiment analysis dataset containing millions of tweets with sentiment labels.',
    uploadDate: '2023-12-20',
    views: 2340,
    downloads: 567,
    requests: 23,
    status: 'active',
    fileSize: '4.2 GB',
    fileUrl: 'sentiment-data.json'
  },
  {
    id: '8',
    title: 'Global Food Security Index 2023',
    source: 'FAO',
    category: ['Agriculture', 'Economy'],
    country: ['Global'],
    tags: ['food security', 'agriculture', 'nutrition', 'FAO'],
    accessibility: 'public',
    description: 'Comprehensive food security indicators including availability, accessibility, utilization, and stability metrics.',
    uploadDate: '2023-12-15',
    views: 890,
    downloads: 234,
    requests: 11,
    status: 'active',
    fileSize: '1.3 GB',
    externalUrl: 'https://www.fao.org/faostat/en/'
  },
  {
    id: '9',
    title: 'Urban Transportation Patterns 2023',
    source: 'Department of Transportation',
    category: ['Transport', 'Urban'],
    country: ['United States'],
    tags: ['transportation', 'urban', 'mobility', 'traffic'],
    accessibility: 'public',
    description: 'Urban transportation patterns and mobility data from major metropolitan areas.',
    uploadDate: '2023-12-10',
    views: 567,
    downloads: 123,
    requests: 8,
    status: 'active',
    fileSize: '2.1 GB',
    fileUrl: 'transport-data.csv'
  },
  {
    id: '10',
    title: 'Biodiversity Conservation Status Report',
    source: 'IUCN',
    category: ['Environment', 'Conservation'],
    country: ['Global'],
    tags: ['biodiversity', 'conservation', 'species', 'IUCN'],
    accessibility: 'public',
    description: 'Global biodiversity conservation status and species threat assessment data.',
    uploadDate: '2023-12-05',
    views: 445,
    downloads: 89,
    requests: 6,
    status: 'active',
    fileSize: '756 MB',
    externalUrl: 'https://www.iucnredlist.org/'
  }
];

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState(mockDatasets);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingDataset, setEditingDataset] = useState<UserDataset | null>(null);

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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border border-gray-200 bg-gradient-to-r from-gray-50 to-white shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-900 rounded-xl flex items-center justify-center">
                    <Database className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Datasets</h1>
                    <p className="text-gray-600 mt-1">
                      Manage and organize all your research datasets
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={() => setShowUploadModal(true)}
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Dataset
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{datasets.length}</div>
                  <div className="text-sm text-gray-600">Total Datasets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {datasets.reduce((acc, d) => acc + d.views, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {datasets.reduce((acc, d) => acc + d.downloads, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Downloads</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dataset List with Pagination */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DatasetList
            datasets={datasets}
            onViewDataset={handleViewDataset}
            onEditDataset={handleEditDataset}
            onDeleteDataset={handleDeleteDataset}
          />
        </motion.div>
      </div>

      {/* Upload Modal */}
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