'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatasetRequest } from '@/types/dashboard';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Send, 
  Calendar, 
  Mail, 
  Check, 
  X, 
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Extended mock data for demonstration
const mockReceivedRequests: DatasetRequest[] = [
  {
    id: '1',
    datasetId: '2',
    datasetTitle: 'Urban Air Quality Index - Major Cities 2023',
    requesterName: 'Dr. Michael Chen',
    requesterEmail: 'michael.chen@research.org',
    requestDate: '2024-01-20',
    status: 'pending',
    message: 'I would like to use this dataset for my research on urban pollution patterns. This data would be invaluable for my upcoming publication on air quality trends in metropolitan areas.'
  },
  {
    id: '2',
    datasetId: '1',
    datasetTitle: 'Global Climate Temperature Anomalies 1880-2023',
    requesterName: 'Prof. Emily Rodriguez',
    requesterEmail: 'emily.rodriguez@university.edu',
    requestDate: '2024-01-18',
    status: 'approved',
    message: 'Requesting access for climate modeling research project funded by NSF. This dataset is crucial for our climate change impact assessment study.'
  },
  {
    id: '3',
    datasetId: '4',
    datasetTitle: 'Healthcare Treatment Outcomes Database',
    requesterName: 'Dr. James Wilson',
    requesterEmail: 'james.wilson@medcenter.org',
    requestDate: '2024-01-16',
    status: 'pending',
    message: 'Need this data for comparative analysis of treatment effectiveness across different healthcare systems. The research will contribute to improving patient outcomes.'
  },
  {
    id: '4',
    datasetId: '3',
    datasetTitle: 'Economic Growth Indicators - Developing Nations',
    requesterName: 'Dr. Lisa Wang',
    requesterEmail: 'lisa.wang@worldbank.org',
    requestDate: '2024-01-14',
    status: 'rejected',
    message: 'Requesting access for World Bank economic development research initiative focusing on sustainable growth in emerging markets.'
  },
  {
    id: '5',
    datasetId: '5',
    datasetTitle: 'Educational Performance Metrics 2023',
    requesterName: 'Prof. Robert Davis',
    requesterEmail: 'robert.davis@unesco.org',
    requestDate: '2024-01-12',
    status: 'approved',
    message: 'UNESCO education quality assessment project requires this data for global education policy recommendations.'
  },
  {
    id: '6',
    datasetId: '6',
    datasetTitle: 'Renewable Energy Production Statistics',
    requesterName: 'Dr. Sarah Kim',
    requesterEmail: 'sarah.kim@greentech.org',
    requestDate: '2024-01-10',
    status: 'pending',
    message: 'Green technology research initiative focusing on renewable energy adoption patterns and efficiency metrics across different regions.'
  }
];

const mockSentRequests: DatasetRequest[] = [
  {
    id: '7',
    datasetId: '7',
    datasetTitle: 'Global Biodiversity Conservation Data',
    requesterName: 'Dr. Sarah Johnson',
    requesterEmail: 'sarah.johnson@university.edu',
    requestDate: '2024-01-19',
    status: 'pending',
    message: 'Requesting access for biodiversity research project examining conservation effectiveness across different ecosystems.'
  },
  {
    id: '8',
    datasetId: '8',
    datasetTitle: 'Social Media Sentiment Analysis Dataset',
    requesterName: 'Dr. Sarah Johnson',
    requesterEmail: 'sarah.johnson@university.edu',
    requestDate: '2024-01-15',
    status: 'approved',
    message: 'Need this dataset for social psychology research on public opinion trends and sentiment analysis methodologies.'
  },
  {
    id: '9',
    datasetId: '9',
    datasetTitle: 'Financial Market Volatility Index',
    requesterName: 'Dr. Sarah Johnson',
    requesterEmail: 'sarah.johnson@university.edu',
    requestDate: '2024-01-11',
    status: 'rejected',
    message: 'Requesting access for economic research on market stability and risk assessment models for institutional investors.'
  },
  {
    id: '10',
    datasetId: '10',
    datasetTitle: 'Urban Transportation Patterns 2023',
    requesterName: 'Dr. Sarah Johnson',
    requesterEmail: 'sarah.johnson@university.edu',
    requestDate: '2024-01-08',
    status: 'approved',
    message: 'Transportation planning research focusing on sustainable mobility solutions and urban infrastructure optimization.'
  }
];

