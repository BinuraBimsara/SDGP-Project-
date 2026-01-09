export interface Report {
  id: string;
  title: string;
  description: string;
  category: 'pothole' | 'waste' | 'infrastructure' | 'lighting' | 'other';
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  location: string;
  coordinates?: { lat: number; lng: number };
  imageUrls: string[]; // Changed to array for multiple images
  createdAt: Date;
  updatedAt: Date;
  reportedBy: string;
  upvotes: number;
  upvotedBy: string[]; // Track who upvoted
  comments: Comment[];
}

export interface Comment {
  id: string;
  reportId: string;
  text: string;
  author: string;
  isOfficial: boolean;
  createdAt: Date;
}

// Mock initial data
export const mockReports: Report[] = [
  {
    id: '1',
    title: 'Large pothole on Main Street',
    description: 'Deep pothole causing traffic issues and potential damage to vehicles. Located near the intersection with Oak Avenue.',
    category: 'pothole',
    status: 'in-progress',
    location: 'Main Street & Oak Avenue',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    imageUrls: ['https://images.unsplash.com/photo-1709934730506-fba12664d4e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBwb3Rob2xlJTIwZGFtYWdlfGVufDF8fHx8MTc2NzYyODY5OXww&ixlib=rb-4.1.0&q=80&w=1080'],
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-05'),
    reportedBy: 'John Doe',
    upvotes: 24,
    upvotedBy: ['Alice', 'Bob', 'Charlie'],
    comments: [
      {
        id: 'c1',
        reportId: '1',
        text: 'Work crew has been assigned. Expected completion in 3 days.',
        author: 'City Roads Department',
        isOfficial: true,
        createdAt: new Date('2025-11-05')
      }
    ]
  },
  {
    id: '2',
    title: 'Overflowing garbage bins',
    description: 'Multiple garbage bins have not been collected for over a week. Strong odor affecting nearby residents.',
    category: 'waste',
    status: 'pending',
    location: 'Park Avenue, Block 5',
    coordinates: { lat: 40.7580, lng: -73.9855 },
    imageUrls: ['https://images.unsplash.com/photo-1767369328017-4365e8252876?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdmVyZmxvd2luZyUyMGdhcmJhZ2UlMjBiaW5zfGVufDF8fHx8MTc2NzYyODcwMHww&ixlib=rb-4.1.0&q=80&w=1080'],
    createdAt: new Date('2025-11-06'),
    updatedAt: new Date('2025-11-06'),
    reportedBy: 'Sarah Johnson',
    upvotes: 18,
    upvotedBy: ['David', 'Eve'],
    comments: []
  },
  {
    id: '3',
    title: 'Broken streetlight',
    description: 'Streetlight has been non-functional for two weeks, creating safety concerns for pedestrians at night.',
    category: 'lighting',
    status: 'pending',
    location: 'Elm Street near School',
    coordinates: { lat: 40.7489, lng: -73.9680 },
    imageUrls: ['https://images.unsplash.com/photo-1687812693663-c322b9af62a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9rZW4lMjBzdHJlZXQlMjBsaWdodCUyMG5pZ2h0fGVufDF8fHx8MTc2NzYyODcwMHww&ixlib=rb-4.1.0&q=80&w=1080'],
    createdAt: new Date('2025-11-04'),
    updatedAt: new Date('2025-11-04'),
    reportedBy: 'Mike Chen',
    upvotes: 31,
    upvotedBy: ['Frank', 'Grace', 'Hannah'],
    comments: []
  },
  {
    id: '4',
    title: 'Cracked sidewalk causing trip hazard',
    description: 'Significant cracks in the sidewalk creating dangerous conditions for pedestrians, especially elderly residents.',
    category: 'infrastructure',
    status: 'resolved',
    location: 'Cedar Lane',
    coordinates: { lat: 40.7614, lng: -73.9776 },
    imageUrls: ['https://images.unsplash.com/photo-1717185691293-4ecd7072b847?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmFja2VkJTIwc2lkZXdhbGslMjBkYW1hZ2V8ZW58MXx8fHwxNzY3NjI4NzAwfDA&ixlib=rb-4.1.0&q=80&w=1080'],
    createdAt: new Date('2025-10-28'),
    updatedAt: new Date('2025-11-03'),
    reportedBy: 'Emily Rodriguez',
    upvotes: 12,
    upvotedBy: ['Ian', 'Jack'],
    comments: [
      {
        id: 'c2',
        reportId: '4',
        text: 'Repairs completed. Thank you for reporting this issue.',
        author: 'Public Works Department',
        isOfficial: true,
        createdAt: new Date('2025-11-03')
      }
    ]
  }
];