'use client';

import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Database, Zap, Globe, Sparkles } from 'lucide-react';

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

const keyFeatures = [
  {
    icon: Database,
    title: 'Unified Access',
    description: 'Access 50,000+ datasets from a single platform'
  },
  {
    icon: Zap,
    title: 'AI-Powered Search',
    description: 'Intelligent search that understands research context'
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: 'Data from 195 countries and territories worldwide'
  }
];

export function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = searchSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
    setSelectedSuggestion(-1);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

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
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  const handleSearch = (query?: string) => {
    const searchTerm = query || searchQuery;
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <section className="relative bg-white">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      <div className="relative">
        <div className="container mx-auto px-6 py-24 max-w-6xl">
          {/* Header Section */}
          <div className="text-center space-y-8 mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Global Research Data Platform
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                One Platform.
                <br />
                <span className="text-slate-600">All Research Data.</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-4xl mx-auto font-light">
                Access comprehensive datasets from around the world with AI-powered search 
                that understands your research needs and delivers precise results instantly.
              </p>
            </div>

            {/* Search Section */}
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="relative" ref={searchRef}>
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6" />
                  <Input
                    type="text"
                    placeholder="Search datasets, topics, or research areas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => searchQuery && setShowSuggestions(true)}
                    className="pl-16 pr-40 py-8 text-lg border-2 border-slate-200 focus:border-slate-900 rounded-2xl shadow-sm bg-white transition-all duration-200 focus:shadow-lg"
                  />
                  <Button 
                    onClick={() => handleSearch()}
                    size="lg"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 transition-colors"
                  >
                    Search
                  </Button>
                </div>

                {/* Search Suggestions */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <Card className="absolute top-full left-0 right-0 mt-3 z-50 border border-slate-200 shadow-xl bg-white">
                    <CardContent className="p-2">
                      {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                        <button
                          key={suggestion}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={`w-full text-left px-4 py-4 rounded-xl transition-colors flex items-center gap-4 ${
                            index === selectedSuggestion 
                              ? 'bg-slate-100 text-slate-900' 
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <Search className="w-4 h-4 text-slate-400" />
                          <span className="font-medium">{suggestion}</span>
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap justify-center gap-3">
                {['Climate Data', 'Economic Indicators', 'Health Statistics', 'Education Metrics'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleSearch(tag)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm font-medium transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {keyFeatures.map((feature, index) => (
              <Card key={feature.title} className="border border-slate-200 hover:border-slate-300 transition-colors bg-white">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">
                    <feature.icon className="w-8 h-8 text-slate-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats Section */}
          <div className="bg-slate-50 rounded-3xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Trusted by Researchers Worldwide
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Join thousands of researchers who rely on our platform for their data needs
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">50K+</div>
                <div className="text-slate-600 font-medium">Datasets Available</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">195</div>
                <div className="text-slate-600 font-medium">Countries Covered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">25K+</div>
                <div className="text-slate-600 font-medium">Active Researchers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">99.9%</div>
                <div className="text-slate-600 font-medium">Platform Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}