export function RequestsPage() {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return Check;
      case 'rejected': return X;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  const filterRequests = (requests: DatasetRequest[]) => {
    let filtered = requests;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(request =>
        request.datasetTitle.toLowerCase().includes(query) ||
        request.requesterName.toLowerCase().includes(query) ||
        request.message?.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    return filtered;
  };

  const getCurrentRequests = () => {
    const requests = activeTab === 'received' ? mockReceivedRequests : mockSentRequests;
    const filtered = filterRequests(requests);
    const startIndex = (currentPage - 1) * itemsPerPage;
    return {
      requests: filtered.slice(startIndex, startIndex + itemsPerPage),
      total: filtered.length
    };
  };

  const { requests, total } = getCurrentRequests();
  const totalPages = Math.ceil(total / itemsPerPage);

  const handleApproveRequest = (requestId: string) => {
    console.log('Approve request:', requestId);
  };

  const handleRejectRequest = (requestId: string) => {
    console.log('Reject request:', requestId);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getTabCounts = () => {
    return {
      received: filterRequests(mockReceivedRequests).length,
      sent: filterRequests(mockSentRequests).length
    };
  };

  const tabCounts = getTabCounts();

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Requests</h1>
          <p className="text-gray-600 mt-2">Manage dataset access requests</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Total: <span className="font-semibold text-gray-900">{total}</span> requests
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by dataset, requester, or message..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 border-gray-200 focus:border-gray-400 focus:ring-0"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="w-full md:w-48">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="border-gray-200 focus:border-gray-400 focus:ring-0">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gray-500" />
                      <SelectValue placeholder="Filter by status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-600" />
                        Pending
                      </div>
                    </SelectItem>
                    <SelectItem value="approved">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        Approved
                      </div>
                    </SelectItem>
                    <SelectItem value="rejected">
                      <div className="flex items-center gap-2">
                        <X className="w-4 h-4 text-red-600" />
                        Rejected
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value as 'received' | 'sent');
          setCurrentPage(1);
        }}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger 
              value="received" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Received ({tabCounts.received})
            </TabsTrigger>
            <TabsTrigger 
              value="sent"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Send className="w-4 h-4" />
              Sent ({tabCounts.sent})
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <AnimatePresence mode="wait">
              <TabsContent value={activeTab} className="space-y-4">
                {requests.length > 0 ? (
                  <>
                    {requests.map((request, index) => {
                      const StatusIcon = getStatusIcon(request.status);
                      
                      return (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                        >
                          <Card className="border border-gray-200 hover:shadow-md transition-all duration-200 bg-white">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                  <Avatar className="w-12 h-12">
                                    <AvatarImage src="" alt={request.requesterName} />
                                    <AvatarFallback className="bg-gray-100 text-gray-600">
                                      {request.requesterName.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                      <h3 className="font-semibold text-gray-900">
                                        {request.requesterName}
                                      </h3>
                                      <Badge 
                                        variant="outline" 
                                        className={`flex items-center gap-1 text-xs ${getStatusColor(request.status)}`}
                                      >
                                        <StatusIcon className="w-3 h-3" />
                                        {request.status}
                                      </Badge>
                                    </div>
                                    
                                    <div className="space-y-2 text-sm text-gray-600 mb-3">
                                      <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        {request.requesterEmail}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {formatDate(request.requestDate)}
                                      </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                      <p className="font-medium text-gray-900 text-sm mb-1">
                                        Dataset: {request.datasetTitle}
                                      </p>
                                    </div>

                                    {request.message && (
                                      <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                          <MessageSquare className="w-4 h-4 text-gray-500" />
                                          <span className="text-sm font-medium text-gray-700">Message:</span>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                          {request.message}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {activeTab === 'received' && request.status === 'pending' && (
                                  <div className="flex items-center gap-2">
                                    <Button
                                      onClick={() => handleApproveRequest(request.id)}
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      <Check className="w-4 h-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      onClick={() => handleRejectRequest(request.id)}
                                      size="sm"
                                      variant="outline"
                                      className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                    >
                                      <X className="w-4 h-4 mr-1" />
                                      Reject
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-8 pt-8 border-t border-gray-200">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="border-gray-200 hover:border-gray-300"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Previous
                        </Button>
                        
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNumber;
                            if (totalPages <= 5) {
                              pageNumber = i + 1;
                            } else if (currentPage <= 3) {
                              pageNumber = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNumber = totalPages - 4 + i;
                            } else {
                              pageNumber = currentPage - 2 + i;
                            }

                            return (
                              <Button
                                key={pageNumber}
                                variant={currentPage === pageNumber ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(pageNumber)}
                                className={currentPage === pageNumber 
                                  ? "bg-gray-900 text-white" 
                                  : "border-gray-200 hover:border-gray-300"
                                }
                              >
                                {pageNumber}
                              </Button>
                            );
                          })}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="border-gray-200 hover:border-gray-300"
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    )}

                    {/* Pagination Info */}
                    {totalPages > 1 && (
                      <div className="text-center text-sm text-gray-500">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, total)} of {total} requests
                      </div>
                    )}
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      {activeTab === 'received' ? (
                        <MessageSquare className="w-8 h-8 text-gray-400" />
                      ) : (
                        <Send className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                    <p className="text-gray-600">
                      {searchQuery || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filter criteria'
                        : activeTab === 'received' 
                          ? "You haven't received any dataset requests yet"
                          : "You haven't sent any dataset requests yet"
                      }
                    </p>
                  </motion.div>
                )}
              </TabsContent>
            </AnimatePresence>
          </div>
        </Tabs>
      </motion.div>
    </div>
  );
}