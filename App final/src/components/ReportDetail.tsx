import { useState } from 'react';
import { Report } from '../App';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  MapPin, 
  Calendar, 
  User, 
  MessageCircle, 
  X,
  CheckCircle,
  Clock,
  XCircle,
  ArrowBigUp
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface ReportDetailProps {
  report: Report;
  userRole: 'citizen' | 'official';
  onUpdateStatus: (reportId: string, status: Report['status']) => void;
  onAddComment: (reportId: string, text: string) => void;
  onClose: () => void;
}

const categoryConfig = {
  pothole: { label: 'Pothole', color: 'bg-orange-100 text-orange-700' },
  waste: { label: 'Waste', color: 'bg-green-100 text-green-700' },
  infrastructure: { label: 'Infrastructure', color: 'bg-blue-100 text-blue-700' },
  lighting: { label: 'Lighting', color: 'bg-yellow-100 text-yellow-700' },
  other: { label: 'Other', color: 'bg-gray-100 text-gray-700' }
};

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-gray-100 text-gray-700', icon: Clock },
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: Clock },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle }
};

export function ReportDetail({ report, userRole, onUpdateStatus, onAddComment, onClose }: ReportDetailProps) {
  const [commentText, setCommentText] = useState('');
  const category = categoryConfig[report.category];
  const status = statusConfig[report.status];
  const StatusIcon = status.icon;

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddComment(report.id, commentText);
      setCommentText('');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h2 className="text-gray-900 mb-2">{report.title}</h2>
            <div className="flex flex-wrap gap-2">
              <Badge className={category.color}>{category.label}</Badge>
              <Badge className={status.color}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {status.label}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
        {/* Image */}
        {report.imageUrl && (
          <div className="w-full">
            <ImageWithFallback 
              src={report.imageUrl} 
              alt={report.title}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        <div className="p-4 space-y-4">
          {/* Description */}
          <div>
            <p className="text-gray-700">{report.description}</p>
          </div>

          {/* Metadata */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{report.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Reported on {formatDate(report.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <User className="h-4 w-4" />
              <span>Reported by {report.reportedBy}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <ArrowBigUp className="h-4 w-4" />
              <span>{report.upvotes} upvotes</span>
            </div>
          </div>

          {/* Status Update (Officials Only) */}
          {userRole === 'official' && (
            <div className="pt-3 border-t border-gray-200">
              <label className="text-sm text-gray-700 mb-2 block">Update Status</label>
              <Select 
                value={report.status} 
                onValueChange={(value) => onUpdateStatus(report.id, value as Report['status'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Comments */}
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">Comments ({report.comments.length})</span>
            </div>

            <div className="space-y-3 mb-4">
              {report.comments.map(comment => (
                <div 
                  key={comment.id} 
                  className={`p-3 rounded-lg ${
                    comment.isOfficial ? 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700' : 'bg-gray-50 dark:bg-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-900">{comment.author}</span>
                    {comment.isOfficial && (
                      <Badge className="bg-blue-600 text-white text-xs">Official</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{comment.text}</p>
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <div className="space-y-2">
              <Textarea
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                size="sm"
                className="w-full"
              >
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}