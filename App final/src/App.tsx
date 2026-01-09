import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { ReportFeedMobile } from './components/ReportFeedMobile';
import { ReportForm } from './components/ReportForm';
import { ReportDetailMobile } from './components/ReportDetailMobile';
import { NotificationsPage } from './components/NotificationsPage';
import { ProfilePage } from './components/ProfilePage';
import { BottomNav } from './components/BottomNav';
import { ScrollToTop } from './components/ScrollToTop';
import { Sidebar } from './components/Sidebar';
import { ArrowLeft, MapPin, RefreshCw, Moon, Sun, Menu } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './components/ui/dialog';
import { Report, Comment, mockReports } from './lib/data';
import { Button } from './components/ui/button';

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface Notification {
  id: string;
  type: 'comment' | 'upvote' | 'status_update';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  reportId?: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userRole, setUserRole] = useState<'citizen' | 'official'>('citizen');
  const [activeTab, setActiveTab] = useState<'feed' | 'notifications' | 'profile'>('feed');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'status_update',
      title: 'Report Status Updated',
      message: 'Your report \"Large pothole on Main Street\" has been marked as In Progress',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
      reportId: '1'
    },
    {
      id: '2',
      type: 'comment',
      title: 'New Comment',
      message: 'A government official commented on your report',
      timestamp: new Date(Date.now() - 7200000),
      read: false,
      reportId: '1'
    },
    {
      id: '3',
      type: 'upvote',
      title: 'Report Upvoted',
      message: 'Your report received 5 new upvotes',
      timestamp: new Date(Date.now() - 86400000),
      read: true,
      reportId: '2'
    }
  ]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogin = (userData: User, role: 'citizen' | 'official') => {
    setUser(userData);
    setUserRole(role);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('feed');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const handleSubmitReport = (newReport: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'upvotedBy' | 'comments'>) => {
    const report: Report = {
      ...newReport,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      upvotes: 0,
      upvotedBy: [],
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
    // Only citizens can upvote
    if (userRole === 'official') {
      return;
    }

    const currentUserEmail = user?.email || 'anonymous';
    
    setReports(reports.map(report => {
      if (report.id === reportId) {
        // Check if user already upvoted
        if (report.upvotedBy.includes(currentUserEmail)) {
          // Remove upvote
          return {
            ...report,
            upvotes: report.upvotes - 1,
            upvotedBy: report.upvotedBy.filter(email => email !== currentUserEmail)
          };
        } else {
          // Add upvote
          return {
            ...report,
            upvotes: report.upvotes + 1,
            upvotedBy: [...report.upvotedBy, currentUserEmail]
          };
        }
      }
      return report;
    }));
    
    if (selectedReport?.id === reportId) {
      const report = reports.find(r => r.id === reportId);
      if (report) {
        if (report.upvotedBy.includes(currentUserEmail)) {
          setSelectedReport({
            ...selectedReport,
            upvotes: selectedReport.upvotes - 1,
            upvotedBy: selectedReport.upvotedBy.filter(email => email !== currentUserEmail)
          });
        } else {
          setSelectedReport({
            ...selectedReport,
            upvotes: selectedReport.upvotes + 1,
            upvotedBy: [...selectedReport.upvotedBy, currentUserEmail]
          });
        }
      }
    }
  };

  const handleAddComment = (reportId: string, text: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      reportId,
      text,
      author: userRole === 'official' ? 'Government Official' : user.name,
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

  const handleSelectReport = (report: Report) => {
    setSelectedReport(report);
  };

  const handleBack = () => {
    setSelectedReport(null);
  };

  const handleTabChange = (tab: 'feed' | 'notifications' | 'profile') => {
    setActiveTab(tab);
    setSelectedReport(null);
    // Scroll to top only for alerts (notifications) and profile sections
    if (tab === 'notifications' || tab === 'profile') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handleNewReport = () => {
    setIsFormOpen(true);
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    ));
    
    // Navigate to report if applicable
    if (notification.reportId) {
      const report = reports.find(r => r.id === notification.reportId);
      if (report) {
        setSelectedReport(report);
        setActiveTab('feed');
        // Scroll to top when viewing report
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Calculate user stats
  const userStats = {
    reportsSubmitted: reports.filter(r => r.reportedBy === user.name).length,
    upvotesReceived: reports.filter(r => r.reportedBy === user.name).reduce((sum, r) => sum + r.upvotes, 0),
    commentsGiven: reports.reduce((sum, r) => sum + r.comments.filter(c => c.author === user.name).length, 0),
    reportsResolved: userRole === 'official' ? reports.filter(r => r.status === 'resolved').length : 0
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black w-full max-w-full overflow-x-hidden transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-900 sticky top-0 z-10 w-full pt-safe transition-colors">
        <div className="w-full px-4 py-3 max-w-screen-sm mx-auto">
          <div className="flex items-center justify-center gap-3 relative">
            {/* Left: Menu and Back button */}
            <div className="absolute left-0 flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 click-animation dark:text-white dark:hover:bg-gray-900"
              >
                <Menu className="h-5 w-5" />
              </Button>
              {selectedReport && activeTab === 'feed' && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleBack}
                  className="p-2 click-animation dark:text-white dark:hover:bg-gray-900"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Center: Logo and App Name */}
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600 dark:text-emerald-500 shrink-0" />
              <h1 className="text-gray-900 dark:text-white whitespace-nowrap">SpotIT</h1>
            </div>

            {/* Right: Dark Mode Toggle */}
            <div className="absolute right-0 flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors click-animation"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with page transitions */}
      <main className="pb-20">
        <div className="page-transition" key={activeTab}>
          {activeTab === 'feed' && !selectedReport && (
            <ReportFeedMobile 
              reports={reports}
              onSelectReport={handleSelectReport}
              onUpvote={handleUpvote}
              currentUserEmail={user?.email}
              userRole={userRole}
            />
          )}
          
          {activeTab === 'feed' && selectedReport && (
            <ReportDetailMobile 
              report={selectedReport}
              userRole={userRole}
              onUpdateStatus={handleUpdateStatus}
              onAddComment={handleAddComment}
              onUpvote={handleUpvote}
              currentUserEmail={user?.email}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsPage
              notifications={notifications}
              onNotificationClick={handleNotificationClick}
              onMarkAllRead={handleMarkAllRead}
            />
          )}

          {activeTab === 'profile' && (
            <ProfilePage
              user={user}
              userRole={userRole}
              stats={userStats}
              onLogout={handleLogout}
            />
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onNewReport={handleNewReport}
        notificationCount={unreadNotifications}
      />

      {/* New Report Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>Report New Issue</DialogTitle>
            <DialogDescription>
              Please provide details about the issue you are reporting.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <ReportForm onSubmit={handleSubmitReport} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Scroll to Top Button */}
      {activeTab === 'feed' && <ScrollToTop />}
    </div>
  );
}