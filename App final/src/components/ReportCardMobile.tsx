import { Report } from '../lib/data';
import { Badge } from './ui/badge';
import { MapPin, ArrowBigUp, MessageCircle, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface ReportCardMobileProps {
  report: Report;
  onClick: () => void;
  onUpvote: () => void;
  currentUserEmail?: string;
  userRole?: 'citizen' | 'official';
}

const categoryConfig = {
  pothole: { label: 'Pothole', color: 'bg-orange-100 text-orange-700' },
  waste: { label: 'Waste', color: 'bg-green-100 text-green-700' },
  infrastructure: { label: 'Infrastructure', color: 'bg-blue-100 text-blue-700' },
  lighting: { label: 'Lighting', color: 'bg-yellow-100 text-yellow-700' },
  other: { label: 'Other', color: 'bg-gray-100 text-gray-700' }
};

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-gray-100 text-gray-700' },
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700' }
};

export function ReportCardMobile({ report, onClick, onUpvote, currentUserEmail, userRole }: ReportCardMobileProps) {
  const category = categoryConfig[report.category];
  const status = statusConfig[report.status];
  const hasUpvoted = currentUserEmail ? report.upvotedBy.includes(currentUserEmail) : false;
  const canUpvote = userRole !== 'official';
  const [isAnimating, setIsAnimating] = useState(false);

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canUpvote) {
      setIsAnimating(true);
      onUpvote();
      setTimeout(() => setIsAnimating(false), 400);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div 
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl transition-colors w-full overflow-hidden"
    >
      <div className="p-3 w-full">
        <div className="flex gap-3">
          {/* Upvote Section */}
          <div className="flex flex-col items-center gap-0.5 pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUpvote}
              disabled={!canUpvote}
              className={`h-7 w-7 p-0 ${
                canUpvote ? 'hover:bg-green-50 dark:hover:bg-green-900/20' : 'cursor-not-allowed opacity-50'
              } ${hasUpvoted ? 'text-green-600' : ''} ${isAnimating ? 'upvote-animation' : ''}`}
            >
              <ArrowBigUp className={`h-4 w-4 ${hasUpvoted ? 'fill-green-600' : 'text-gray-600 dark:text-gray-400'} ${isAnimating ? 'upvote-animation' : ''}`} />
            </Button>
            <span className={`text-xs text-gray-600 dark:text-gray-400 ${isAnimating ? 'upvote-animation' : ''}`}>{report.upvotes}</span>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex flex-wrap items-start gap-1.5 mb-1.5">
              <h3 className="text-gray-900 dark:text-white flex-1 min-w-0 text-sm line-clamp-2">{report.title}</h3>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-2">
              <Badge className={`${category.color} dark:bg-opacity-20 text-xs py-0 px-2`}>{category.label}</Badge>
              <Badge className={`${status.color} dark:bg-opacity-20 text-xs py-0 px-2`}>{status.label}</Badge>
            </div>

            {report.imageUrls && report.imageUrls.length > 0 && (
              <div 
                onClick={onClick}
                className="mb-2 rounded-lg overflow-hidden -mx-3 cursor-pointer hover:opacity-90 transition-opacity active:scale-[0.99] transform"
              >
                {report.imageUrls.length === 1 ? (
                  <img 
                    src={report.imageUrls[0]} 
                    alt={report.title}
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-0.5">
                    {report.imageUrls.slice(0, 4).map((imageUrl, index) => (
                      <div key={index} className="relative aspect-square">
                        <img 
                          src={imageUrl} 
                          alt={`${report.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {index === 3 && report.imageUrls.length > 4 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white">+{report.imageUrls.length - 4}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <p className="text-gray-600 dark:text-gray-300 text-xs mb-2 line-clamp-2">{report.description}</p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="line-clamp-1">{report.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDate(report.createdAt)}</span>
              </div>
              {report.comments.length > 0 && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>{report.comments.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}