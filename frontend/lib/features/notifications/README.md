# Notifications Feature — Member 5 (API Integration & Notifications)

This feature handles:
- Firebase Cloud Messaging (FCM) push notifications
- Google Maps API for reverse-geocoding
- Real-time alerts for government dashboard

## Directory Structure
```
notifications/
├── data/
│   ├── datasources/    ← FCM service, Google Maps API calls
│   └── repositories/   ← Notification repository implementations
├── domain/
│   ├── entities/       ← Notification model
│   └── repositories/   ← Abstract notification repository interface
└── presentation/
    ├── pages/          ← Notification list, detail page
    └── widgets/        ← Notification cards, badges
```
