import { Bell, MessageCircle, ArrowBigUp, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from './ui/badge';

interface Notification {
  id: string;
  type: 'comment' | 'upvote' | 'status_update';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  reportId?: string;
}

interface NotificationsPageProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onMarkAllRead: () => void;
}

export function NotificationsPage({ notifications, onNotificationClick, onMarkAllRead }: NotificationsPageProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'comment':
        return <MessageCircle className="h-5 w-5 text-blue-600 dark:text-gray-400" />;
      case 'upvote':
        return <ArrowBigUp className="h-5 w-5 text-green-600 fill-green-600 dark:text-green-500 dark:fill-green-500" />;
      case 'status_update':
        return <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-900 p-4 transition-colors">
        <div className="flex items-center justify-between max-w-screen-sm mx-auto">
          <div>
            <h1 className="text-gray-900 dark:text-white">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-sm text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 transition-colors click-animation"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-screen-sm mx-auto p-3">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-gray-100 dark:bg-gray-900 rounded-full p-6 mb-4">
              <Bell className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-gray-900 dark:text-white mb-2">No notifications yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              You'll see updates about your reports and comments here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notification => (
              <button
                key={notification.id}
                onClick={() => onNotificationClick(notification)}
                className={`w-full text-left p-4 rounded-2xl transition-all click-animation shadow-sm hover:shadow-md ${
                  !notification.read 
                    ? 'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 border-2 border-green-200 dark:border-green-700' 
                    : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850'
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className={`p-2 rounded-xl ${
                      notification.type === 'comment' ? 'bg-gray-100 dark:bg-gray-800' :
                      notification.type === 'upvote' ? 'bg-green-100 dark:bg-green-900/30' :
                      'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {getIcon(notification.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="w-2.5 h-2.5 bg-green-600 dark:bg-green-500 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(notification.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}