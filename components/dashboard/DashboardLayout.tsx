'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  Database, 
  Plus, 
  User, 
  LogOut, 
  Menu, 
  X,
  Sparkles,
  Bell,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: 'dashboard' | 'datasets' | 'add-dataset' | 'profile';
  onPageChange: (page: 'dashboard' | 'datasets' | 'add-dataset' | 'profile') => void;
  user: {
    fullName: string;
    email: string;
    avatar?: string;
  };
  onLogout: () => void;
}

const navigation = [
  { id: 'dashboard', name: 'Overview', icon: LayoutDashboard },
  { id: 'datasets', name: 'Datasets', icon: Database },
  { id: 'add-dataset', name: 'Upload', icon: Plus },
  { id: 'profile', name: 'Profile', icon: User },
];

export function DashboardLayout({ 
  children, 
  currentPage, 
  onPageChange, 
  user, 
  onLogout 
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - always visible */}
      <div className="w-[280px] bg-white shadow-sm flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-100">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">DataHub</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start gap-3 h-10 font-medium ${
                  currentPage === item.id
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => {
                  onPageChange(item.id as any);
                }}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Button>
            ))}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 mb-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.avatar} alt={user.fullName} />
              <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">
                {user.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm truncate">{user.fullName}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-gray-600 hover:text-gray-900 h-9"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content - always starts after sidebar */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Remove mobile menu button */}
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {currentPage === 'dashboard' && 'Dashboard'}
                  {currentPage === 'datasets' && 'My Datasets'}
                  {currentPage === 'add-dataset' && 'Upload Dataset'}
                  {currentPage === 'profile' && 'Profile Settings'}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  className="pl-9 w-64 h-9 border-gray-200 focus:border-gray-300 focus:ring-0"
                />
              </div>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
            </div>
          </div>
        </div>
        {/* Page content */}
        <main className="p-6 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}