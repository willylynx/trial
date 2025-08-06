'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { UserDataset } from '@/types/dashboard';
import { Search, Eye, Download, Calendar, Globe, Lock, MoreVertical, Edit, Trash2, ChevronLeft, ChevronRight, X, Link, FileText, File, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DatasetListProps {
  datasets: UserDataset[];
  onViewDataset: (dataset: UserDataset) => void;
  onEditDataset: (dataset: UserDataset) => void;
  onDeleteDataset: (datasetId: string) => void;
}

export function DatasetList({ 
  datasets, 
  onViewDataset, 
  onEditDataset, 
  onDeleteDataset
}: DatasetListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3 rows of 3 cards each

  const filteredDatasets = datasets.filter(dataset =>
    dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dataset.category.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase())) ||
    dataset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    dataset.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dataset.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDatasets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDatasets = filteredDatasets.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getFileExtensionColor = (extension: string) => {
    switch (extension.toLowerCase()) {
      case 'csv': return 'bg-green-50 text-green-700 border-green-200';
      case 'json': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'xlsx': case 'xls': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pdf': return 'bg-red-50 text-red-700 border-red-200';
      case 'xml': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'zip': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'txt': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getFileIcon = (extension: string) => {
    switch (extension.toLowerCase()) {
      case 'csv': case 'xlsx': case 'xls': return FileText;
      case 'json': case 'xml': return File;
      default: return FileText;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="space-y-8">
      {/* Clean Header with Search */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery ? 'Search Results' : 'All Datasets'}
            </h2>
            <p className="text-gray-600 mt-1">
              {searchQuery ? (
                <>
                  {filteredDatasets.length} of {datasets.length} datasets matching "{searchQuery}"
                </>
              ) : (
                `${datasets.length} total datasets`
              )}
            </p>
          </div>
        </div>

        {/* Clean Search Bar */}
        <div className="relative max-w-lg">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search datasets by title, category, tags, or source..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 py-3 text-base border-gray-200 focus:border-gray-400 focus:ring-0 bg-white hover:bg-gray-50 transition-colors rounded-lg"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4 text-gray-400" />
            </Button>
          )}
        </div>
      </div>

      {/* Dataset Grid */}
      <AnimatePresence mode="wait">
        {paginatedDatasets.length > 0 ? (
          <motion.div
            key={`page-${currentPage}-${searchQuery}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {paginatedDatasets.map((dataset, index) => (
              <motion.div
                key={dataset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-200 border border-gray-200 bg-white h-full flex flex-col">
                  <CardContent className="p-6 flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getStatusColor(dataset.status)}`}
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
                        
                        {/* File Extension Badge */}
                        {dataset.fileExtension && (
                          <Badge 
                            variant="outline"
                            className={`text-xs flex items-center gap-1 ${getFileExtensionColor(dataset.fileExtension)}`}
                          >
                            {(() => {
                              const FileIcon = getFileIcon(dataset.fileExtension);
                              return <FileIcon className="w-3 h-3" />;
                            })()}
                            {dataset.fileExtension.toUpperCase()}
                          </Badge>
                        )}
                        
                        {/* Link/Upload Type Badge */}
                        <Badge 
                          variant="outline"
                          className={`text-xs flex items-center gap-1 ${
                            dataset.isLink 
                              ? 'bg-blue-50 text-blue-700 border-blue-200' 
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          }`}
                        >
                          {dataset.isLink ? (
                            <>
                              <Link className="w-3 h-3" />
                              Link
                            </>
                          ) : (
                            <>
                              <Upload className="w-3 h-3" />
                              Upload
                            </>
                          )}
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
                    
                    {/* Source & Date */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span className="font-medium">{dataset.source}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(dataset.uploadDate)}
                      </div>
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
                          {dataset.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          {dataset.downloads}
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
          </motion.div>
        ) : (
          <motion.div
            key="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No datasets found' : 'No datasets yet'}
            </h3>
            <p className="text-gray-600">
              {searchQuery ? (
                <>
                  No datasets match "{searchQuery}". Try different keywords.
                </>
              ) : (
                'You haven\'t uploaded any datasets yet'
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination - Always show when there are results and multiple pages */}
      {filteredDatasets.length > 0 && totalPages > 1 && (
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
      {filteredDatasets.length > 0 && totalPages > 1 && (
        <div className="text-center text-sm text-gray-500">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDatasets.length)} of {filteredDatasets.length} datasets
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      )}
    </div>
  );
}