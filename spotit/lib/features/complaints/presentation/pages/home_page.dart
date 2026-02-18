import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:spotit/core/services/location_service.dart';
import 'package:spotit/features/complaints/data/models/complaint_model.dart';
import 'package:spotit/features/complaints/data/repositories/complaint_repository.dart';
import 'package:spotit/features/complaints/presentation/widgets/complaint_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final LocationService _locationService = LocationService();
  final ComplaintRepository _complaintRepository = ComplaintRepository();

  Position? _currentPosition;
  Stream<List<Complaint>>? _complaintsStream;
  bool _isLoadingLocation = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _initializeLocation();
  }

  Future<void> _initializeLocation() async {
    try {
      final position = await _locationService.determinePosition();
      setState(() {
        _currentPosition = position;
        _isLoadingLocation = false;
        // Start listening to complaints within 10km radius
        _complaintsStream = _complaintRepository.getComplaintsWithinRadius(
          latitude: position.latitude,
          longitude: position.longitude,
          radiusInKm: 10.0,
        );
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoadingLocation = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('SpotIT Feed'),
        actions: [
          IconButton(
            onPressed: _initializeLocation,
            icon: const Icon(Icons.refresh),
          ),
        ],
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoadingLocation) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 48, color: Colors.red),
            const SizedBox(height: 16),
            Text('Error: $_error'),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _initializeLocation,
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (_complaintsStream == null) {
      return const Center(child: Text('Unable to load feed.'));
    }

    return StreamBuilder<List<Complaint>>(
      stream: _complaintsStream,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }

        if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        }

        final complaints = snapshot.data ?? [];

        if (complaints.isEmpty) {
          return const Center(child: Text('No complaints found nearby.'));
        }

        return ListView.builder(
          itemCount: complaints.length,
          itemBuilder: (context, index) {
            return ComplaintCard(complaint: complaints[index]);
          },
        );
      },
    );
  }
}
