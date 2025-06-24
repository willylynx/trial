'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { UserDataset } from '@/types/dashboard';
import { Search, Eye, Download, Calendar, Globe, Lock, MoreVertical, Edit, Trash2, Plus } from 'lucide-react';
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
  showAddButton?: boolean;
  onAddDataset?: () => void;
}

export function DatasetList({ 
  datasets, 
  onViewDataset, 
  onEditDataset, 
  onDeleteDataset,
  showAddButton = false,
  onAddDataset
}: DatasetListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredDatasets = datasets.filter(dataset =>
    dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dataset.category.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase())) ||
    dataset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {showAddButton ? 'Recent Datasets' : 'All Datasets'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredDatasets.length} of {datasets.length} datasets
          </p>
        </div>
        
        {showAddButton && onAddDataset && (
          <Button onClick={onAddDataset} className="bg-gray-900 hover:bg-gray-800">
            <Plus className="w-4 h-4 mr-2" />
            Upload Dataset
          </Button>
        )}
      </div>

      {/* Search */}
      {!showAddButton && (
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search datasets..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 border-gray-200 focus:border-gray-300 focus:ring-0"
          />
        </div>
      )}

      {/* Dataset Grid */}
      <AnimatePresence mode="wait">
        {paginatedDatasets.length > 0 ? (
          <motion.div
            key="datasets"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {paginatedDatasets.map((dataset, index) => (
              <motion.div
                key={dataset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-md transition-all duration-200 border border-gray-200 bg-white h-full flex flex-col">
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
              <Database className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No datasets found</h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try adjusting your search terms' : 'You haven\'t uploaded any datasets yet'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && !showAddButton && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="border-gray-200 hover:border-gray-300"
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={currentPage === page 
                  ? "bg-gray-900 text-white" 
                  : "border-gray-200 hover:border-gray-300"
                }
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="border-gray-200 hover:border-gray-300"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}