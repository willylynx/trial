'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewDatasetForm } from '@/types/dashboard';
import { Upload, Link, X, Plus, FileText, Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
  'Education', 'Health', 'Transport', 'Environment', 'Economy', 
  'Agriculture', 'Energy', 'Demographics', 'Climate', 'Technology'
];

const countries = [
  'United States', 'United Kingdom', 'Germany', 'France', 'Japan',
  'Canada', 'Australia', 'Brazil', 'India', 'China', 'South Africa',
  'Nigeria', 'Kenya', 'Ghana', 'Mexico', 'Argentina'
];

const datasetSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title too long'),
  source: z.string().min(2, 'Source is required').max(100, 'Source too long'),
  tags: z.array(z.string()).min(1, 'At least one tag is required').max(10, 'Maximum 10 tags'),
  country: z.array(z.string()).min(1, 'At least one country is required'),
  category: z.array(z.string()).min(1, 'At least one category is required'),
  accessibility: z.enum(['public', 'private']),
  description: z.string().min(50, 'Description must be at least 50 characters').max(2000, 'Description too long'),
  dataType: z.enum(['link', 'file']),
  externalUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  file: z.any().optional()
}).refine((data) => {
  if (data.dataType === 'link') {
    return data.externalUrl && data.externalUrl.length > 0;
  }
  return data.file;
}, {
  message: "Please provide either a valid URL or upload a file",
  path: ["dataType"]
});

interface UploadDatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewDatasetForm) => void;
}

export function UploadDatasetModal({ isOpen, onClose, onSubmit }: UploadDatasetModalProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewDatasetForm>({
    resolver: zodResolver(datasetSchema),
    defaultValues: {
      title: '',
      source: '',
      tags: [],
      country: [],
      category: [],
      accessibility: 'public',
      description: '',
      dataType: 'link',
      externalUrl: '',
      file: undefined
    }
  });

  const dataType = form.watch('dataType');

  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim()) && selectedTags.length < 10) {
      const updatedTags = [...selectedTags, newTag.trim()];
      setSelectedTags(updatedTags);
      form.setValue('tags', updatedTags);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(updatedTags);
    form.setValue('tags', updatedTags);
  };

  const handleMultiSelect = (value: string, currentValues: string[], setter: (values: string[]) => void, formField: keyof NewDatasetForm) => {
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    setter(updatedValues);
    form.setValue(formField as any, updatedValues);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      form.setValue('file', file);
      form.setValue('dataType', 'file');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      form.setValue('file', file);
    }
  };

  const handleSubmit = async (data: NewDatasetForm) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload
      onSubmit({
        ...data,
        tags: selectedTags,
        country: selectedCountries,
        category: selectedCategories
      });
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setSelectedTags([]);
    setSelectedCountries([]);
    setSelectedCategories([]);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b border-gray-100 pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Upload New Dataset
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            Share your research data with the global community
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Dataset Title *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Global Climate Temperature Data 2023"
                            className="border-gray-200 focus:border-gray-400 focus:ring-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Data Source *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., NASA, World Bank, WHO"
                            className="border-gray-200 focus:border-gray-400 focus:ring-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="accessibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Access Level *
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-200 focus:border-gray-400 focus:ring-0">
                            <SelectValue placeholder="Select access level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="public">
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4" />
                              Public - Anyone can access
                            </div>
                          </SelectItem>
                          <SelectItem value="private">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              Private - Request access required
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Dataset Description *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide a detailed description of your dataset, including methodology, data collection process, and potential use cases..."
                          className="min-h-[120px] border-gray-200 focus:border-gray-400 focus:ring-0 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Classification */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Classification</h3>

                {/* Categories */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Categories * (Select multiple)
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        type="button"
                        variant={selectedCategories.includes(category) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleMultiSelect(category, selectedCategories, setSelectedCategories, 'category')}
                        className={selectedCategories.includes(category)
                          ? "bg-gray-900 text-white hover:bg-gray-800"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                  {form.formState.errors.category && (
                    <p className="text-sm text-red-500 mt-2">{form.formState.errors.category.message}</p>
                  )}
                </div>

                {/* Countries */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Countries * (Select multiple)
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {countries.map((country) => (
                      <Button
                        key={country}
                        type="button"
                        variant={selectedCountries.includes(country) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleMultiSelect(country, selectedCountries, setSelectedCountries, 'country')}
                        className={selectedCountries.includes(country)
                          ? "bg-gray-900 text-white text-xs hover:bg-gray-800"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-xs"
                        }
                      >
                        {country}
                      </Button>
                    ))}
                  </div>
                  {form.formState.errors.country && (
                    <p className="text-sm text-red-500 mt-2">{form.formState.errors.country.message}</p>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Tags * (Add up to 10 custom tags)
                  </Label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Add a tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="border-gray-200 focus:border-gray-400 focus:ring-0"
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      disabled={!newTag.trim() || selectedTags.length >= 10}
                      className="bg-gray-900 hover:bg-gray-800"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1 pr-1 bg-gray-100 text-gray-700">
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-gray-300 rounded-full"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  {form.formState.errors.tags && (
                    <p className="text-sm text-red-500 mt-2">{form.formState.errors.tags.message}</p>
                  )}
                </div>
              </div>

              {/* Data Source */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Data Source</h3>

                <FormField
                  control={form.control}
                  name="dataType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        How would you like to provide the data? *
                      </FormLabel>
                      <div className="grid md:grid-cols-2 gap-4 mt-3">
                        <Button
                          type="button"
                          variant={field.value === 'link' ? "default" : "outline"}
                          onClick={() => field.onChange('link')}
                          className={`h-auto p-6 flex flex-col items-center gap-3 ${
                            field.value === 'link'
                              ? "bg-gray-900 text-white hover:bg-gray-800"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <Link className="w-8 h-8" />
                          <div className="text-center">
                            <div className="font-medium">External Link</div>
                            <div className="text-sm opacity-75">Provide a URL to your dataset</div>
                          </div>
                        </Button>
                        
                        <Button
                          type="button"
                          variant={field.value === 'file' ? "default" : "outline"}
                          onClick={() => field.onChange('file')}
                          className={`h-auto p-6 flex flex-col items-center gap-3 ${
                            field.value === 'file'
                              ? "bg-gray-900 text-white hover:bg-gray-800"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <Upload className="w-8 h-8" />
                          <div className="text-center">
                            <div className="font-medium">Upload File</div>
                            <div className="text-sm opacity-75">Upload your dataset file</div>
                          </div>
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <AnimatePresence mode="wait">
                  {dataType === 'link' ? (
                    <motion.div
                      key="link"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <FormField
                        control={form.control}
                        name="externalUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Dataset URL *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/dataset.csv"
                                className="border-gray-200 focus:border-gray-400 focus:ring-0"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="file"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                          dragActive
                            ? 'border-gray-400 bg-gray-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <div className="space-y-2">
                          <p className="text-lg font-medium text-gray-900">
                            Drop your file here, or click to browse
                          </p>
                          <p className="text-sm text-gray-600">
                            Supports CSV, JSON, Excel, and other data formats (Max 100MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                          accept=".csv,.json,.xlsx,.xls,.txt,.xml"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-4 border-gray-200 hover:border-gray-300"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          Choose File
                        </Button>
                        {form.watch('file') && (
                          <p className="mt-2 text-sm text-green-600">
                            File selected: {(form.watch('file') as File)?.name}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </Form>
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 border-t border-gray-100 p-6">
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit(handleSubmit)}
              disabled={isSubmitting}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Dataset
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}