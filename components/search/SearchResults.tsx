'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchHeader } from './SearchHeader';
import { SearchFilters } from './SearchFilters';
import { DatasetCard } from './DatasetCard';
import { DatasetModal } from './DatasetModal';
import { searchDatasets } from '@/lib/search';
import { SearchResult, FilterState } from '@/types/search';
import { Loader2, Filter, X, Database, TrendingUp, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export function SearchResults() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useQueryState('q', { defaultValue: '' });
  const [category, setCategory] = useQueryState('category', { defaultValue: '' });
  const [country, setCountry] = useQueryState('country', { defaultValue: '' });
  const [sortBy, setSortBy] = useQueryState('sort', { defaultValue: 'relevance' });
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedDataset, setSelectedDataset] = useState<SearchResult | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filters: FilterState = {
    category,
    country,
    sortBy
  };

  useEffect(() => {
    const initialQuery = searchParams.get('q') || '';
    if (initialQuery && initialQuery !== query) {
      setQuery(initialQuery);
    }
  }, [searchParams, query, setQuery]);

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, category, country, sortBy]);

  const performSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      const searchResults = searchDatasets(query, filters);
      setResults(searchResults.results);
      setTotalResults(searchResults.total);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
  };

  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    switch (filterType) {
      case 'category':
        setCategory(value === 'all' ? '' : value);
        break;
      case 'country':
        setCountry(value === 'all' ? '' : value);
        break;
      case 'sortBy':
        setSortBy(value);
        break;
    }
  };

  const clearFilter = (filterType: keyof FilterState) => {
    handleFilterChange(filterType, '');
  };

  const clearAllFilters = () => {
    setCategory('');
    setCountry('');
    setSortBy('relevance');
  };

  const activeFilters = Object.entries(filters).filter(([key, value]) => 
    value && value !== 'relevance' && key !== 'sortBy'
  );

  const getSortLabel = (sortValue: string) => {
    switch (sortValue) {
      case 'recent': return 'Most Recent';
      case 'downloads': return 'Most Downloaded';
      case 'views': return 'Most Viewed';
      default: return 'Most Relevant';
    }
  };

  const getSortIcon = (sortValue: string) => {
    switch (sortValue) {
      case 'recent': return Clock;
      case 'downloads': return Database;
      case 'views': return Eye;
      default: return TrendingUp;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SearchHeader 
        initialQuery={query} 
        onSearch={handleSearch}
        totalResults={totalResults}
        loading={loading}
      />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Results Header */}
        <AnimatePresence>
          {(query || loading) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              {/* Results Summary Card */}
              <Card className="border border-slate-200 bg-gradient-to-r from-slate-50 to-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      {/* Results Count */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                          <Database className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-slate-900">
                            {loading ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Searching...
                              </div>
                            ) : (
                              `${totalResults.toLocaleString()} datasets`
                            )}
                          </div>
                          <div className="text-sm text-slate-600">
                            {query && !loading && (
                              <>
                                Found for "<span className="font-semibold text-slate-900">{query}</span>"
                              </>
                            )}
                            {loading && (
                              <span>Finding the best matches for you</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Sort Info */}
                      {!loading && totalResults > 0 && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 border-l border-slate-200 pl-6">
                          {(() => {
                            const SortIcon = getSortIcon(sortBy);
                            return (
                              <>
                                <SortIcon className="w-4 h-4" />
                                <span>Sorted by {getSortLabel(sortBy)}</span>
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>

                    {/* Filter Toggle */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
                    >
                      <Filter className="w-4 h-4" />
                      <span className="hidden sm:inline">Filters</span>
                      {(activeFilters.length > 0 || sortBy !== 'relevance') && (
                        <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs bg-slate-900 text-white">
                          {activeFilters.length + (sortBy !== 'relevance' ? 1 : 0)}
                        </Badge>
                      )}
                    </Button>
                  </div>

                  {/* Active Filters */}
                  <AnimatePresence>
                    {(activeFilters.length > 0 || sortBy !== 'relevance') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-slate-200"
                      >
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-sm font-medium text-slate-700">Active filters:</span>
                          {activeFilters.map(([key, value]) => (
                            <Badge
                              key={key}
                              variant="secondary"
                              className="flex items-center gap-1.5 pr-1 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                            >
                              <span className="capitalize text-xs">{key}: {value}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-slate-300 rounded-full"
                                onClick={() => clearFilter(key as keyof FilterState)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </Badge>
                          ))}
                          {sortBy !== 'relevance' && (
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1.5 pr-1 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                            >
                              <span className="text-xs">Sort: {getSortLabel(sortBy)}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-slate-300 rounded-full"
                                onClick={() => setSortBy('relevance')}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllFilters}
                            className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 h-auto hover:bg-slate-100 rounded-md transition-colors"
                          >
                            Clear all
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-8 relative">
          {/* Filters Sidebar - Sticky */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-80 flex-shrink-0"
              >
                <div className="sticky top-32">
                  <SearchFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilter={clearFilter}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results - Scrollable */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-24"
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 border-4 border-slate-200 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-semibold text-slate-900 mb-2">Searching datasets...</p>
                    <p className="text-slate-600">Finding the best matches for "{query}"</p>
                  </div>
                </motion.div>
              ) : results.length > 0 ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {results.map((dataset, index) => (
                    <motion.div
                      key={dataset.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <DatasetCard
                        dataset={dataset}
                        onViewDetails={() => setSelectedDataset(dataset)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : query ? (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-24"
                >
                  <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                    <Database className="w-16 h-16 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">No datasets found</h3>
                  <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
                    We couldn't find any datasets matching "<span className="font-semibold text-slate-900">{query}</span>". Try different keywords or adjust your filters.
                  </p>
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-slate-700 mb-3">Try these popular searches:</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {['climate data', 'education statistics', 'health indicators', 'economic data', 'population demographics'].map((suggestion) => (
                        <Button
                          key={suggestion}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSearch(suggestion)}
                          className="text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
                        >
                          Try "{suggestion}"
                        </Button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-24"
                >
                  <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                    <Database className="w-16 h-16 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Start your search</h3>
                  <p className="text-lg text-slate-600">Enter a search term above to find relevant datasets</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Dataset Details Modal */}
      <DatasetModal
        dataset={selectedDataset}
        isOpen={!!selectedDataset}
        onClose={() => setSelectedDataset(null)}
      />
    </div>
  );
}