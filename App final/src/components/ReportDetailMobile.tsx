import { useState } from 'react';
import { Report } from '../lib/data';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  MapPin, 
  Calendar, 
  User, 
  MessageCircle,
  CheckCircle,
  Clock,
  XCircle,
  ArrowBigUp,
  Send
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface ReportDetailMobileProps {
  report: Report;
  userRole: 'citizen' | 'official';
  onUpdateStatus: (reportId: string, status: Report['status']) => void;
  onAddComment: (reportId: string, text: string) => void;
  onUpvote: (reportId: string) => void;
  currentUserEmail?: string;
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

export function ReportDetailMobile({ report, userRole, onUpdateStatus, onAddComment, onUpvote, currentUserEmail }: ReportDetailMobileProps) {
  const [commentText, setCommentText] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const category = categoryConfig[report.category];
  const status = statusConfig[report.status];
  const StatusIcon = status.icon;

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddComment(report.id, commentText);
      setCommentText('');
    }
  };

  const handleUpvote = () => {
    onUpvote(report.id);
  };

  const isUpvoted = currentUserEmail ? report.upvotedBy?.includes(currentUserEmail) : false;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen w-full max-w-full overflow-x-hidden transition-colors">
      {/* Images */}
      {report.imageUrls && report.imageUrls.length > 0 && (
        <div className="w-full relative bg-gray-100 dark:bg-gray-900">
          <img 
            src={report.imageUrls[currentImageIndex]} 
            alt={`${report.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-auto max-h-96 object-contain mx-auto"
          />
          {report.imageUrls.length > 1 && (
            <>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {report.imageUrls.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex 
                        ? 'bg-white w-6' 
                        : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
              <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {currentImageIndex + 1} / {report.imageUrls.length}
              </div>
            </>
          )}
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Header */}
        <div>
          <h2 className="text-gray-900 dark:text-white mb-3">{report.title}</h2>
          <div className="flex flex-wrap gap-2">
            <Badge className={`${category.color} dark:bg-opacity-20`}>{category.label}</Badge>
            <Badge className={`${status.color} dark:bg-opacity-20`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {status.label}
            </Badge>
            <Badge 
              variant="outline" 
              className={`gap-1 cursor-pointer transition-all duration-200 ${
                userRole === 'official' 
                  ? 'opacity-50 cursor-not-allowed dark:border-gray-700 dark:text-gray-300' 
                  : isUpvoted 
                    ? 'border-green-600 dark:border-emerald-500 text-green-600 dark:text-emerald-500 bg-green-50 dark:bg-emerald-950 scale-animation' 
                    : 'dark:border-gray-700 dark:text-gray-300 hover:border-green-600 dark:hover:border-emerald-500 hover:text-green-600 dark:hover:text-emerald-500 click-animation'
              }`}
              onClick={userRole === 'citizen' ? handleUpvote : undefined}
            >
              <ArrowBigUp className={`h-3 w-3 ${isUpvoted ? 'fill-green-600 dark:fill-emerald-500' : ''}`} />
              {report.upvotes}
            </Badge>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-gray-700 dark:text-gray-300 text-sm">{report.description}</p>
        </div>

        {/* Metadata */}
        <div className="space-y-2 text-sm bg-gray-100 dark:bg-gray-900 rounded-lg p-3">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span>{report.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>Reported on {formatDate(report.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <User className="h-4 w-4 flex-shrink-0" />
            <span>Reported by {report.reportedBy}</span>
          </div>
        </div>

        {/* Status Update (Officials Only) */}
        {userRole === 'official' && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
            <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Update Status</label>
            <Select 
              value={report.status} 
              onValueChange={(value) => onUpdateStatus(report.id, value as Report['status'])}
            >
              <SelectTrigger className="dark:bg-gray-900 dark:border-gray-800 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-black dark:border-gray-800">
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Comments */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-900 dark:text-white">Comments ({report.comments.length})</span>
          </div>

          <div className="space-y-3 mb-4">
            {report.comments.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No comments yet</p>
            ) : (
              report.comments.map(comment => (
                <div 
                  key={comment.id} 
                  className={`p-3 rounded-lg text-sm ${
                    comment.isOfficial ? 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700' : 'bg-gray-50 dark:bg-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-900 dark:text-white">{comment.author}</span>
                    {comment.isOfficial && (
                      <Badge className="bg-blue-600 text-white text-xs">Official</Badge>
                    )}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-1">{comment.text}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Add Comment */}
          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
              className="text-sm dark:bg-gray-900 dark:border-gray-800 dark:text-white"
            />
            <Button 
              onClick={handleAddComment}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}