/**
 * Firebase Storage Service for SpotIT Web App
 * 
 * This service handles all Firebase Cloud Storage operations including:
 * - Uploading evidence files (photos/videos) for reports
 * - Managing the folder structure: reports/{reportID}/{filename}
 * - Integrating with image compression for optimized uploads
 * - Providing download URLs to link with Firestore documents
 */

import {
  compressImage,
  compressImages,
  CompressionResult,
  CompressionOptions,
  formatFileSize,
  needsCompression,
} from './imageCompression';

// Storage path constants
const REPORTS_BASE_PATH = 'reports';
const USERS_BASE_PATH = 'users';

// File validation constants
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

export interface UploadProgress {
  /** Progress percentage (0-100) */
  progress: number;
  /** Bytes transferred */
  bytesTransferred: number;
  /** Total bytes to transfer */
  totalBytes: number;
  /** Current state: 'compressing' | 'uploading' | 'completed' | 'error' */
  state: 'compressing' | 'uploading' | 'completed' | 'error';
  /** Error message if state is 'error' */
  error?: string;
}

export interface UploadResult {
  /** The download URL of the uploaded file */
  downloadUrl: string;
  /** The storage path of the file */
  storagePath: string;
  /** Original file name */
  fileName: string;
  /** File size after compression (or original if not compressed) */
  fileSize: number;
  /** Original file size before compression */
  originalSize: number;
  /** Whether the file was compressed */
  wasCompressed: boolean;
  /** Compression ratio (original / final) */
  compressionRatio: number;
}

export interface FileMetadata {
  /** Report ID this file belongs to */
  reportId: string;
  /** User ID of the uploader */
  uploadedBy: string;
  /** Upload timestamp */
  uploadedAt: string;
  /** Whether the file was compressed before upload */
  compressed: string;
  /** Original file name */
  originalFileName: string;
}

/**
 * StorageService class for managing Firebase Storage operations.
 * 
 * Note: This service is designed to work with Firebase SDK.
 * The actual Firebase initialization should be done in the app's
 * configuration, and the storage instance passed to this service.
 */
export class StorageService {
  /**
   * Generates a unique file name with UUID.
   */
  private generateFileName(originalName: string, index?: number): string {
    const uuid = crypto.randomUUID();
    const extension = originalName.split('.').pop() || 'jpg';
    const prefix = index !== undefined ? `evidence_${index + 1}_` : '';
    return `${prefix}${uuid}.${extension}`;
  }

  /**
   * Generates the storage path for a report evidence file.
   */
  getReportStoragePath(reportId: string, fileName: string): string {
    return `${REPORTS_BASE_PATH}/${reportId}/${fileName}`;
  }

  /**
   * Generates the storage path for a user profile image.
   */
  getUserProfileStoragePath(userId: string, fileName: string): string {
    return `${USERS_BASE_PATH}/${userId}/profile/${fileName}`;
  }

