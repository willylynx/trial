'use client';

import { sdgDatasets } from '@/data/sdg-datasets';
import { SDGCard } from './SDGCard';
import { Target } from 'lucide-react';

export function SDGSection() {
  const totalDatasets = sdgDatasets.reduce((acc, sdg) => acc + sdg.datasetCount, 0);

  return (
    <section className="w-full py-16 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Target className="w-4 h-4" />
            UN Sustainable Development Goals
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Datasets Classified by
            <span className="text-primary"> Global Goals</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            The 17 United Nations Sustainable Development Goals (SDGs) aim to tackle worldwide challenges such as poverty, inequality, climate change, fostering a more sustainable and equitable world by 2030.
          </p>
        </div>

        {/* SDG Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {sdgDatasets.map((sdg) => (
            <SDGCard key={sdg.id} sdg={sdg} />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-border/50">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">17</div>
            <div className="text-muted-foreground">Global Goals</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">{totalDatasets.toLocaleString()}+</div>
            <div className="text-muted-foreground">Total Datasets</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">2030</div>
            <div className="text-muted-foreground">Target Year</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">193</div>
            <div className="text-muted-foreground">UN Member States</div>
          </div>
        </div>
      </div>
    </section>
  );
}