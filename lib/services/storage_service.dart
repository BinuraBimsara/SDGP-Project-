import 'dart:io';
import 'dart:typed_data';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:path/path.dart' as path;
import 'package:uuid/uuid.dart';

/// Service responsible for managing Firebase Cloud Storage operations.
/// 
/// Handles file uploads, downloads, and deletions for report evidence
/// (photos and videos). Implements image compression to optimize uploads
/// for users with slow network connections.
class StorageService {
  final FirebaseStorage _storage = FirebaseStorage.instance;
  final Uuid _uuid = const Uuid();

  /// The base path for storing report evidence files
  static const String _reportsBasePath = 'reports';

  /// Target file size for compressed images (in bytes) - approximately 200KB
  static const int _targetImageSizeBytes = 200 * 1024;

  /// Maximum image dimension (width or height) after compression
  static const int _maxImageDimension = 1920;

  /// Minimum quality for JPEG compression (0-100)
  static const int _minQuality = 20;

  /// Starting quality for JPEG compression (0-100)
  static const int _startQuality = 85;

  /// Uploads an image file to Firebase Storage with automatic compression.
  /// 
  /// The image is compressed before upload to reduce file size and improve
  /// upload speed, especially for users on slow networks.
  /// 
  /// Returns the download URL of the uploaded file.
  /// 
  /// [reportId] - The unique identifier of the report this image belongs to.
  /// [imageFile] - The image file to upload.
  /// [fileName] - Optional custom filename. If not provided, a UUID will be generated.
  Future<String> uploadReportImage({
    required String reportId,
    required File imageFile,
    String? fileName,
  }) async {
    // Compress the image before uploading
    final Uint8List? compressedData = await compressImage(imageFile);
    
    if (compressedData == null) {
      throw Exception('Failed to compress image');
    }

    // Generate a unique filename if not provided
    final String finalFileName = fileName ?? '${_uuid.v4()}.jpg';
    
    // Create the storage path: reports/{reportId}/{filename}
    final String storagePath = '$_reportsBasePath/$reportId/$finalFileName';
    
    // Create a reference to the storage location
    final Reference ref = _storage.ref().child(storagePath);
    
    // Set metadata for the uploaded file
    final SettableMetadata metadata = SettableMetadata(
      contentType: 'image/jpeg',
      customMetadata: {
        'reportId': reportId,
        'uploadedAt': DateTime.now().toIso8601String(),
        'compressed': 'true',
      },
    );
    
    // Upload the compressed image data
    final UploadTask uploadTask = ref.putData(compressedData, metadata);
    
    // Wait for the upload to complete
    final TaskSnapshot snapshot = await uploadTask;
    
    // Get and return the download URL
    final String downloadUrl = await snapshot.ref.getDownloadURL();
    
    return downloadUrl;
  }

  /// Uploads multiple images for a report.
  /// 
  /// Returns a list of download URLs for all successfully uploaded images.
  /// 
  /// [reportId] - The unique identifier of the report.
  /// [imageFiles] - List of image files to upload.
  Future<List<String>> uploadMultipleReportImages({
    required String reportId,
    required List<File> imageFiles,
  }) async {
    final List<String> downloadUrls = [];
    
    for (int i = 0; i < imageFiles.length; i++) {
      final String fileName = 'evidence_${i + 1}_${_uuid.v4()}.jpg';
      final String url = await uploadReportImage(
        reportId: reportId,
        imageFile: imageFiles[i],
        fileName: fileName,
      );
      downloadUrls.add(url);
    }
    
    return downloadUrls;
  }

