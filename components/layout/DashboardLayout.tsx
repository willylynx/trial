'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
import { 
  LayoutDashboard, 
  Database, 
  Search, 
  Menu, 
  User, 
  LogOut,
  Bell,
  Settings,
  BarChart3,
  Upload,
  MessageSquare,
  HelpCircle,
  X,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: {
    fullName: string;
    email: string;
    avatar?: string;
  };
}

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'My Datasets',
    href: '/datasets',
    icon: Database
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3
  },
  {
    title: 'Requests',
    href: '/requests',
    icon: MessageSquare
  },
  {
    title: 'Upload',
    href: '/upload',
    icon: Upload
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings
  },
  {
    title: 'Help',
    href: '/help',
    icon: HelpCircle
  }
];

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setMobileSearchOpen(false);
    }
  };

  const handleLogout = () => {
    console.log('Logout');
    router.push('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const openMobileSearch = () => {
    setMobileSearchOpen(true);
  };

  const closeMobileSearch = () => {
    setMobileSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Mobile Search Overlay */}
      {isMobile && mobileSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-white">
          <div className="flex items-center gap-4 p-4 border-b border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={closeMobileSearch}
              className="p-2 hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search datasets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg w-full border-gray-200 focus:border-gray-300 focus:ring-0 bg-gray-50 hover:bg-white rounded-xl"
                  autoFocus
                />
              </div>
            </form>
            
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="p-2 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
          
          {/* Search suggestions or recent searches could go here */}
          <div className="p-4">
            <p className="text-sm text-gray-500">Start typing to search datasets...</p>
          </div>
        </div>
      )}

      {/* Top Navigation - Always Full Width */}
      <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 w-full z-50">
        {/* Left side - Menu Toggle and Logo */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Logo - Always visible in navbar */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <Database className="w-4 h-4 text-white" />
            </div>
            {!isMobile && (
              <span className="text-xl font-bold text-gray-900">
                DataHub
              </span>
            )}
          </div>
        </div>

        {/* Center - Search Bar (Desktop) / Search Button (Mobile) */}
        <div className="flex-1 max-w-2xl mx-8">
          {!isMobile ? (
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search datasets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-gray-300 focus:ring-0 bg-gray-50 hover:bg-white"
              />
            </form>
          ) : (
            <Button
              variant="ghost"
              onClick={openMobileSearch}
              className="w-full justify-start text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg py-2 px-4"
            >
              <Search className="w-4 h-4 mr-3" />
              <span>Search datasets...</span>
            </Button>
          )}
        </div>

        {/* Right side - Notifications and User Menu */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative p-2 hover:bg-gray-100">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-gray-200 hover:border-gray-300">
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
                <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>

      {/* Main Content Area Below Navbar */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Overlay */}
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          />
        )}

        {/* Sidebar with Smooth Animation */}
        <aside
          className={cn(
            "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out",
            isMobile 
              ? "fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] shadow-xl" 
              : "relative h-full",
            sidebarOpen 
              ? "w-70 translate-x-0" 
              : isMobile 
                ? "w-70 -translate-x-full" 
                : "w-0 -translate-x-full"
          )}
        >
          {/* Sidebar Content - Only visible when open */}
          <div className={cn(
            "flex-1 overflow-y-auto transition-opacity duration-300",
            sidebarOpen ? "opacity-100" : "opacity-0"
          )}>
            <div className="p-6">
              {/* Navigation Items */}
              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Button
                      key={item.href}
                      variant={isActive ? "default" : "ghost"}
                      onClick={() => {
                        router.push(item.href);
                        if (isMobile) setSidebarOpen(false);
                      }}
                      className={cn(
                        "w-full justify-start h-12 px-4 text-left font-medium transition-colors",
                        isActive
                          ? "bg-gray-900 text-white hover:bg-gray-800 shadow-sm"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.title}
                    </Button>
                  );
                })}
              </nav>

              {/* Quick Stats */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Datasets</span>
                    <span className="font-medium text-gray-900">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">This Month</span>
                    <span className="font-medium text-gray-900">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Views</span>
                    <span className="font-medium text-gray-900">45.2K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content - Only This Area Scrolls */}
        <main 
          className={cn(
            "flex-1 overflow-auto bg-gray-50 transition-all duration-300 ease-in-out",
            !isMobile && sidebarOpen ? "ml-0" : "ml-0"
          )}
        >
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}