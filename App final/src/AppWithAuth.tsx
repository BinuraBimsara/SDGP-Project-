import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import AppMobile from './App';
import AppDesktop from './AppDesktop';
import { Button } from './components/ui/button';
import { Monitor, Smartphone } from 'lucide-react';

interface User {
  name: string;
  email: string;
  avatar?: string;
}

export default function AppWithAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Show version selector and app
  return (
    <div className="relative">
      {/* Version Selector - Floating Button */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 bg-white rounded-lg shadow-lg p-2 border border-gray-200">
        <Button
          variant={viewMode === 'mobile' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('mobile')}
          className="gap-2"
        >
          <Smartphone className="h-4 w-4" />
          Mobile
        </Button>
        <Button
          variant={viewMode === 'desktop' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('desktop')}
          className="gap-2"
        >
          <Monitor className="h-4 w-4" />
          Desktop
        </Button>
      </div>

      {/* User Info & Logout - Floating on opposite side */}
      <div className="fixed top-4 left-4 z-50 bg-white rounded-lg shadow-lg p-2 border border-gray-200 flex items-center gap-3">
        {user.avatar && (
          <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
        )}
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Render selected version */}
      <div className="pt-16">
        {viewMode === 'mobile' ? <AppMobile /> : <AppDesktop />}
      </div>
    </div>
  );
}
