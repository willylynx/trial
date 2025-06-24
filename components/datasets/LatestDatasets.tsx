'use client';

import { useState } from 'react';
import { datasets } from '@/data/datasets';
import { DatasetCard } from './DatasetCard';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Database } from 'lucide-react';

export function LatestDatasets() {
  const [showAll, setShowAll] = useState(false);
  
  const displayedDatasets = showAll ? datasets : datasets.slice(0, 3);

  return (
    <section className="w-full py-16 bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Database className="w-4 h-4" />
            Latest Datasets
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Discover Our Latest
            <span className="text-primary"> Research Data</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collection of high-quality datasets from leading researchers and institutions worldwide.
          </p>
        </div>

        {/* Datasets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {displayedDatasets.map((dataset) => (
            <DatasetCard key={dataset.id} dataset={dataset} />
          ))}
        </div>

        {/* Show More/Less Button */}
        <div className="text-center">
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="outline"
            size="lg"
            className="min-w-[200px] hover:bg-primary hover:text-primary-foreground transition-all duration-200"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                View All Datasets ({datasets.length})
              </>
            )}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-12 border-t border-border/50">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">{datasets.length}+</div>
            <div className="text-muted-foreground">Available Datasets</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {Math.round(datasets.reduce((acc, d) => acc + d.downloadCount, 0) / 1000)}k+
            </div>
            <div className="text-muted-foreground">Total Downloads</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">20+</div>
            <div className="text-muted-foreground">Research Categories</div>
          </div>
        </div>
      </div>
    </section>
  );
}