  /// Compresses an image file to reduce its size.
  /// 
  /// Uses progressive quality reduction to achieve target file size
  /// while maintaining acceptable image quality.
  /// 
  /// [imageFile] - The original image file to compress.
  /// 
  /// Returns the compressed image data as Uint8List, or null if compression fails.
  Future<Uint8List?> compressImage(File imageFile) async {
    try {
      // Read the original file
      final Uint8List originalBytes = await imageFile.readAsBytes();
      
      // If the image is already small enough, return it as-is
      if (originalBytes.length <= _targetImageSizeBytes) {
        return originalBytes;
      }
      
      // Start with high quality and reduce until we reach target size
      int quality = _startQuality;
      Uint8List? result;
      
      while (quality >= _minQuality) {
        result = await FlutterImageCompress.compressWithList(
          originalBytes,
          minWidth: _maxImageDimension,
          minHeight: _maxImageDimension,
          quality: quality,
          format: CompressFormat.jpeg,
        );
        
        // Check if we've reached the target size
        if (result != null && result.length <= _targetImageSizeBytes) {
          break;
        }
        
        // Reduce quality for next iteration
        quality -= 10;
      }
      
      return result;
    } catch (e) {
      debugPrint('Error compressing image: $e');
      return null;
    }
  }

  /// Compresses an image from bytes (useful for web/camera captures).
  /// 
  /// [imageBytes] - The original image bytes to compress.
  /// [quality] - The compression quality (0-100). Default is 85.
  /// 
  /// Returns the compressed image data as Uint8List, or null if compression fails.
  Future<Uint8List?> compressImageBytes(
    Uint8List imageBytes, {
    int quality = 85,
  }) async {
    try {
      // If the image is already small enough, return it as-is
      if (imageBytes.length <= _targetImageSizeBytes) {
        return imageBytes;
      }
      
      return await FlutterImageCompress.compressWithList(
        imageBytes,
        minWidth: _maxImageDimension,
        minHeight: _maxImageDimension,
        quality: quality,
        format: CompressFormat.jpeg,
      );
    } catch (e) {
      debugPrint('Error compressing image bytes: $e');
      return null;
    }
  }

  /// Deletes a file from Firebase Storage.
  /// 
  /// [downloadUrl] - The download URL of the file to delete.
  Future<void> deleteFile(String downloadUrl) async {
    try {
      final Reference ref = _storage.refFromURL(downloadUrl);
      await ref.delete();
    } catch (e) {
      debugPrint('Error deleting file: $e');
      rethrow;
    }
  }

  /// Deletes all evidence files for a specific report.
  /// 
  /// [reportId] - The unique identifier of the report.
  Future<void> deleteAllReportFiles(String reportId) async {
    try {
      final String folderPath = '$_reportsBasePath/$reportId';
      final Reference folderRef = _storage.ref().child(folderPath);
      
      // List all items in the folder
      final ListResult result = await folderRef.listAll();
      
      // Delete each item
      for (final Reference itemRef in result.items) {
        await itemRef.delete();
      }
    } catch (e) {
      debugPrint('Error deleting report files: $e');
      rethrow;
    }
  }

  /// Gets all download URLs for files associated with a report.
  /// 
  /// [reportId] - The unique identifier of the report.
  /// 
  /// Returns a list of download URLs for all files in the report's folder.
  Future<List<String>> getReportFileUrls(String reportId) async {
    try {
      final String folderPath = '$_reportsBasePath/$reportId';
      final Reference folderRef = _storage.ref().child(folderPath);
      
      // List all items in the folder
      final ListResult result = await folderRef.listAll();
      
      // Get download URLs for each item
      final List<String> urls = [];
      for (final Reference itemRef in result.items) {
        final String url = await itemRef.getDownloadURL();
        urls.add(url);
      }
      
      return urls;
    } catch (e) {
      debugPrint('Error getting report file URLs: $e');
      return [];
    }
  }

  /// Gets metadata for a file.
  /// 
  /// [downloadUrl] - The download URL of the file.
  /// 
  /// Returns the full metadata of the file.
  Future<FullMetadata> getFileMetadata(String downloadUrl) async {
    final Reference ref = _storage.refFromURL(downloadUrl);
    return await ref.getMetadata();
  }
}
