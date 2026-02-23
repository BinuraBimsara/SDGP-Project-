import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:geoflutterfire_plus/geoflutterfire_plus.dart';
import 'package:spotit/features/complaints/data/models/complaint_model.dart';

class SpotITGeoComplaintRepository {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Stream of complaints within a certain radius
  Stream<List<Complaint>> getComplaintsWithinRadius({
    required double latitude,
    required double longitude,
    required double radiusInKm,
  }) {
    final center = GeoFirePoint(GeoPoint(latitude, longitude));
    final collectionReference = _firestore.collection('complaints');

    // geoflutterfire_plus query
    return GeoCollectionReference(collectionReference)
        .subscribeWithin(
          center: center,
          radiusInKm: radiusInKm,
          field: 'position',
          geopointFrom: (data) => (data['position']['geopoint'] as GeoPoint),
        )
        .map((snapshots) {
          // Convert document snapshots to Complaint objects
          return snapshots
              .map(
                (doc) => Complaint.fromDocument(doc),
              ) // Use fromDocument which expects DocumentSnapshot
              .toList();
        });
  }

  // Method to add a complaint (example)
  Future<void> addComplaint(Complaint complaint) async {
    await _firestore
        .collection('complaints')
        .doc(complaint.id)
        .set(complaint.toJson());
  }
}
