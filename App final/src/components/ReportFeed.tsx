import { useState } from 'react';
import { Report } from '../App';
import { ReportCard } from './ReportCard';
import { Button } from './ui/button';
import { SlidersHorizontal, Tag, AlertCircle, TrendingUp } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';

interface ReportFeedProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
  onUpvote: (reportId: string) => void;
  selectedReportId?: string;
}

export function ReportFeed({ reports, onSelectReport, onUpvote, selectedReportId }: ReportFeedProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  const filteredReports = reports.filter(report => {
    if (categoryFilter !== 'all' && report.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && report.status !== statusFilter) return false;
    return true;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.upvotes - a.upvotes;
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <SlidersHorizontal className="h-5 w-5 text-green-600" />
          <span className="text-gray-900">Filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category Field */}
          <div className="space-y-2.5">
            <Label htmlFor="category-desktop" className="flex items-center gap-2 text-gray-700">
              <Tag className="h-4 w-4 text-green-600" />
              Category
            </Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger id="category-desktop" className="border-gray-200 focus:border-green-500 focus:ring-green-500/20">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="pothole">🚧 Pothole</SelectItem>
                <SelectItem value="waste">🗑️ Waste Management</SelectItem>
                <SelectItem value="infrastructure">🏗️ Infrastructure Damage</SelectItem>
                <SelectItem value="lighting">💡 Street Lighting</SelectItem>
                <SelectItem value="other">📋 Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Field */}
          <div className="space-y-2.5">
            <Label htmlFor="status-desktop" className="flex items-center gap-2 text-gray-700">
              <AlertCircle className="h-4 w-4 text-green-600" />
              Status
            </Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status-desktop" className="border-gray-200 focus:border-green-500 focus:ring-green-500/20">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">⏳ Pending</SelectItem>
                <SelectItem value="in-progress">🔄 In Progress</SelectItem>
                <SelectItem value="resolved">✅ Resolved</SelectItem>
                <SelectItem value="rejected">❌ Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By Field */}
          <div className="space-y-2.5">
            <Label htmlFor="sort-desktop" className="flex items-center gap-2 text-gray-700">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Sort By
            </Label>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'recent' | 'popular')}>
              <SelectTrigger id="sort-desktop" className="border-gray-200 focus:border-green-500 focus:ring-green-500/20">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">🕐 Most Recent</SelectItem>
                <SelectItem value="popular">🔥 Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Report Count */}
      <div className="text-gray-600 text-sm px-1">
        Showing {sortedReports.length} {sortedReports.length === 1 ? 'report' : 'reports'}
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {sortedReports.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No reports found matching your filters</p>
          </div>
        ) : (
          sortedReports.map(report => (
            <ReportCard
              key={report.id}
              report={report}
              onClick={() => onSelectReport(report)}
              onUpvote={() => onUpvote(report.id)}
              isSelected={report.id === selectedReportId}
            />
          ))
        )}
      </div>
    </div>
  );
}