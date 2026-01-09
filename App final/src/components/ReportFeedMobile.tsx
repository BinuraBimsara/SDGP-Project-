import { useState } from 'react';
import { Report } from '../lib/data';
import { ReportCardMobile } from './ReportCardMobile';
import { Filter, SlidersHorizontal, Tag, AlertCircle, TrendingUp } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';

interface ReportFeedMobileProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
  onUpvote: (reportId: string) => void;
  currentUserEmail?: string;
  userRole?: 'citizen' | 'official';
}

export function ReportFeedMobile({ reports, onSelectReport, onUpvote, currentUserEmail, userRole }: ReportFeedMobileProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [showFilters, setShowFilters] = useState(false);

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

  const activeFiltersCount = 
    (categoryFilter !== 'all' ? 1 : 0) + 
    (statusFilter !== 'all' ? 1 : 0) +
    (sortBy !== 'recent' ? 1 : 0);

  const clearFilters = () => {
    setCategoryFilter('all');
    setStatusFilter('all');
    setSortBy('recent');
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* Filter Toggle Button - Centered and Floating */}
      <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-900 px-4 py-3 transition-colors flex justify-center">
        <Button
          variant="ghost"
          onClick={() => setShowFilters(true)}
          className="gap-2 px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gradient-to-r dark:from-emerald-600 dark:to-teal-600 hover:bg-gray-200 dark:hover:from-emerald-700 dark:hover:to-teal-700 rounded-full shadow-md click-animation relative"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-green-600 dark:bg-white dark:text-emerald-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center absolute -top-1 -right-1">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {/* Filter Dialog */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg rounded-2xl dark:bg-gray-950 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-center dark:text-white">
              Filter Reports
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
              Refine your search to find the reports you're looking for.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            {/* Category Field */}
            <div className="space-y-2.5">
              <Label htmlFor="category" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Tag className="h-4 w-4 text-green-600 dark:text-emerald-500" />
                Category
              </Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category" className="border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-green-500 dark:focus:border-emerald-500 focus:ring-green-500/20">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-950 dark:border-gray-800">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="pothole">Pothole</SelectItem>
                  <SelectItem value="waste">Waste Management</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure Damage</SelectItem>
                  <SelectItem value="lighting">Street Lighting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Field */}
            <div className="space-y-2.5">
              <Label htmlFor="status" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <AlertCircle className="h-4 w-4 text-green-600 dark:text-emerald-500" />
                Status
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status" className="border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-green-500 dark:focus:border-emerald-500 focus:ring-green-500/20">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-950 dark:border-gray-800">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By Field */}
            <div className="space-y-2.5">
              <Label htmlFor="sort" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-emerald-500" />
                Sort By
              </Label>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'recent' | 'popular')}>
                <SelectTrigger id="sort" className="border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:border-green-500 dark:focus:border-emerald-500 focus:ring-green-500/20">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-950 dark:border-gray-800">
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex-1 border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Clear All
              </Button>
              <Button
                onClick={() => setShowFilters(false)}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 dark:from-emerald-600 dark:to-teal-600 hover:from-green-700 hover:to-green-800 dark:hover:from-emerald-700 dark:hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reports List with margins */}
      <div className="w-full pb-20 px-3">
        {sortedReports.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 mt-4 rounded-lg border border-gray-200 dark:border-gray-800 p-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">No reports found matching your filters</p>
          </div>
        ) : (
          <div className="space-y-3 mt-3">
            {sortedReports.map(report => (
              <ReportCardMobile
                key={report.id}
                report={report}
                onClick={() => onSelectReport(report)}
                onUpvote={() => onUpvote(report.id)}
                currentUserEmail={currentUserEmail}
                userRole={userRole}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}