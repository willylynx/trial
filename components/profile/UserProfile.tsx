'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UserProfile as UserProfileType } from '@/types/dashboard';
import { Camera, Save, Eye, EyeOff, Calendar, Mail, MapPin, Building, Edit } from 'lucide-react';
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

interface UserProfileProps {
  user: UserProfileType;
  onUpdateProfile: (data: Partial<UserProfileType>) => void;
  onUpdatePassword: (data: { currentPassword: string; newPassword: string }) => void;
  onUpdateAvatar: (file: File) => void;
}

export function UserProfile({ user, onUpdateProfile, onUpdatePassword, onUpdateAvatar }: UserProfileProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
  };

  const handlePasswordSubmit = (data: any) => {
    onUpdatePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    });
    passwordForm.reset();
    setIsChangingPassword(false);
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardContent className="p-8">
          <div className="flex items-start gap-8">
            {/* Avatar Section */}
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-white shadow-sm">
                <AvatarImage src={user.avatar} alt={user.fullName} />
                <AvatarFallback className="text-xl bg-gray-100 text-gray-600">
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
                  className="rounded-full w-8 h-8 p-0 bg-gray-900 hover:bg-gray-800 shadow-sm"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 mb-3">{user.fullName}</h1>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Joined {formatDate(user.dateJoined)}
                    </div>
                    {user.organization && (
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        {user.organization}
                      </div>
                    )}
                    {user.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {user.location}
                      </div>
                    )}
                  </div>
                </div>
                
                <Button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  variant="outline"
                  size="sm"
                  className="border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditingProfile ? 'Cancel' : 'Edit'}
                </Button>
              </div>

              {user.bio && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">About</h3>
                  <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Form */}
      <AnimatePresence>
        {isEditingProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border border-gray-200 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-gray-900">
                  Edit Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
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
                                className="border-gray-200 focus:border-gray-300 focus:ring-0"
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
                                className="border-gray-200 focus:border-gray-300 focus:ring-0"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
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
                                className="border-gray-200 focus:border-gray-300 focus:ring-0"
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
                                className="border-gray-200 focus:border-gray-300 focus:ring-0"
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
                            <textarea
                              placeholder="Tell us about yourself..."
                              className="w-full min-h-[100px] px-3 py-2 border border-gray-200 rounded-md focus:border-gray-300 focus:ring-0 focus:outline-none resize-none"
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

                    <div className="flex items-center justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditingProfile(false)}
                        className="border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-gray-900 hover:bg-gray-800 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Password Section */}
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-medium text-gray-900">
                Password & Security
              </CardTitle>
              <p className="text-gray-600 mt-1">Manage your account security settings</p>
            </div>
            <Button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              variant="outline"
              size="sm"
              className="border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            >
              {isChangingPassword ? 'Cancel' : 'Change Password'}
            </Button>
          </div>
        </CardHeader>

        <AnimatePresence>
          {isChangingPassword && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <CardContent>
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
                                className="border-gray-200 focus:border-gray-300 focus:ring-0 pr-10"
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

                    <div className="grid md:grid-cols-2 gap-6">
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
                                  className="border-gray-200 focus:border-gray-300 focus:ring-0 pr-10"
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
                                  className="border-gray-200 focus:border-gray-300 focus:ring-0 pr-10"
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

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Password Requirements:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• At least 8 characters long</li>
                        <li>• Include uppercase and lowercase letters</li>
                        <li>• Include at least one number</li>
                        <li>• Include at least one special character</li>
                      </ul>
                    </div>

                    <div className="flex items-center justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsChangingPassword(false);
                          passwordForm.reset();
                        }}
                        className="border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-gray-900 hover:bg-gray-800 text-white"
                      >
                        Update Password
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}