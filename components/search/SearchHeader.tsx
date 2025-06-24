'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, ArrowLeft, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const searchSuggestions = [
  'Climate change indicators',
  'Population demographics',
  'Economic growth metrics',
  'Healthcare outcomes',
  'Education statistics',
  'Energy consumption data',
  'Urban development trends',
  'Agricultural productivity',
  'Environmental monitoring',
  'Social inequality research'
];

interface SearchHeaderProps {
  initialQuery: string;
  onSearch: (query: string) => void;
  totalResults: number;
  loading: boolean;
}

export function SearchHeader({ initialQuery, onSearch, totalResults, loading }: SearchHeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = searchSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(isFocused && filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
    setSelectedSuggestion(-1);
  }, [searchQuery, isFocused]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || filteredSuggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch(searchQuery);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestion >= 0) {
          handleSearch(filteredSuggestions[selectedSuggestion]);
        } else {
          handleSearch(searchQuery);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
        setIsFocused(false);
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setIsFocused(false);
    handleSearch(suggestion);
  };

  const handleSearch = (query: string) => {
    const searchTerm = query || searchQuery;
    if (searchTerm.trim()) {
      setSearchQuery(searchTerm);
      setShowSuggestions(false);
      setIsFocused(false);
      onSearch(searchTerm);
    }
  };

  return (
    <div className="bg-white border-b border-slate-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900 hidden sm:inline">DataHub</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl" ref={searchRef}>
            <div className="relative">
              <div className={`relative transition-all duration-200 ${
                isFocused ? 'transform scale-[1.02]' : ''
              }`}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 transition-opacity duration-200 group-focus-within:opacity-100" />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors duration-200" />
                <Input
                  type="text"
                  placeholder="Search datasets, topics, or research areas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    setIsFocused(true);
                    if (searchQuery && filteredSuggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  className={`pl-12 pr-24 py-3 text-base border-2 rounded-xl transition-all duration-200 bg-white ${
                    isFocused 
                      ? 'border-slate-300 shadow-lg shadow-slate-200/50' 
                      : 'border-slate-200 hover:border-slate-250'
                  }`}
                />
                <Button 
                  onClick={() => handleSearch(searchQuery)}
                  size="sm"
                  disabled={loading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Search className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    'Search'
                  )}
                </Button>
              </div>

              {/* Search Suggestions */}
              <AnimatePresence>
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Card className="absolute top-full left-0 right-0 mt-2 z-50 border border-slate-200 shadow-xl bg-white/95 backdrop-blur-sm">
                      <CardContent className="p-2">
                        {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                          <motion.button
                            key={suggestion}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-150 flex items-center gap-3 ${
                              index === selectedSuggestion 
                                ? 'bg-slate-100 text-slate-900 shadow-sm' 
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <Search className="w-4 h-4 text-slate-400" />
                            <span className="font-medium">{suggestion}</span>
                          </motion.button>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Results Count */}
          <AnimatePresence>
            {!loading && totalResults > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-sm text-slate-600 whitespace-nowrap hidden md:block"
              >
                <span className="font-semibold text-slate-900">{totalResults.toLocaleString()}</span>
                <span className="ml-1">results</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}