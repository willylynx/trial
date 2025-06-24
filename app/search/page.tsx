'use client';

import { Suspense } from 'react';
import { SearchResults } from '@/components/search/SearchResults';

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Suspense fallback={<div>Loading...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}