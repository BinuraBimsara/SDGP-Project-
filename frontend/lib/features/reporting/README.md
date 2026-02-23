# Reporting Feature — Member 3 (Storage & Multimedia)

This feature handles:
- Creating new complaint reports with photo evidence
- Firebase Cloud Storage for image upload
- Image compression to minimize data usage
- Linking stored images to Firestore complaint records

## Directory Structure
```
reporting/
├── data/
│   ├── datasources/    ← Cloud Storage service calls, image compression
│   └── repositories/   ← Report submission repository implementations
├── domain/
│   ├── entities/       ← Report model (draft state)
│   └── repositories/   ← Abstract reporting repository interface
└── presentation/
    ├── pages/          ← Report form, camera/gallery picker
    └── widgets/        ← Image preview, category selector, etc.
```
