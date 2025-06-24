'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UserProfile as UserProfileType } from '@/types/dashboard';
import { 
  Camera, 
  Save, 
  Eye, 
  EyeOff, 
  Calendar, 
  Mail, 
  MapPin, 
  Building, 
  Edit,
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(500, 'Bio too long').optional(),
  organization: z.string().max(100, 'Organization name too long').optional(),
  location: z.string().max(100, 'Location too long').optional()
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

interface ProfilePageProps {
  user: UserProfileType;
  onUpdateProfile: (data: Partial<UserProfileType>) => void;
  onUpdatePassword: (data: { currentPassword: string; newPassword: string }) => void;
  onUpdateAvatar: (file: File) => void;
}

export function ProfilePage({ user, onUpdateProfile, onUpdatePassword, onUpdateAvatar }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
      bio: user.bio || '',
      organization: user.organization || '',
      location: user.location || ''
    }
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const handleProfileSubmit = (data: any) => {
    onUpdateProfile(data);
    setIsEditingProfile(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePasswordSubmit = (data: any) => {
    onUpdatePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    });
    passwordForm.reset();
    setIsChangingPassword(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpdateAvatar(e.target.files[0]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Palette }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm sticky top-8">
              <CardContent className="p-6">
                {/* Profile Summary */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                      <AvatarImage src={user.avatar} alt={user.fullName} />
                      <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {user.fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1">
                      <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      <Button
                        size="sm"
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                        className="rounded-full w-8 h-8 p-0 bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mt-3">{user.fullName}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>

                {/* Navigation Tabs */}
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Profile Information */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl font-semibold text-gray-900">
                            Profile Information
                          </CardTitle>
                          <p className="text-gray-600 mt-1">Update your personal information and bio</p>
                        </div>
                        <Button
                          onClick={() => setIsEditingProfile(!isEditingProfile)}
                          variant={isEditingProfile ? "outline" : "default"}
                          size="sm"
                          className={isEditingProfile ? "border-gray-300" : "bg-blue-600 hover:bg-blue-700"}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          {isEditingProfile ? 'Cancel' : 'Edit'}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      {!isEditingProfile ? (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-2 block">Full Name</label>
                              <p className="text-gray-900 font-medium">{user.fullName}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-2 block">Email Address</label>
                              <p className="text-gray-900">{user.email}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-2 block">Organization</label>
                              <p className="text-gray-900">{user.organization || 'Not specified'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
                              <p className="text-gray-900">{user.location || 'Not specified'}</p>
                            </div>
                          </div>
                          {user.bio && (
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-2 block">Bio</label>
                              <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-500 pt-4 border-t border-gray-100">
                            <Calendar className="w-4 h-4" />
                            <span>Member since {formatDate(user.dateJoined)}</span>
                          </div>
                        </div>
                      ) : (
                        <Form {...profileForm}>
                          <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={profileForm.control}
                                name="fullName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                      Full Name *
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        className="border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={profileForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                      Email Address *
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="email"
                                        className="border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={profileForm.control}
                                name="organization"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                      Organization
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="e.g., University, Company"
                                        className="border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={profileForm.control}
                                name="location"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                      Location
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="e.g., New York, USA"
                                        className="border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={profileForm.control}
                              name="bio"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-700">
                                    Bio
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Tell us about yourself..."
                                      className="min-h-[100px] border-gray-200 focus:border-blue-300 focus:ring-blue-200 resize-none"
                                      {...field}
                                    />
                                  </FormControl>
                                  <div className="flex justify-between items-center">
                                    <FormMessage />
                                    <div className="text-xs text-gray-400">
                                      {field.value?.length || 0}/500
                                    </div>
                                  </div>
                                </FormItem>
                              )}
                            />

                            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditingProfile(false)}
                                className="border-gray-300 hover:bg-gray-50"
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                              </Button>
                            </div>
                          </form>
                        </Form>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Password & Security */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl font-semibold text-gray-900">
                            Password & Security
                          </CardTitle>
                          <p className="text-gray-600 mt-1">Manage your account security settings</p>
                        </div>
                        <Button
                          onClick={() => setIsChangingPassword(!isChangingPassword)}
                          variant={isChangingPassword ? "outline" : "default"}
                          size="sm"
                          className={isChangingPassword ? "border-gray-300" : "bg-blue-600 hover:bg-blue-700"}
                        >
                          {isChangingPassword ? 'Cancel' : 'Change Password'}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      {!isChangingPassword ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <Shield className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-green-900">Password Protected</p>
                                <p className="text-sm text-green-700">Your account is secured with a strong password</p>
                              </div>
                            </div>
                            <Check className="w-5 h-5 text-green-600" />
                          </div>
                          
                          <div className="space-y-3 pt-4">
                            <h4 className="font-medium text-gray-900">Security Recommendations</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                              <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500" />
                                Use a unique password for this account
                              </li>
                              <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500" />
                                Enable two-factor authentication (coming soon)
                              </li>
                              <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500" />
                                Regularly review account activity
                              </li>
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <Form {...passwordForm}>
                          <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-6">
                            <FormField
                              control={passwordForm.control}
                              name="currentPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-700">
                                    Current Password *
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Input
                                        type={showCurrentPassword ? "text" : "password"}
                                        className="border-gray-200 focus:border-blue-300 focus:ring-blue-200 pr-10"
                                        {...field}
                                      />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                      >
                                        {showCurrentPassword ? (
                                          <EyeOff className="w-4 h-4 text-gray-400" />
                                        ) : (
                                          <Eye className="w-4 h-4 text-gray-400" />
                                        )}
                                      </Button>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={passwordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                      New Password *
                                    </FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Input
                                          type={showNewPassword ? "text" : "password"}
                                          className="border-gray-200 focus:border-blue-300 focus:ring-blue-200 pr-10"
                                          {...field}
                                        />
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                          onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                          {showNewPassword ? (
                                            <EyeOff className="w-4 h-4 text-gray-400" />
                                          ) : (
                                            <Eye className="w-4 h-4 text-gray-400" />
                                          )}
                                        </Button>
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                      Confirm New Password *
                                    </FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Input
                                          type={showConfirmPassword ? "text" : "password"}
                                          className="border-gray-200 focus:border-blue-300 focus:ring-blue-200 pr-10"
                                          {...field}
                                        />
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                          {showConfirmPassword ? (
                                            <EyeOff className="w-4 h-4 text-gray-400" />
                                          ) : (
                                            <Eye className="w-4 h-4 text-gray-400" />
                                          )}
                                        </Button>
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                              <h4 className="font-medium text-blue-900 mb-2">Password Requirements:</h4>
                              <ul className="text-sm text-blue-800 space-y-1">
                                <li>• At least 8 characters long</li>
                                <li>• Include uppercase and lowercase letters</li>
                                <li>• Include at least one number</li>
                                <li>• Include at least one special character</li>
                              </ul>
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setIsChangingPassword(false);
                                  passwordForm.reset();
                                }}
                                className="border-gray-300 hover:bg-gray-50"
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                Update Password
                              </Button>
                            </div>
                          </form>
                        </Form>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'preferences' && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Preferences */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="border-b border-gray-100">
                      <CardTitle className="text-xl font-semibold text-gray-900">
                        Preferences
                      </CardTitle>
                      <p className="text-gray-600">Customize your experience</p>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="font-medium text-gray-900">Email Notifications</p>
                              <p className="text-sm text-gray-600">Receive updates about your datasets</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Configure</Button>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="font-medium text-gray-900">Privacy Settings</p>
                              <p className="text-sm text-gray-600">Control who can see your profile</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Manage</Button>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Palette className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="font-medium text-gray-900">Theme</p>
                              <p className="text-sm text-gray-600">Choose your preferred theme</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Light</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50"
            >
              <Check className="w-5 h-5" />
              <span className="font-medium">Changes saved successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}