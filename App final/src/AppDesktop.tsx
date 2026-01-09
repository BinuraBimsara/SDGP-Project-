import { useState } from 'react';
import { ReportFeed } from './components/ReportFeed';
import { ReportForm } from './components/ReportForm';
import { ReportDetail } from './components/ReportDetail';
import { Button } from './components/ui/button';
import { Plus, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './components/ui/dialog';
import { Report, Comment, mockReports } from './lib/data';

export default function AppDesktop() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userRole, setUserRole] = useState<'citizen' | 'official'>('citizen');

  const handleSubmitReport = (newReport: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'comments'>) => {
    const report: Report = {
      ...newReport,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      upvotes: 0,
      comments: []
    };
    setReports([report, ...reports]);
    setIsFormOpen(false);
  };

  const handleUpdateStatus = (reportId: string, newStatus: Report['status']) => {
    setReports(reports.map(report => 
      report.id === reportId 
        ? { ...report, status: newStatus, updatedAt: new Date() }
        : report
    ));
    if (selectedReport?.id === reportId) {
      setSelectedReport({ ...selectedReport, status: newStatus, updatedAt: new Date() });
    }
  };

  const handleUpvote = (reportId: string) => {
    setReports(reports.map(report => 
      report.id === reportId 
        ? { ...report, upvotes: report.upvotes + 1 }
        : report
    ));
    if (selectedReport?.id === reportId) {
      setSelectedReport({ ...selectedReport, upvotes: selectedReport.upvotes + 1 });
    }
  };

  const handleAddComment = (reportId: string, text: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      reportId,
      text,
      author: userRole === 'official' ? 'Government Official' : 'Anonymous User',
      isOfficial: userRole === 'official',
      createdAt: new Date()
    };
    
    setReports(reports.map(report => 
      report.id === reportId 
        ? { ...report, comments: [...report.comments, newComment], updatedAt: new Date() }
        : report
    ));
    
    if (selectedReport?.id === reportId) {
      setSelectedReport({ 
        ...selectedReport, 
        comments: [...selectedReport.comments, newComment],
        updatedAt: new Date()
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-green-600" />
              <h1 className="text-gray-900">SpotIT</h1>
              <span className="text-gray-500 text-sm">Community Issue Tracker</span>
            </div>
            <div className="flex items-center gap-3">
              <select 
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as 'citizen' | 'official')}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
              >
                <option value="citizen">Citizen View</option>
                <option value="official">Official View</option>
              </select>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Report Issue
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Report New Issue</DialogTitle>
                    <DialogDescription>Fill out the form to report a new issue in your community.</DialogDescription>
                  </DialogHeader>
                  <ReportForm onSubmit={handleSubmitReport} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feed */}
          <div className="lg:col-span-2">
            <ReportFeed 
              reports={reports}
              onSelectReport={setSelectedReport}
              onUpvote={handleUpvote}
              selectedReportId={selectedReport?.id}
            />
          </div>

          {/* Detail Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {selectedReport ? (
                <ReportDetail 
                  report={selectedReport}
                  userRole={userRole}
                  onUpdateStatus={handleUpdateStatus}
                  onAddComment={handleAddComment}
                  onClose={() => setSelectedReport(null)}
                />
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Select a report to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}