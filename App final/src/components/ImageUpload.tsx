import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (images.length + imageFiles.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onChange([...images, e.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      {images.length === 0 && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
          <Button
            type="button"
            onClick={openFilePicker}
            className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-200 h-12 shadow-sm hover:shadow-md"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload Photos
          </Button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            PNG, JPG, GIF up to 10MB (Max {maxImages} images)
          </p>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {images.map((image, index) => (
              <div 
                key={index} 
                className="relative group rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
              >
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200" />
                
                {/* Remove button */}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-2 right-2 h-7 w-7 p-0 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-110"
                >
                  <X className="h-4 w-4" />
                </Button>
                
                {/* Image counter */}
                <div className="absolute bottom-2 left-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-xs px-2.5 py-1 rounded-full shadow-md">
                  {index + 1} of {images.length}
                </div>
              </div>
            ))}
          </div>

          {/* Add More Button */}
          {images.length < maxImages && (
            <Button
              type="button"
              variant="outline"
              onClick={openFilePicker}
              className="w-full border-green-200 dark:border-gray-700 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-all group"
            >
              <Plus className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
              Add More Photos ({images.length}/{maxImages})
            </Button>
          )}
        </div>
      )}
    </div>
  );
}