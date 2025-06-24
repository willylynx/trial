'use client';

import { HeroSection } from '@/components/hero/HeroSection';
import { LatestDatasets } from '@/components/datasets/LatestDatasets';
import { SDGSection } from '@/components/sdg/SDGSection';
import { ContactSection } from '@/components/contact/ContactSection';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <LatestDatasets />
      <SDGSection />
      <ContactSection />
    </main>
  );
}