'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Database, 
  Download, 
  Send, 
  Eye, 
  Calendar,
  ArrowUpRight,
  Globe,
  Lock,
  Activity,
  MessageCircle,
  Check,
  X,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardStats as StatsType, UserDataset, DatasetRequest } from '@/types/dashboard';

interface DashboardOverviewProps {
  stats: StatsType;
  recentDatasets: UserDataset[];
  requests: DatasetRequest[];
  onViewRequests: (type: 'received' | 'sent') => void;
  onUploadDataset: () => void;
  onViewDataset: (dataset: UserDataset) => void;
  onEditDataset: (dataset: UserDataset) => void;
  onDeleteDataset: (datasetId: string) => void;
  onApproveRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
}

export function DashboardOverview({ 
  stats, 
  recentDatasets, 
  requests,
  onViewRequests, 
  onUploadDataset,
  onViewDataset,
  onEditDataset,
  onDeleteDataset,
  onApproveRequest,
  onRejectRequest
}: DashboardOverviewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const receivedRequests = requests.filter(req => req.status === 'pending').slice(0, 2);
  const sentRequests = requests.filter(req => req.status !== 'pending').slice(0, 2);

  const statCards = [
    {
      title: 'Total Datasets',
      value: stats.datasetsUploaded,
      icon: Database,
      description: 'Datasets uploaded',
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      title: 'Access Requests',
      value: stats.requestsReceived,
      icon: Download,
      description: 'Click to view',
      action: () => onViewRequests('received'),
      clickable: stats.requestsReceived > 0,
      color: 'bg-green-50 text-green-600 border-green-200'
    },
    {
      title: 'Sent Requests',
      value: stats.requestsSent,
      icon: Send,
      description: 'Click to view',
      action: () => onViewRequests('sent'),
      clickable: stats.requestsSent > 0,
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    }
  ];

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <Card 
              className={`border hover:shadow-md transition-all duration-200 ${
                stat.clickable ? 'cursor-pointer hover:border-gray-300' : ''
              }`}
              onClick={stat.clickable ? stat.action : undefined}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  {stat.clickable && (
                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-900">{stat.title}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity & Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Datasets */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Card className="border border-gray-200 h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-gray-700" />
                  Recent Datasets
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600 hover:text-gray-900"
                  onClick={() => window.location.href = '/datasets'}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentDatasets.slice(0, 6).map((dataset, index) => (
                <motion.div
                  key={dataset.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (index * 0.05), duration: 0.3 }}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                  onClick={() => onViewDataset(dataset)}
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Database className="w-6 h-6 text-gray-700" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 truncate group-hover:text-gray-700 transition-colors">
                        {dataset.title}
                      </h3>
                      <Badge 
                        variant={dataset.accessibility === 'public' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {dataset.accessibility === 'public' ? (
                          <Globe className="w-3 h-3 mr-1" />
                        ) : (
                          <Lock className="w-3 h-3 mr-1" />
                        )}
                        {dataset.accessibility}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(dataset.uploadDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {formatNumber(dataset.views)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {formatNumber(dataset.downloads)}
                      </span>
                    </div>
                  </div>
                  
                  <ArrowUpRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
              
              {recentDatasets.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Database className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-4">No datasets uploaded yet</p>
                  <Button onClick={onUploadDataset} className="bg-gray-900 hover:bg-gray-800">
                    Upload Your First Dataset
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Requests Section */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {/* Received Requests */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-gray-700" />
                  Received Requests
                </CardTitle>
                {receivedRequests.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-600 hover:text-gray-900"
                    onClick={() => onViewRequests('received')}
                  >
                    View All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {receivedRequests.length > 0 ? (
                receivedRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (index * 0.1), duration: 0.3 }}
                    className="p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-gray-100 text-gray-600">
                          {request.requesterName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {request.requesterName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {request.datasetTitle}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            size="sm"
                            onClick={() => onApproveRequest(request.id)}
                            className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onRejectRequest(request.id)}
                            className="h-6 px-2 text-xs border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-6">
                  <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No pending requests</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sent Requests */}
          <Card className="border border-gray-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Send className="w-5 h-5 text-gray-700" />
                  Sent Requests
                </CardTitle>
                {sentRequests.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-600 hover:text-gray-900"
                    onClick={() => onViewRequests('sent')}
                  >
                    View All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {sentRequests.length > 0 ? (
                sentRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + (index * 0.1), duration: 0.3 }}
                    className="p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {request.datasetTitle}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant={request.status === 'approved' ? 'default' : 'outline'}
                            className={`text-xs ${
                              request.status === 'approved' 
                                ? 'bg-green-50 text-green-700 border-green-200' 
                                : request.status === 'rejected'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }`}
                          >
                            {request.status === 'approved' && <Check className="w-3 h-3 mr-1" />}
                            {request.status === 'rejected' && <X className="w-3 h-3 mr-1" />}
                            {request.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                            {request.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatDate(request.requestDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Send className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No sent requests</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}