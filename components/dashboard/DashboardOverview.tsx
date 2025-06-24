'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Database, 
  TrendingUp, 
  Users, 
  Download, 
  Eye, 
  Calendar,
  ArrowUpRight,
  Plus,
  Activity,
  BarChart3,
  Globe,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardStats as StatsType, UserDataset } from '@/types/dashboard';

interface DashboardOverviewProps {
  stats: StatsType;
  recentDatasets: UserDataset[];
  onViewRequests: (type: 'received' | 'sent') => void;
  onUploadDataset: () => void;
  onViewDataset: (dataset: UserDataset) => void;
}

export function DashboardOverview({ 
  stats, 
  recentDatasets, 
  onViewRequests, 
  onUploadDataset,
  onViewDataset 
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
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Access Requests',
      value: stats.requestsReceived,
      icon: Download,
      description: 'Pending requests',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      action: () => onViewRequests('received')
    },
    {
      title: 'Sent Requests',
      value: stats.requestsSent,
      icon: TrendingUp,
      description: 'Your requests',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      action: () => onViewRequests('sent')
    }
  ];

  const totalViews = recentDatasets.reduce((acc, dataset) => acc + dataset.views, 0);
  const totalDownloads = recentDatasets.reduce((acc, dataset) => acc + dataset.downloads, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-purple-50 rounded-2xl p-8 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Here's what's happening with your datasets today.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{formatNumber(totalViews)} total views</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>{formatNumber(totalDownloads)} total downloads</span>
              </div>
            </div>
          </div>
          <Button 
            onClick={onUploadDataset}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Upload Dataset
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200 group">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-200`} />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  {stat.action && stat.value > 0 && (
                    <Button
                      onClick={stat.action}
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
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

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Datasets */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Recent Datasets
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentDatasets.slice(0, 4).map((dataset, index) => (
                <motion.div
                  key={dataset.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                  onClick={() => onViewDataset(dataset)}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <Database className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
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
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Insights */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={onUploadDataset}
                variant="outline" 
                className="w-full justify-start h-12 border-dashed border-2 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <Plus className="w-4 h-4 mr-3" />
                Upload New Dataset
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start h-12"
                onClick={() => onViewRequests('received')}
              >
                <Users className="w-4 h-4 mr-3" />
                Manage Requests
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start h-12"
              >
                <BarChart3 className="w-4 h-4 mr-3" />
                View Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Views</span>
                <span className="font-semibold text-gray-900">{formatNumber(totalViews)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Downloads</span>
                <span className="font-semibold text-gray-900">{formatNumber(totalDownloads)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">New Requests</span>
                <span className="font-semibold text-gray-900">{stats.requestsReceived}</span>
              </div>
              <div className="pt-2 border-t border-green-200">
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12% from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}