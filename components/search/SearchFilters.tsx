'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { FilterState } from '@/types/search';
import { X, Filter, TrendingUp, Calendar, Download, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchFiltersProps {
  filters: FilterState;
  onFilterChange: (filterType: keyof FilterState, value: string) => void;
  onClearFilter: (filterType: keyof FilterState) => void;
}

const categories = [
  'Education',
  'Health',
  'Transport',
  'Environment',
  'Economy',
  'Agriculture',
  'Energy',
  'Demographics',
  'Climate',
  'Technology'
];

const countries = [
  'United States',
  'United Kingdom',
  'Germany',
  'France',
  'Japan',
  'Canada',
  'Australia',
  'Brazil',
  'India',
  'China',
  'South Africa',
  'Nigeria',
  'Kenya',
  'Ghana'
];

const sortOptions = [
  { value: 'relevance', label: 'Most Relevant', icon: TrendingUp },
  { value: 'recent', label: 'Most Recent', icon: Calendar },
  { value: 'downloads', label: 'Most Downloaded', icon: Download },
  { value: 'views', label: 'Most Viewed', icon: Eye }
];

export function SearchFilters({ filters, onFilterChange, onClearFilter }: SearchFiltersProps) {
  const activeFilters = Object.entries(filters).filter(([key, value]) => 
    value && value !== 'relevance' && key !== 'sortBy'
  );

  return (
    <Card className="sticky top-32 border border-slate-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <Filter className="w-5 h-5" />
          Filters
        </CardTitle>
        
        {/* Active Filters */}
        <AnimatePresence>
          {activeFilters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 pt-2"
            >
              <div className="text-sm text-slate-600 font-medium">Active filters:</div>
              <div className="flex flex-wrap gap-2">
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
                      onClick={() => onClearFilter(key as keyof FilterState)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <Separator />
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Sort By */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-900">Sort by</label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => onFilterChange('sortBy', value)}
          >
            <SelectTrigger className="border-slate-200 hover:border-slate-300 transition-colors">
              <SelectValue placeholder="Select sorting" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <option.icon className="w-4 h-4" />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Category */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-900">Category</label>
          <Select
            value={filters.category}
            onValueChange={(value) => onFilterChange('category', value)}
          >
            <SelectTrigger className="border-slate-200 hover:border-slate-300 transition-colors">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Country */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-900">Country</label>
          <Select
            value={filters.country}
            onValueChange={(value) => onFilterChange('country', value)}
          >
            <SelectTrigger className="border-slate-200 hover:border-slate-300 transition-colors">
              <SelectValue placeholder="All countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear All Filters */}
        {(activeFilters.length > 0 || filters.sortBy !== 'relevance') && (
          <>
            <Separator />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                activeFilters.forEach(([key]) => {
                  onClearFilter(key as keyof FilterState);
                });
                if (filters.sortBy !== 'relevance') {
                  onFilterChange('sortBy', 'relevance');
                }
              }}
              className="w-full border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
            >
              Clear all filters
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}