  /**
   * Validates an image file before upload.
   */
  validateImageFile(file: File): { valid: boolean; error?: string } {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid image type: ${file.type}. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
      };
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return {
        valid: false,
        error: `Image too large: ${formatFileSize(file.size)}. Maximum: ${formatFileSize(MAX_IMAGE_SIZE)}`,
      };
    }

    return { valid: true };
  }

  /**
   * Validates a video file before upload.
   */
  validateVideoFile(file: File): { valid: boolean; error?: string } {
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid video type: ${file.type}. Allowed: ${ALLOWED_VIDEO_TYPES.join(', ')}`,
      };
    }

    if (file.size > MAX_VIDEO_SIZE) {
      return {
        valid: false,
        error: `Video too large: ${formatFileSize(file.size)}. Maximum: ${formatFileSize(MAX_VIDEO_SIZE)}`,
      };
    }

    return { valid: true };
  }

  /**
   * Prepares an image for upload by compressing if necessary.
   * 
   * This method compresses the image to reduce upload time and save
   * bandwidth, especially important for users on slow connections.
   */
  async prepareImageForUpload(
    file: File,
    options?: CompressionOptions
  ): Promise<CompressionResult> {
    return compressImage(file, options);
  }

  /**
   * Prepares multiple images for upload by compressing them.
   */
  async prepareImagesForUpload(
    files: File[],
    options?: CompressionOptions
  ): Promise<CompressionResult[]> {
    return compressImages(files, options);
  }

  /**
   * Creates metadata for a report evidence file.
   */
  createReportFileMetadata(
    reportId: string,
    uploadedBy: string,
    originalFileName: string,
    wasCompressed: boolean
  ): FileMetadata {
    return {
      reportId,
      uploadedBy,
      uploadedAt: new Date().toISOString(),
      compressed: String(wasCompressed),
      originalFileName,
    };
  }

  /**
   * Simulates an upload process for demo/development purposes.
   * In production, this would use the actual Firebase Storage SDK.
   * 
   * @param file - The file to upload
   * @param reportId - The report ID for organizing the file
   * @param onProgress - Progress callback
   * @returns Promise resolving to upload result with download URL
   */
  async uploadReportEvidence(
    file: File,
    reportId: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    // Validate the file first
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (isImage) {
      const validation = this.validateImageFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
    } else if (isVideo) {
      const validation = this.validateVideoFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
    } else {
      throw new Error('Unsupported file type. Please upload an image or video.');
    }

    const originalSize = file.size;
    let finalFile: File | Blob = file;
    let wasCompressed = false;
    let compressionRatio = 1;

    // Compress images if they need it
    if (isImage && needsCompression(file)) {
      onProgress?.({
        progress: 0,
        bytesTransferred: 0,
        totalBytes: file.size,
        state: 'compressing',
      });

      try {
        const compressionResult = await this.prepareImageForUpload(file);
        finalFile = compressionResult.blob;
        wasCompressed = true;
        compressionRatio = compressionResult.compressionRatio;
      } catch (error) {
        console.warn(
          'Image compression failed. Uploading original file instead. ' +
          'This may result in slower upload times and higher data usage. ' +
          'Consider uploading a smaller image if on a slow connection.',
          error
        );
      }
    }

    // Generate storage path
    const fileName = this.generateFileName(file.name);
    const storagePath = this.getReportStoragePath(reportId, fileName);

    // Simulate upload progress
    // In production, this would use Firebase Storage uploadTask.on('state_changed', ...)
    onProgress?.({
      progress: 50,
      bytesTransferred: finalFile.size / 2,
      totalBytes: finalFile.size,
      state: 'uploading',
    });

    // In production, this would be the actual Firebase Storage upload
    // For now, we create a local object URL as a placeholder
    const downloadUrl = URL.createObjectURL(finalFile);

    onProgress?.({
      progress: 100,
      bytesTransferred: finalFile.size,
      totalBytes: finalFile.size,
      state: 'completed',
    });

    return {
      downloadUrl,
      storagePath,
      fileName,
      fileSize: finalFile.size,
      originalSize,
      wasCompressed,
      compressionRatio,
    };
  }

  /**
   * Uploads multiple files for a report.
   * 
   * @param files - Array of files to upload
   * @param reportId - The report ID
   * @param onProgress - Progress callback for each file
   * @returns Promise resolving to array of upload results
   */
  async uploadMultipleReportEvidence(
    files: File[],
    reportId: string,
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const result = await this.uploadReportEvidence(
        files[i],
        reportId,
        (progress) => onProgress?.(i, progress)
      );
      results.push(result);
    }

    return results;
  }
}

// Export a singleton instance for convenience
export const storageService = new StorageService();

// Re-export image compression utilities
export { 
  compressImage, 
  compressImages, 
  formatFileSize, 
  needsCompression 
};
export type { CompressionResult, CompressionOptions };
