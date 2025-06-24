import { SearchResult, FilterState, SearchResponse } from '@/types/search';

// Mock dataset results
const mockResults: SearchResult[] = [
  {
    id: '1',
    title: 'Global Climate Change Temperature Anomalies 1880-2023',
    description: 'Comprehensive dataset containing global temperature anomalies from 1880 to 2023, including land and ocean temperature measurements from weather stations worldwide. This dataset provides crucial insights into long-term climate trends and is essential for climate research and policy making.',
    source: 'NASA Goddard Institute for Space Studies',
    category: 'Climate',
    visibility: 'private',
    uploader: {
      name: 'Dr. Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    uploadDate: '2024-01-15',
    views: 45230,
    downloads: 12543,
    comments: 89,
    tags: ['climate', 'temperature', 'global warming', 'NASA', 'weather'],
    originalUrl: 'https://data.giss.nasa.gov/gistemp/'
  },
  {
    id: '2',
    title: 'World Bank Education Statistics by Country 2000-2023',
    description: 'Educational indicators and statistics from countries worldwide, including literacy rates, school enrollment, education expenditure, and educational outcomes. This comprehensive dataset covers primary, secondary, and tertiary education metrics.',
    source: 'World Bank Open Data',
    category: 'Education',
    visibility: 'private',
    uploader: {
      name: 'Prof. Michael Chen',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    uploadDate: '2024-01-12',
    views: 32180,
    downloads: 8921,
    comments: 56,
    tags: ['education', 'world bank', 'literacy', 'enrollment', 'statistics'],
    originalUrl: 'https://databank.worldbank.org/source/education-statistics'
  },
  {
    id: '3',
    title: 'WHO Global Health Observatory Data Repository',
    description: 'Health statistics and indicators from the World Health Organization covering mortality, morbidity, health system performance, and health determinants across all WHO member states. Updated annually with the latest available data.',
    source: 'World Health Organization',
    category: 'Health',
    visibility: 'private',
    uploader: {
      name: 'Dr. Emily Rodriguez',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    uploadDate: '2024-01-10',
    views: 28750,
    downloads: 15672,
    comments: 124,
    tags: ['health', 'WHO', 'mortality', 'healthcare', 'global health'],
    originalUrl: 'https://www.who.int/data/gho'
  },
  {
    id: '4',
    title: 'Global Transport Infrastructure Database',
    description: 'Comprehensive database of transport infrastructure including roads, railways, airports, and ports across 195 countries. Contains detailed information about infrastructure quality, capacity, and connectivity metrics.',
    source: 'International Transport Forum',
    category: 'Transport',
    visibility: 'private',
    uploader: {
      name: 'Dr. James Thompson',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    uploadDate: '2024-01-08',
    views: 19420,
    downloads: 6834,
    comments: 43,
    tags: ['transport', 'infrastructure', 'roads', 'railways', 'connectivity'],
    originalUrl: 'https://www.itf-oecd.org/transport-infrastructure-database'
  },
  {
    id: '5',
    title: 'UN Environment Programme Global Environmental Data',
    description: 'Environmental indicators and data covering air quality, water resources, biodiversity, waste management, and environmental policies from UN member countries. Essential for environmental research and policy analysis.',
    source: 'UN Environment Programme',
    category: 'Environment',
    visibility: 'private',
    uploader: {
      name: 'Dr. Lisa Wang',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    uploadDate: '2024-01-05',
    views: 22340,
    downloads: 4521,
    comments: 67,
    tags: ['environment', 'UN', 'air quality', 'biodiversity', 'sustainability'],
    originalUrl: 'https://www.unep.org/resources'
  },
  {
    id: '6',
    title: 'International Monetary Fund Economic Indicators',
    description: 'Economic and financial data including GDP, inflation, unemployment, trade balance, and fiscal indicators for IMF member countries. Quarterly and annual data with historical time series going back to 1980.',
    source: 'International Monetary Fund',
    category: 'Economy',
    visibility: 'public',
    uploader: {
      name: 'Prof. Robert Davis',
      avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    uploadDate: '2024-01-03',
    views: 38920,
    downloads: 11203,
    comments: 92,
    tags: ['economy', 'IMF', 'GDP', 'inflation', 'financial'],
    originalUrl: 'https://www.imf.org/en/Data'
  }
];

export function searchDatasets(query: string, filters: FilterState): SearchResponse {
  let results = [...mockResults];

  // Filter by search query
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    results = results.filter(dataset => 
      dataset.title.toLowerCase().includes(searchTerm) ||
      dataset.description.toLowerCase().includes(searchTerm) ||
      dataset.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      dataset.category.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by category
  if (filters.category) {
    results = results.filter(dataset => 
      dataset.category.toLowerCase() === filters.category.toLowerCase()
    );
  }

  // Filter by country (mock implementation - in real app, this would filter by dataset country)
  if (filters.country) {
    // For demo purposes, we'll just return all results
    // In a real implementation, you'd filter based on dataset country metadata
  }

  // Sort results
  switch (filters.sortBy) {
    case 'recent':
      results.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
      break;
    case 'downloads':
      results.sort((a, b) => b.downloads - a.downloads);
      break;
    case 'views':
      results.sort((a, b) => b.views - a.views);
      break;
    case 'relevance':
    default:
      // Keep original order for relevance (in real app, this would be based on search relevance score)
      break;
  }

  return {
    results,
    total: results.length
  };
}