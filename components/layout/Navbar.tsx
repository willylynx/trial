'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Database, User, LogOut, Bell, LayoutDashboard, FolderOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  user?: {
    fullName: string;
    email: string;
    avatar?: string;
  };
  onProfileClick?: () => void;
  onLogout?: () => void;
  onUploadClick?: () => void;
}

export function Navbar({ user, onProfileClick, onLogout, onUploadClick }: NavbarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push('/')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <Database className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              DataHub
            </span>
          </motion.div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search datasets, topics, or research areas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-gray-300 focus:ring-0 bg-gray-50 hover:bg-white transition-colors"
              />
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-gray-200 hover:border-gray-300 transition-colors">
                      <AvatarImage src={user.avatar} alt={user.fullName} />
                      <AvatarFallback className="bg-gray-900 text-white font-medium">
                        {user.fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-2">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={user.fullName} />
                      <AvatarFallback className="bg-gray-900 text-white">
                        {user.fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{user.fullName}</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/dashboard')} className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/datasets')} className="cursor-pointer">
                    <FolderOpen className="mr-2 h-4 w-4" />
                    <span>My Datasets</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onProfileClick} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
                <Button size="sm" className="bg-gray-900 hover:bg-gray-800">
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}