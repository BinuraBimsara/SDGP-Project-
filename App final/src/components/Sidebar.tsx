import { X, Info, HelpCircle, Star, Mail, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-900 dark:text-white">Menu</h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* About Section */}
            <button
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
              onClick={() => window.open('https://teamspotit.com.lk', '_blank')}
            >
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Info className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 dark:text-white text-sm font-medium">About</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Learn more about SpotIT</p>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </button>

            <Separator className="dark:bg-gray-800" />

            {/* Help & Feedback Section */}
            <button
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
              onClick={() => alert('Help & Feedback section coming soon!')}
            >
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 dark:text-white text-sm font-medium">Help & Feedback</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Get help or send feedback</p>
              </div>
            </button>

            <Separator className="dark:bg-gray-800" />

            {/* Rate the App Section */}
            <button
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
              onClick={() => alert('Thank you for considering to rate SpotIT!')}
            >
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 dark:text-white text-sm font-medium">Rate the App</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Share your experience</p>
              </div>
            </button>

            <Separator className="dark:bg-gray-800" />

            {/* Contact Section */}
            <button
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
              onClick={() => window.location.href = 'mailto:contact@teamspotit.com.lk'}
            >
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 dark:text-white text-sm font-medium">Contact</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Get in touch with us</p>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              SpotIT v1.0 • Report, Track, Solve
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
              © 2026 Team SpotIT
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
