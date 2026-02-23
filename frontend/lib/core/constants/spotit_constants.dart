/// App-wide constants for SpotIT.
class SpotITConstants {
  SpotITConstants._();

  /// Application name shown in the UI.
  static const String appName = 'SpotIT';

  /// Default search radius for nearby complaints (in km).
  static const double defaultRadiusKm = 5.0;

  /// Firestore collection names.
  static const String complaintsCollection = 'complaints';
  static const String usersCollection = 'users';
  static const String officersCollection = 'officers';

  /// Complaint status values.
  static const String statusPending = 'Pending';
  static const String statusInProgress = 'In Progress';
  static const String statusResolved = 'Resolved';

  /// Complaint categories.
  static const List<String> categories = [
    'All',
    'Road',
    'Waste',
    'Infrastructure',
    'Lighting',
    'Pothole',
    'General',
  ];
}
