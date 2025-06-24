'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { 
  MessageCircle, 
  Send, 
  CheckCircle, 
  Lightbulb,
  Database,
  Palette,
  Plus,
  Bug
} from 'lucide-react';

// Form validation schema
const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  
  phone: z.string().optional(),
  
  occupation: z.string()
    .min(2, 'Occupation must be at least 2 characters')
    .max(100, 'Occupation must be less than 100 characters'),
  
  category: z.string()
    .min(1, 'Please select a category'),
  
  suggestion: z.string()
    .min(10, 'Please provide at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
});

type ContactFormData = z.infer<typeof contactSchema>;

const categories = [
  { value: 'new-design', label: 'New Design', icon: Palette },
  { value: 'new-feature', label: 'New Feature', icon: Plus },
  { value: 'new-dataset', label: 'New Dataset', icon: Database },
  { value: 'improvement', label: 'Improvement', icon: Lightbulb },
  { value: 'bug-report', label: 'Bug Report', icon: Bug }
];

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      occupation: '',
      category: '',
      suggestion: ''
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Form submitted:', data);
      setIsSubmitted(true);
      form.reset();
      
      // Reset success state after 4 seconds
      setTimeout(() => setIsSubmitted(false), 4000);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full py-20 bg-slate-50">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Contact Us
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Have suggestions or feedback? We'd love to hear from you.
          </p>
        </div>

        {/* Form Card */}
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Thank you!</h3>
                  <p className="text-slate-600">
                    We've received your message and will get back to you soon.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Name and Email Row */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-slate-700">
                                Name *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your full name"
                                  className="border-slate-200 focus:border-slate-400 focus:ring-0 transition-colors"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-sm" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-slate-700">
                                Email *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="your.email@example.com"
                                  className="border-slate-200 focus:border-slate-400 focus:ring-0 transition-colors"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-sm" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Phone and Occupation Row */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-slate-700">
                                Phone
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="Optional"
                                  className="border-slate-200 focus:border-slate-400 focus:ring-0 transition-colors"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-sm" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="occupation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-slate-700">
                                Occupation *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Researcher, Student"
                                  className="border-slate-200 focus:border-slate-400 focus:ring-0 transition-colors"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-sm" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Category Field */}
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-slate-700">
                              Category *
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-slate-200 focus:border-slate-400 focus:ring-0 transition-colors">
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.value} value={category.value}>
                                    <div className="flex items-center gap-2">
                                      <category.icon className="w-4 h-4 text-slate-500" />
                                      {category.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-500 text-sm" />
                          </FormItem>
                        )}
                      />

                      {/* Suggestion Field */}
                      <FormField
                        control={form.control}
                        name="suggestion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-slate-700">
                              Your Message *
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us your thoughts, suggestions, or feedback..."
                                className="min-h-[120px] border-slate-200 focus:border-slate-400 focus:ring-0 transition-colors resize-none"
                                {...field}
                              />
                            </FormControl>
                            <div className="flex justify-between items-center">
                              <FormMessage className="text-red-500 text-sm" />
                              <div className="text-xs text-slate-400">
                                {field.value?.length || 0}/1000
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Sending...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Send className="w-4 h-4" />
                            Send Message
                          </div>
                        )}
                      </Button>
                    </form>
                  </Form>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}