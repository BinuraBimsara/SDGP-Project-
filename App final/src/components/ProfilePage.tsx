import { LogOut, MapPin, Award, MessageCircle, TrendingUp, Shield, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface ProfilePageProps {
  user: User;
  userRole: 'citizen' | 'official';
  stats: {
    reportsSubmitted: number;
    upvotesReceived: number;
    commentsGiven: number;
    reportsResolved?: number;
  };
  onLogout: () => void;
}

export function ProfilePage({ user, userRole, stats, onLogout }: ProfilePageProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20 transition-colors">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-500 dark:from-green-700 dark:to-green-600 pt-8 pb-20 transition-colors">
        <div className="max-w-screen-sm mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-white">Profile</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-white hover:bg-white/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="max-w-screen-sm mx-auto px-4 -mt-12">
        <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl shadow-lg p-6 mb-4 transition-colors">
          <div className="flex flex-col items-center text-center mb-6">
            <Avatar className="h-24 w-24 mb-4 ring-4 ring-white dark:ring-gray-800 shadow-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-green-600 text-white text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-gray-900 dark:text-white mb-1">{user.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{user.email}</p>
            <Badge 
              className={userRole === 'official' 
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700' 
                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
              }
            >
              {userRole === 'official' ? (
                <>
                  <Shield className="h-3 w-3 mr-1" />
                  Government Official
                </>
              ) : (
                <>
                  <UserIcon className="h-3 w-3 mr-1" />
                  Citizen
                </>
              )}
            </Badge>
          </div>

          <Separator className="my-6 dark:bg-gray-800" />

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-gray-900 rounded-xl p-4 text-center border border-green-100 dark:border-gray-800">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-2xl text-green-700 dark:text-green-400 mb-1">{stats.reportsSubmitted}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Reports Submitted</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 text-center border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <p className="text-2xl text-gray-700 dark:text-gray-300 mb-1">{stats.upvotesReceived}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Upvotes Received</p>
            </div>

            {userRole === 'official' && stats.reportsResolved !== undefined ? (
              <>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 text-center border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-center mb-2">
                    <MessageCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <p className="text-2xl text-gray-700 dark:text-gray-300 mb-1">{stats.commentsGiven}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Comments Given</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 text-center border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-center mb-2">
                    <Award className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <p className="text-2xl text-gray-700 dark:text-gray-300 mb-1">{stats.reportsResolved}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Reports Resolved</p>
                </div>
              </>
            ) : (
              <div className="col-span-2 flex justify-center">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 text-center border border-gray-100 dark:border-gray-800 w-1/2">
                  <div className="flex items-center justify-center mb-2">
                    <MessageCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <p className="text-2xl text-gray-700 dark:text-gray-300 mb-1">{stats.commentsGiven}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Comments Given</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
          <h3 className="text-gray-900 dark:text-white mb-4">About</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="text-gray-600 dark:text-gray-400">
                <p className="text-gray-900 dark:text-white mb-1">Member Since</p>
                <p>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            <Separator />
            <div className="text-gray-600 dark:text-gray-400">
              <p className="text-gray-900 dark:text-white mb-1">Community Impact</p>
              <p>
                Thank you for helping make our community better! Your contributions help local
                government identify and resolve issues more efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}