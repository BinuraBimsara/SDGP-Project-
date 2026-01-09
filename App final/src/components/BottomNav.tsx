import { Home, Plus, Bell, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'feed' | 'notifications' | 'profile';
  onTabChange: (tab: 'feed' | 'notifications' | 'profile') => void;
  onNewReport: () => void;
  notificationCount?: number;
}

export function BottomNav({ activeTab, onTabChange, onNewReport, notificationCount = 0 }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-900 z-50 safe-area-pb transition-colors">
      <div className="max-w-screen-sm mx-auto px-2 py-2">
        <div className="flex items-center justify-around">
          {/* Home/Feed */}
          <button
            onClick={() => onTabChange('feed')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all click-animation ${
              activeTab === 'feed' ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Home className={`h-6 w-6 ${activeTab === 'feed' ? 'fill-green-600' : ''}`} />
            <span className="text-xs">Home</span>
          </button>

          {/* Notifications */}
          <button
            onClick={() => onTabChange('notifications')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all click-animation relative ${
              activeTab === 'notifications' ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Bell className={`h-6 w-6 ${activeTab === 'notifications' ? 'fill-green-600' : ''}`} />
            {notificationCount > 0 && (
              <div className="absolute top-1 right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </div>
            )}
            <span className="text-xs">Alerts</span>
          </button>

          {/* New Report - Center/Prominent with Rounded Square */}
          <button
            onClick={onNewReport}
            className="flex flex-col items-center gap-1 px-4 py-2 -mt-3 click-animation"
          >
            <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-3 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all">
              <Plus className="h-7 w-7" strokeWidth={2.5} />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Report</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => onTabChange('profile')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all click-animation ${
              activeTab === 'profile' ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <User className={`h-6 w-6 ${activeTab === 'profile' ? 'fill-green-600' : ''}`} />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}