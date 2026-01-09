import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { MapPin, Mail, Lock, Shield, User } from 'lucide-react';
import { Separator } from './ui/separator';

interface LoginPageProps {
  onLogin: (user: { name: string; email: string; avatar?: string }, role: 'citizen' | 'official') => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'citizen' | 'official'>('citizen');

  const handleGoogleLogin = () => {
    // Simulate Google login
    onLogin({
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    }, selectedRole);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // Simulate email login
      onLogin({
        name: email.split('@')[0],
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      }, selectedRole);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-white dark:from-black dark:via-gray-950 dark:to-black p-4 pt-safe transition-colors">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="mb-8 px-2">
          <div className="flex items-center justify-between mb-6">
            {/* Left: Logo and App Name */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-xl shadow-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-gray-900 dark:text-white">SpotIT</h1>
            </div>
            
            {/* Right: Motto */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Report, Track, Solve
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-900 border border-green-100 dark:border-gray-800 rounded-2xl shadow-xl p-8 transition-colors">
          <h2 className="text-gray-900 dark:text-white mb-6 text-center">Sign in to continue</h2>
          
          {/* Role Selection */}
          <div className="mb-6">
            <Label className="text-gray-700 dark:text-gray-300 mb-3 block text-center">I am a</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('citizen')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  selectedRole === 'citizen'
                    ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-300 dark:hover:border-green-600'
                }`}
              >
                <User className={`h-6 w-6 ${selectedRole === 'citizen' ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={`text-sm ${selectedRole === 'citizen' ? 'text-green-900 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  Citizen
                </span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('official')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  selectedRole === 'official'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                <Shield className={`h-6 w-6 ${selectedRole === 'official' ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className={`text-sm ${selectedRole === 'official' ? 'text-blue-900 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                  Official
                </span>
              </button>
            </div>
          </div>

          <Separator className="my-6 dark:bg-gray-800" />

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl hover:bg-green-50 dark:hover:bg-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-all duration-200 shadow-sm hover:shadow-md mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">Or continue with email</span>
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1.5 border-green-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1.5 border-green-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Sign in
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline block">
              Forgot password?
            </a>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-3">
            <span className="font-medium">Demo Mode:</span> Click any login button to access the app
          </p>
        </div>
      </div>
    </div>
  );
}