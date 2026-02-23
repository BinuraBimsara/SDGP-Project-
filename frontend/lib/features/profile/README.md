# Profile Feature — Member 1 (User Management)

This feature handles:
- User profile display and editing
- Complaint history tracking
- User preferences

## Directory Structure
```
profile/
├── data/
│   ├── datasources/    ← Firestore user profile queries
│   └── repositories/   ← Profile repository implementations
├── domain/
│   ├── entities/       ← User profile model
│   └── repositories/   ← Abstract profile repository interface
└── presentation/
    ├── pages/          ← Profile page, settings page
    └── widgets/        ← Profile-specific UI components
```
