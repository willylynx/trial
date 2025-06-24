'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchResult, Comment } from '@/types/search';
import { ExternalLink, Eye, Download, Calendar, Globe, Lock, Users, Send, Heart, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DatasetModalProps {
  dataset: SearchResult | null;
  isOpen: boolean;
  onClose: () => void;
}

// Mock comments data with rich content
const mockComments: Comment[] = [
  {
    id: '1',
    user: {
      name: 'Dr. Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    content: 'This dataset has been <strong>incredibly useful</strong> for my climate research. The data quality is excellent and well-documented.<br><br><blockquote>The methodology section was particularly helpful for understanding the data collection process.</blockquote>',
    date: '2024-01-10',
    likes: 12
  },
  {
    id: '2',
    user: {
      name: 'Prof. Michael Chen',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    content: '<em>Great work!</em> I used this for my urban planning project. Would love to see more recent data added.<br><br>Key findings:<ul><li>Urban density correlations were spot-on</li><li>Transportation data needs updating</li><li>Population projections very accurate</li></ul>',
    date: '2024-01-08',
    likes: 8
  }
];

export function DatasetModal({ dataset, isOpen, onClose }: DatasetModalProps) {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(mockComments);

  if (!dataset) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').trim();
  };

  const handleAddComment = () => {
    const textContent = stripHtml(newComment);
    if (!textContent) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        name: 'You',
        avatar: ''
      },
      content: newComment,
      date: new Date().toISOString().split('T')[0],
      likes: 0
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">
                  {dataset.category}
                </Badge>
                <Badge 
                  variant={dataset.visibility === 'public' ? 'default' : 'outline'}
                  className="flex items-center gap-1"
                >
                  {dataset.visibility === 'public' ? (
                    <Globe className="w-3 h-3" />
                  ) : (
                    <Lock className="w-3 h-3" />
                  )}
                  {dataset.visibility}
                </Badge>
              </div>
              
              <DialogTitle className="text-2xl font-bold text-slate-900 mb-2">
                {dataset.title}
              </DialogTitle>
              
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span><strong>Source:</strong> {dataset.source}</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(dataset.uploadDate)}
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => window.open(dataset.originalUrl, '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Visit Source
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="overview" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="discussions">Discussions ({comments.length})</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="overview" className="space-y-6 p-1">
                {/* Uploader Info */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={dataset.uploader.avatar} alt={dataset.uploader.name} />
                    <AvatarFallback>
                      {dataset.uploader.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-slate-900">{dataset.uploader.name}</div>
                    <div className="text-sm text-slate-600">
                      Uploaded on {formatDate(dataset.uploadDate)}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-slate-700 leading-relaxed">{dataset.description}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 text-slate-600 mb-1">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{formatNumber(dataset.views)}</div>
                    <div className="text-sm text-slate-600">Views</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 text-slate-600 mb-1">
                      <Download className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{formatNumber(dataset.downloads)}</div>
                    <div className="text-sm text-slate-600">Downloads</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 text-slate-600 mb-1">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{dataset.comments}</div>
                    <div className="text-sm text-slate-600">Comments</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6 p-1">
                {/* Tags */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {dataset.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Technical Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Technical Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Format:</span>
                      <span className="font-medium">CSV, JSON</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Size:</span>
                      <span className="font-medium">2.3 GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Records:</span>
                      <span className="font-medium">1,250,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Last Updated:</span>
                      <span className="font-medium">{formatDate(dataset.uploadDate)}</span>
                    </div>
                  </div>
                </div>

                {/* License */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">License</h3>
                  <p className="text-sm text-slate-700">
                    This dataset is available under the Creative Commons Attribution 4.0 International License.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="discussions" className="space-y-6 p-1">
                {/* Add Comment */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Join the Discussion</h3>
                  <div className="space-y-4">
                    <RichTextEditor
                      value={newComment}
                      onChange={setNewComment}
                      placeholder="Share your thoughts about this dataset... Use the toolbar to format your text."
                      className="w-full"
                      minHeight="140px"
                    />
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-slate-500">
                        Use <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">Ctrl+B</kbd> for bold, 
                        <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs ml-1">Ctrl+I</kbd> for italic
                      </div>
                      <Button 
                        onClick={handleAddComment}
                        disabled={!stripHtml(newComment)}
                        className="flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Comments */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
                  <AnimatePresence>
                    {comments.map((comment) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex gap-3 p-4 bg-slate-50 rounded-lg"
                      >
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                          <AvatarFallback className="text-sm">
                            {comment.user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-slate-900">{comment.user.name}</span>
                            <span className="text-sm text-slate-500">{formatDate(comment.date)}</span>
                          </div>
                          <div 
                            className="text-slate-700 text-sm leading-relaxed mb-3 prose prose-sm max-w-none [&_strong]:font-semibold [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_blockquote]:my-2"
                            dangerouslySetInnerHTML={{ __html: comment.content }}
                          />
                          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700 p-0 h-auto">
                            <Heart className="w-4 h-4 mr-1" />
                            {comment.likes}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}