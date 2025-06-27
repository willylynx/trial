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
  X, 
  User, 
  LogOut,
  Bell,
  Settings,
  BarChart3,
  Upload,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    }
  };

  const handleLogout = () => {
    console.log('Logout');
    router.push('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Mobile Overlay */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
              />
            )}

            {/* Sidebar */}
            <motion.aside
              initial={isMobile ? { x: -280 } : { width: 0 }}
              animate={isMobile ? { x: 0 } : { width: 280 }}
              exit={isMobile ? { x: -280 } : { width: 0 }}
              transition={{ 
                type: "spring", 
                damping: 30, 
                stiffness: 300,
                duration: 0.3
              }}
              className={cn(
                "bg-white border-r border-gray-200 flex flex-col",
                isMobile 
                  ? "fixed top-0 left-0 z-50 w-70 h-full shadow-xl" 
                  : "relative w-70 h-full"
              )}
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">
                    DataHub
                  </span>
                </div>
                
                {/* Close button for mobile */}
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Sidebar Content - Scrollable */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  {/* Navigation Items */}
                  <nav className="space-y-2">
                    {sidebarItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <motion.div
                          key={item.href}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            onClick={() => {
                              router.push(item.href);
                              if (isMobile) setSidebarOpen(false);
                            }}
                            className={cn(
                              "w-full justify-start h-12 px-4 text-left font-medium transition-all duration-200",
                              isActive
                                ? "bg-gray-900 text-white hover:bg-gray-800 shadow-sm"
                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            )}
                          >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.title}
                          </Button>
                        </motion.div>
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
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Top Navigation - Fixed */}
        <motion.nav 
          className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0"
          animate={{ 
            paddingLeft: !isMobile && sidebarOpen ? '1.5rem' : '1.5rem'
          }}
          transition={{ 
            type: "spring", 
            damping: 30, 
            stiffness: 300,
            duration: 0.3
          }}
        >
          {/* Left side - Menu Toggle */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 transition-colors duration-200"
            >
              <motion.div
                animate={{ rotate: sidebarOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-5 h-5" />
              </motion.div>
            </Button>
          </div>

          {/* Center - Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search datasets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-gray-300 focus:ring-0 bg-gray-50 hover:bg-white transition-colors duration-200"
              />
            </form>
          </div>

          {/* Right side - Notifications and User Menu */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative p-2 hover:bg-gray-100 transition-colors duration-200">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* User Menu */}
            {user && (
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
        </motion.nav>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-auto">
          <motion.div
            className="p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}