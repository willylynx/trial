'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DatasetRequest } from '@/types/dashboard';
import { Calendar, Mail, MessageCircle, Check, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: DatasetRequest[];
  type: 'received' | 'sent';
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
}

export function RequestsModal({ 
  isOpen, 
  onClose, 
  requests, 
  type, 
  onApprove, 
  onReject 
}: RequestsModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return Check;
      case 'rejected': return X;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b border-gray-100 pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {type === 'received' ? 'Access Requests' : 'My Requests'}
          </DialogTitle>
          <p className="text-gray-600">
            {type === 'received' 
              ? 'People requesting access to your datasets'
              : 'Your requests for dataset access'
            }
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-1">
          <AnimatePresence>
            {requests.length > 0 ? (
              <div className="space-y-4">
                {requests.map((request, index) => {
                  const StatusIcon = getStatusIcon(request.status);
                  
                  return (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border border-gray-200 rounded-lg p-6 bg-white"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src="" alt={request.requesterName} />
                            <AvatarFallback className="bg-gray-100 text-gray-600 text-sm">
                              {request.requesterName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-medium text-gray-900">
                                {request.requesterName}
                              </h3>
                              <Badge 
                                variant="outline" 
                                className={`flex items-center gap-1 text-xs ${getStatusColor(request.status)}`}
                              >
                                <StatusIcon className="w-3 h-3" />
                                {request.status}
                              </Badge>
                            </div>
                            
                            <div className="space-y-1 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {request.requesterEmail}
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {formatDate(request.requestDate)}
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <p className="font-medium text-gray-900 text-sm mb-1">
                                Dataset: {request.datasetTitle}
                              </p>
                            </div>

                            {request.message && (
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <MessageCircle className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm font-medium text-gray-700">Message:</span>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {request.message}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {type === 'received' && request.status === 'pending' && onApprove && onReject && (
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => onApprove(request.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => onReject(request.id)}
                              size="sm"
                              variant="outline"
                              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-600">
                  {type === 'received' 
                    ? "You haven't received any dataset requests yet"
                    : "You haven't sent any dataset requests yet"
                  }
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}