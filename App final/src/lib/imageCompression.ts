/**
 * Image Compression Utilities for SpotIT Web App
 * 
 * This module provides image compression functionality to reduce file sizes
 * before uploading to Firebase Storage. This is critical for users with
 * slow network connections, especially in rural areas with weak 3G signals.
 * 
 * Target: Compress ~5MB photos down to ~200KB while maintaining acceptable quality.
 */

// Target file size in bytes (approximately 200KB)
const TARGET_FILE_SIZE = 200 * 1024;

// Maximum image dimension (width or height) after compression
const MAX_IMAGE_DIMENSION = 1920;

// Starting quality for compression (0.0 - 1.0)
const START_QUALITY = 0.85;

// Minimum quality for compression (0.0 - 1.0)
const MIN_QUALITY = 0.2;

// Quality decrement per iteration
const QUALITY_STEP = 0.1;

export interface CompressionOptions {
  /** Maximum width of the output image */
  maxWidth?: number;
  /** Maximum height of the output image */
  maxHeight?: number;
  /** Target file size in bytes */
  targetSize?: number;
  /** Quality (0.0 - 1.0), defaults to 0.85 */
  quality?: number;
  /** Output format: 'image/jpeg' or 'image/webp' */
  format?: 'image/jpeg' | 'image/webp';
}

export interface CompressionResult {
  /** The compressed image as a Blob */
  blob: Blob;
  /** The compressed image as a base64 data URL */
  dataUrl: string;
  /** Original file size in bytes */
  originalSize: number;
  /** Compressed file size in bytes */
  compressedSize: number;
  /** Compression ratio (original / compressed) */
  compressionRatio: number;
  /** Final quality used */
  quality: number;
  /** Final dimensions */
  width: number;
  height: number;
}

/**
 * Compresses an image file to reduce its size for faster uploads.
 * 
 * Uses progressive quality reduction to achieve target file size
 * while maintaining acceptable image quality.
 * 
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise resolving to compression result
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    maxWidth = MAX_IMAGE_DIMENSION,
    maxHeight = MAX_IMAGE_DIMENSION,
    targetSize = TARGET_FILE_SIZE,
    quality: initialQuality = START_QUALITY,
    format = 'image/jpeg',
  } = options;

  // If file is already small enough, convert and return as-is
  if (file.size <= targetSize) {
    return convertToResult(file, file.size, initialQuality);
  }

  // Load the image
  const img = await loadImage(file);
  
  // Calculate new dimensions while maintaining aspect ratio
  const { width, height } = calculateDimensions(
    img.naturalWidth,
    img.naturalHeight,
    maxWidth,
    maxHeight
  );

  // Create a canvas for drawing the resized image
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Draw the image on the canvas (this resizes it)
  ctx.drawImage(img, 0, 0, width, height);

  // Progressively reduce quality until we reach target size
  let quality = initialQuality;
  let blob: Blob | null = null;

  while (quality >= MIN_QUALITY) {
    blob = await canvasToBlob(canvas, format, quality);
    
    if (blob && blob.size <= targetSize) {
      break;
    }
    
    quality -= QUALITY_STEP;
  }

  // Final compression attempt at minimum quality if still too large
  if (!blob || blob.size > targetSize) {
    blob = await canvasToBlob(canvas, format, MIN_QUALITY);
    quality = MIN_QUALITY;
  }

  if (!blob) {
    throw new Error('Failed to compress image');
  }

  // Convert blob to data URL
  const dataUrl = await blobToDataUrl(blob);

  return {
    blob,
    dataUrl,
    originalSize: file.size,
    compressedSize: blob.size,
    compressionRatio: file.size / blob.size,
    quality,
    width,
    height,
  };
}

/**
 * Compresses multiple image files.
 * 
 * @param files - Array of image files to compress
 * @param options - Compression options (applied to all images)
 * @returns Promise resolving to array of compression results
 */
export async function compressImages(
  files: File[],
  options: CompressionOptions = {}
): Promise<CompressionResult[]> {
  return Promise.all(files.map(file => compressImage(file, options)));
}

/**
 * Compresses an image from a data URL.
 * 
 * @param dataUrl - The image as a base64 data URL
 * @param options - Compression options
 * @returns Promise resolving to compression result
 */
export async function compressDataUrl(
  dataUrl: string,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const blob = await dataUrlToBlob(dataUrl);
  const file = new File([blob], 'image.jpg', { type: blob.type });
  return compressImage(file, options);
}

/**
 * Checks if a file needs compression based on size.
 * 
 * @param file - The file to check
 * @param targetSize - Target size in bytes (default: 200KB)
 * @returns true if the file should be compressed
 */
export function needsCompression(
  file: File,
  targetSize: number = TARGET_FILE_SIZE
): boolean {
  return file.size > targetSize;
}

/**
 * Gets a human-readable file size string.
 * 
 * @param bytes - Size in bytes
 * @returns Human-readable size string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ============================================
// Helper Functions
// ============================================

/**
 * Loads an image from a file.
 */
async function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Calculates new dimensions while maintaining aspect ratio.
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let width = originalWidth;
  let height = originalHeight;

  // Only resize if the image is larger than max dimensions
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }

  // Calculate aspect ratio
  const aspectRatio = width / height;

  if (width > maxWidth) {
    width = maxWidth;
    height = Math.round(width / aspectRatio);
  }

  if (height > maxHeight) {
    height = maxHeight;
    width = Math.round(height * aspectRatio);
  }

  return { width, height };
}

/**
 * Converts a canvas to a Blob.
 */
async function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob),
      type,
      quality
    );
  });
}

/**
 * Converts a Blob to a data URL.
 */
async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read blob'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Converts a data URL to a Blob.
 */
async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  return response.blob();
}

/**
 * Converts a file to a CompressionResult without actual compression.
 * Used when the file is already small enough.
 */
async function convertToResult(
  file: File,
  originalSize: number,
  quality: number
): Promise<CompressionResult> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

  // Get image dimensions
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load image'));
    image.src = dataUrl;
  });

  return {
    blob: file,
    dataUrl,
    originalSize,
    compressedSize: file.size,
    compressionRatio: 1,
    quality,
    width: img.naturalWidth,
    height: img.naturalHeight,
  };
}
