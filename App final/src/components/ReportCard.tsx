import { Report } from '../App';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MapPin, ArrowBigUp, MessageCircle, Clock } from 'lucide-react';
import { Button } from './ui/button';

interface ReportCardProps {
  report: Report;
  onClick: () => void;
  onUpvote: () => void;
  isSelected: boolean;
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

export function ReportCard({ report, onClick, onUpvote, isSelected }: ReportCardProps) {
  const category = categoryConfig[report.category];
  const status = statusConfig[report.status];

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpvote();
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-lg border transition-all cursor-pointer hover:shadow-md ${\n        isSelected ? 'border-blue-500 shadow-md' : 'border-gray-200'\n      }`}
    >
      <div className="p-4">
        <div className="flex gap-4">
          {/* Upvote Section */}
          <div className="flex flex-col items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUpvote}
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowBigUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </Button>
            <span className="text-sm text-gray-600">{report.upvotes}</span>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-2 mb-2">
              <h3 className="text-gray-900 flex-1 min-w-0">{report.title}</h3>
              <div className="flex gap-2">
                <Badge className={category.color}>{category.label}</Badge>
                <Badge className={status.color}>{status.label}</Badge>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{report.description}</p>

            {report.imageUrl && (
              <div className="mb-3 rounded-lg overflow-hidden">
                <ImageWithFallback 
                  src={report.imageUrl} 
                  alt={report.title}
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{report.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatDate(report.createdAt)}</span>
              </div>
              {report.comments.length > 0 && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{report.comments.length}</span>
                </div>
              )}
              <span className="text-gray-400">by {report.reportedBy}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}