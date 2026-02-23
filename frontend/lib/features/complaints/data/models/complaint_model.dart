import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:geoflutterfire_plus/geoflutterfire_plus.dart';

class Complaint {
  final String id;
  final String title;
  final String description;
  final String category;
  final String imageUrl;
  final String status;
  final int upvoteCount;
  final int commentCount;
  final DateTime timestamp;
  final String authorId;
  final String locationName;
  final GeoFirePoint? position;
  final bool isUpvoted;

  Complaint({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.imageUrl,
    required this.status,
    required this.upvoteCount,
    this.commentCount = 0,
    required this.timestamp,
    required this.authorId,
    this.locationName = '',
    this.position,
    this.isUpvoted = false,
  });

  factory Complaint.fromDocument(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    final geoPoint = data['position'] != null
        ? data['position']['geopoint'] as GeoPoint
        : null;

    return Complaint(
      id: doc.id,
      title: data['title'] ?? '',
      description: data['description'] ?? '',
      category: data['category'] ?? 'General',
      imageUrl: data['imageUrl'] ?? '',
      status: data['status'] ?? 'Pending',
      upvoteCount: data['upvoteCount'] ?? 0,
      commentCount: data['commentCount'] ?? 0,
      timestamp: (data['timestamp'] as Timestamp).toDate(),
      authorId: data['authorId'] ?? '',
      locationName: data['locationName'] ?? '',
      position: geoPoint != null ? GeoFirePoint(geoPoint) : null,
      isUpvoted: data['isUpvoted'] ?? false,
    );
  }

  Complaint copyWith({
    String? id,
    String? title,
    String? description,
    String? category,
    String? imageUrl,
    String? status,
    int? upvoteCount,
    int? commentCount,
    DateTime? timestamp,
    String? authorId,
    String? locationName,
    GeoFirePoint? position,
    bool? isUpvoted,
  }) {
    return Complaint(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      category: category ?? this.category,
      imageUrl: imageUrl ?? this.imageUrl,
      status: status ?? this.status,
      upvoteCount: upvoteCount ?? this.upvoteCount,
      commentCount: commentCount ?? this.commentCount,
      timestamp: timestamp ?? this.timestamp,
      authorId: authorId ?? this.authorId,
      locationName: locationName ?? this.locationName,
      position: position ?? this.position,
      isUpvoted: isUpvoted ?? this.isUpvoted,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'description': description,
      'category': category,
      'imageUrl': imageUrl,
      'status': status,
      'upvoteCount': upvoteCount,
      'commentCount': commentCount,
      'timestamp': Timestamp.fromDate(timestamp),
      'authorId': authorId,
      'locationName': locationName,
      'isUpvoted': isUpvoted,
      if (position != null) 'position': position!.data,
    };
  }

  String get locationString {
    if (locationName.isNotEmpty) return locationName;
    if (position != null) {
      return '${position!.latitude.toStringAsFixed(4)}, ${position!.longitude.toStringAsFixed(4)}';
    }
    return 'Unknown location';
  }
}
