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
  final DateTime timestamp;
  final String authorId;
  final GeoFirePoint position;

  Complaint({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.imageUrl,
    required this.status,
    required this.upvoteCount,
    required this.timestamp,
    required this.authorId,
    required this.position,
  });

  factory Complaint.fromDocument(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    final geoPoint = data['position']['geopoint'] as GeoPoint;
    
    return Complaint(
      id: doc.id,
      title: data['title'] ?? '',
      description: data['description'] ?? '',
      category: data['category'] ?? 'General',
      imageUrl: data['imageUrl'] ?? '',
      status: data['status'] ?? 'Pending',
      upvoteCount: data['upvoteCount'] ?? 0,
      timestamp: (data['timestamp'] as Timestamp).toDate(),
      authorId: data['authorId'] ?? '',
      position: GeoFirePoint(geoPoint),
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
      'timestamp': Timestamp.fromDate(timestamp),
      'authorId': authorId,
      'position': position.data,
    };
  }

  // Helper for human-readable location (optional, can be expanded)
  String get locationString => '${position.latitude.toStringAsFixed(4)}, ${position.longitude.toStringAsFixed(4)}';
}
