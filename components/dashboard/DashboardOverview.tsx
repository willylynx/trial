'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Download, 
  Send, 
  Eye, 
  Calendar,
  ArrowUpRight,
  Globe,
  Lock,
  Plus,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardStats as StatsType, UserDataset } from '@/types/dashboard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardOverviewProps {
  stats: StatsType;
  recentDatasets: UserDataset[];
  onViewRequests: (type: 'received' | 'sent') => void;
  onUploadDataset: () => void;
  onViewDataset: (dataset: UserDataset) => void;
  onEditDataset: (dataset: UserDataset) => void;
  onDeleteDataset: (datasetId: string) => void;
}

export function DashboardOverview({ 
  stats, 
  recentDatasets, 
  onViewRequests, 
  onUploadDataset,
  onViewDataset,
  onEditDataset,
  onDeleteDataset
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
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
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

      {/* Recent Datasets Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recent Datasets</h2>
            <p className="text-gray-600 mt-1">Your latest uploaded datasets</p>
          </div>
          <Button 
            onClick={onUploadDataset}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload Dataset
          </Button>
        </div>

        {/* Dataset Cards Grid - 2 rows, 3 per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentDatasets.slice(0, 6).map((dataset, index) => (
            <motion.div
              key={dataset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="group hover:shadow-lg transition-all duration-200 border border-gray-200 bg-white h-full flex flex-col">
                <CardContent className="p-6 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          dataset.status === 'active' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}
                      >
                        {dataset.status}
                      </Badge>
                      <Badge 
                        variant="outline"
                        className="text-xs flex items-center gap-1"
                      >
                        {dataset.accessibility === 'public' ? (
                          <Globe className="w-3 h-3" />
                        ) : (
                          <Lock className="w-3 h-3" />
                        )}
                        {dataset.accessibility}
                      </Badge>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditDataset(dataset)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDeleteDataset(dataset.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                    {dataset.title}
                  </h3>
                  
                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4" />
                    {formatDate(dataset.uploadDate)}
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                    {dataset.description.replace(/<[^>]*>/g, '')}
                  </p>
                  
                  {/* Categories */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {dataset.category.slice(0, 2).map((cat) => (
                      <Badge key={cat} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                        {cat}
                      </Badge>
                    ))}
                    {dataset.category.length > 2 && (
                      <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                        +{dataset.category.length - 2}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Stats & Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {formatNumber(dataset.views)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {formatNumber(dataset.downloads)}
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => onViewDataset(dataset)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Datasets Link */}
        {recentDatasets.length > 6 && (
          <div className="text-center pt-4">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/datasets'}
              className="border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            >
              View All Datasets ({recentDatasets.length})
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}