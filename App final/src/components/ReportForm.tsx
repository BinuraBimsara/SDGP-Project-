import { useState } from 'react';
import { Report } from '../lib/data';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { ImageUpload } from './ImageUpload';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { MapPin, FileText, Tag, MapPinned, User, Image } from 'lucide-react';

interface ReportFormProps {
  onSubmit: (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'upvotedBy' | 'comments'>) => void;
}

export function ReportForm({ onSubmit }: ReportFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other' as Report['category'],
    location: '',
    reportedBy: '',
    imageUrls: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      status: 'pending'
    });
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          }));
        },
        (error) => {
          let errorMessage = 'Unable to get your location. ';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Location permission was denied. Please enable location access in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Location request timed out.';
              break;
            default:
              errorMessage += 'An unknown error occurred.';
          }
          console.error('Error getting location:', error);
          alert(errorMessage + ' Please enter it manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser. Please enter your location manually.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Field */}
      <div className="space-y-2.5">
        <Label htmlFor="title" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <FileText className="h-4 w-4 text-green-600" />
          Issue Title
        </Label>
        <Input
          id="title"
          placeholder="Brief description of the issue"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-green-500 focus:ring-green-500/20 transition-all"
        />
      </div>

      {/* Category Field */}
      <div className="space-y-2.5">
        <Label htmlFor="category" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <Tag className="h-4 w-4 text-green-600" />
          Category
        </Label>
        <Select 
          value={formData.category} 
          onValueChange={(value) => setFormData({ ...formData, category: value as Report['category'] })}
        >
          <SelectTrigger id="category" className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-green-500 focus:ring-green-500/20">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pothole">Pothole</SelectItem>
            <SelectItem value="waste">Waste Management</SelectItem>
            <SelectItem value="infrastructure">Infrastructure Damage</SelectItem>
            <SelectItem value="lighting">Street Lighting</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Description Field */}
      <div className="space-y-2.5">
        <Label htmlFor="description" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <FileText className="h-4 w-4 text-green-600" />
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="Provide detailed information about the issue"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          required
          className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-green-500 focus:ring-green-500/20 resize-none transition-all"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">Be as detailed as possible to help resolve the issue quickly</p>
      </div>

      {/* Location Field */}
      <div className="space-y-2.5">
        <Label htmlFor="location" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <MapPinned className="h-4 w-4 text-green-600" />
          Location
        </Label>
        <div className="flex gap-2">
          <Input
            id="location"
            placeholder="Street address or coordinates"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
            className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-green-500 focus:ring-green-500/20 transition-all"
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleGetLocation}
            className="border-green-200 dark:border-gray-700 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-all px-4"
          >
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">Click the pin icon to automatically use your current location</p>
      </div>

      {/* Image Upload Field */}
      <div className="space-y-2.5">
        <Label htmlFor="images" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <Image className="h-4 w-4 text-green-600" />
          Photos <span className="text-gray-400 text-xs">(Optional)</span>
        </Label>
        <ImageUpload
          images={formData.imageUrls}
          onChange={(images) => setFormData({ ...formData, imageUrls: images })}
          maxImages={5}
        />
      </div>

      {/* Reported By Field */}
      <div className="space-y-2.5">
        <Label htmlFor="reportedBy" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <User className="h-4 w-4 text-green-600" />
          Your Name
        </Label>
        <Input
          id="reportedBy"
          placeholder="Enter your name"
          value={formData.reportedBy}
          onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
          required
          className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-green-500 focus:ring-green-500/20 transition-all"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button 
          type="submit" 
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md hover:shadow-lg transition-all duration-200 h-12"
        >
          Submit Report
        </Button>
      </div>
    </form>
  );
}