import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:geoflutterfire_plus/geoflutterfire_plus.dart';
import 'package:spotit/firebase_options.dart';

/// Seeds sample complaint data into Firestore.
///
/// Run with:
///   flutter run -t scripts/seed_data.dart
///
/// This must run as a Flutter app to access firebase_core plugins.
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);

  debugPrint('Seeding data...');
  await seedComplaints();
  debugPrint('Data seeded successfully!');
}

Future<void> seedComplaints() async {
  final firestore = FirebaseFirestore.instance;
  final collection = firestore.collection('complaints');

  // Colombo, Sri Lanka coordinates
  const centerLat = 6.9271;
  const centerLng = 79.8612;

  final complaints = [
    {
      'title': 'Huge Pothole on Main St',
      'description': 'Deep pothole causing traffic slowdowns near the market.',
      'category': 'Road',
      'status': 'Pending',
      'upvoteCount': 15,
      'latitude': centerLat + 0.001,
      'longitude': centerLng + 0.001,
      'imageUrl': 'https://picsum.photos/seed/pothole/400/200',
    },
    {
      'title': 'Broken Street Light',
      'description': 'Street light flickering and erratic behavior at night.',
      'category': 'Infrastructure',
      'status': 'In Progress',
      'upvoteCount': 8,
      'latitude': centerLat - 0.002,
      'longitude': centerLng + 0.002,
      'imageUrl': 'https://picsum.photos/seed/light/400/200',
    },
    {
      'title': 'Garbage Pileup',
      'description': 'Uncollected garbage for 3 days.',
      'category': 'Waste',
      'status': 'Resolved',
      'upvoteCount': 42,
      'latitude': centerLat + 0.005,
      'longitude': centerLng - 0.003,
      'imageUrl': 'https://picsum.photos/seed/garbage/400/200',
    },
  ];

  for (var data in complaints) {
    final geoFirePoint = GeoFirePoint(
      GeoPoint(data['latitude'] as double, data['longitude'] as double),
    );

    await collection.add({
      'title': data['title'],
      'description': data['description'],
      'category': data['category'],
      'status': data['status'],
      'upvoteCount': data['upvoteCount'],
      'imageUrl': data['imageUrl'],
      'timestamp': FieldValue.serverTimestamp(),
      'authorId': 'test_user_1',
      'position': geoFirePoint.data,
    });
  }
}
