'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardStats as StatsType } from '@/types/dashboard';
import { Database, Download, Upload, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardStatsProps {
  stats: StatsType;
  onViewRequests: (type: 'received' | 'sent') => void;
}

export function DashboardStats({ stats, onViewRequests }: DashboardStatsProps) {
  const statCards = [
    {
      title: 'Total Datasets',
      value: stats.datasetsUploaded,
      icon: Database,
      description: 'Datasets uploaded',
      action: null,
      color: 'text-blue-600'
    },
    {
      title: 'Access Requests',
      value: stats.requestsReceived,
      icon: Download,
      description: 'Pending requests',
      action: () => onViewRequests('received'),
      color: 'text-green-600'
    },
    {
      title: 'Sent Requests',
      value: stats.requestsSent,
      icon: Upload,
      description: 'Your requests',
      action: () => onViewRequests('sent'),
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="border border-gray-200 hover:shadow-sm transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                  </div>
                </div>
                
                {stat.action && stat.value > 0 && (
                  <Button
                    onClick={stat.action}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}