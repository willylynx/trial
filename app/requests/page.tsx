'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RequestsPage } from '@/components/requests/RequestsPage';
import { UserProfile as UserProfileType } from '@/types/dashboard';

// Mock user data
const mockUser: UserProfileType = {
  id: '1',
  fullName: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@university.edu',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
  dateJoined: '2023-06-15',
  bio: 'Climate researcher specializing in global temperature analysis and environmental data science.',
  organization: 'Stanford University',
  location: 'California, USA'
};

export default function RequestsPageWrapper() {
  return (
    <DashboardLayout user={mockUser}>
      <RequestsPage />
    </DashboardLayout>
  );
}