'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SearchResult } from '@/types/search';
import { ExternalLink, Eye, Download, Calendar, Globe, Lock, Users, ArrowUpRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DatasetCardProps {
  dataset: SearchResult;
  onViewDetails: () => void;
}

// Mock authentication state - in real app, this would come from auth context
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const login = () => {
    // Mock login - in real app, this would redirect to login page or open login modal
    setIsAuthenticated(true);
  };

  return { isAuthenticated, login };
};

export function DatasetCard({ dataset, onViewDetails }: DatasetCardProps) {
  const { isAuthenticated, login } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const handleDownload = async () => {
    if (dataset.visibility === 'private' && !isAuthenticated) {
      // Redirect to login or show login modal
      login();
      return;
    }

    setIsDownloading(true);
    
    try {
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, this would trigger actual download
      console.log('Downloading dataset:', dataset.title);
      
      setDownloadComplete(true);
      
      // Reset download complete state after 3 seconds
      setTimeout(() => {
        setDownloadComplete(false);
      }, 3000);
      
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const getDownloadButtonContent = () => {
    if (downloadComplete) {
      return (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Downloaded
        </motion.div>
      );
    }

    if (isDownloading) {
      return (
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Download className="w-4 h-4" />
          </motion.div>
          Downloading...
        </div>
      );
    }

    if (dataset.visibility === 'private' && !isAuthenticated) {
      return (
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Login to Download
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Download className="w-4 h-4" />
        Download
      </div>
    );
  };

  const getDownloadButtonVariant = () => {
    if (downloadComplete) return 'default';
    if (dataset.visibility === 'private' && !isAuthenticated) return 'outline';
    return 'default';
  };

  const getDownloadButtonClass = () => {
    if (downloadComplete) {
      return 'bg-green-600 hover:bg-green-700 text-white border-green-600';
    }
    if (dataset.visibility === 'private' && !isAuthenticated) {
      return 'border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300';
    }
    return 'bg-slate-900 hover:bg-slate-800 text-white';
  };

  return (
    <motion.div
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="group hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200 border border-slate-200 hover:border-slate-300 bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Header with badges */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs font-medium bg-slate-100 text-slate-700">
                    {dataset.category}
                  </Badge>
                  <Badge 
                    variant={dataset.visibility === 'public' ? 'default' : 'outline'}
                    className="text-xs flex items-center gap-1"
                  >
                    {dataset.visibility === 'public' ? (
                      <Globe className="w-3 h-3" />
                    ) : (
                      <Lock className="w-3 h-3" />
                    )}
                    {dataset.visibility}
                  </Badge>
                </div>
                
                {/* Source in top right */}
                <div className="text-xs text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-md">
                  {dataset.source}
                </div>
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-semibold text-slate-900 mb-3 line-clamp-2 group-hover:text-slate-800 transition-colors leading-tight">
                {dataset.title}
              </h3>
              
              {/* Description */}
              <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
                {dataset.description}
              </p>

              {/* Uploader Info */}
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={dataset.uploader.avatar} alt={dataset.uploader.name} />
                  <AvatarFallback className="text-xs bg-slate-100 text-slate-600">
                    {dataset.uploader.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900">
                    {dataset.uploader.name}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(dataset.uploadDate)}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-slate-500 mb-4">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>{formatNumber(dataset.views)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Download className="w-4 h-4" />
                  <span>{formatNumber(dataset.downloads)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{dataset.comments}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {dataset.tags.slice(0, 4).map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="text-xs px-2 py-0.5 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
                {dataset.tags.length > 4 && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5 bg-white border-slate-200 text-slate-500">
                    +{dataset.tags.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={onViewDetails}
              variant="outline"
              size="sm"
              className="flex-1 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
            >
              View Details
            </Button>
            
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              size="sm"
              variant={getDownloadButtonVariant()}
              className={`flex-1 transition-all duration-200 ${getDownloadButtonClass()}`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={downloadComplete ? 'complete' : isDownloading ? 'loading' : 'default'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {getDownloadButtonContent()}
                </motion.div>
              </AnimatePresence>
            </Button>
            
            <Button
              onClick={() => window.open(dataset.originalUrl, '_blank')}
              size="sm"
              variant="ghost"
              className="px-3 hover:bg-slate-100 transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Authentication Notice for Private Datasets */}
          <AnimatePresence>
            {dataset.visibility === 'private' && !isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg"
              >
                <div className="flex items-center gap-2 text-sm text-amber-800">
                  <Lock className="w-4 h-4" />
                  <span>This dataset requires authentication to download</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}