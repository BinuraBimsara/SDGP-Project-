# 🔍 SpotIT

A citizen complaint management system built with Flutter and Firebase. Citizens can report infrastructure issues (potholes, broken streetlights, illegal dumping, etc.) with photo evidence, while government officials can track and resolve complaints through a dedicated dashboard.

## Tech Stack

- **Frontend:** Flutter (Android, iOS, Web)
- **Backend:** Firebase Cloud Functions (Node.js)
- **Database:** Cloud Firestore (NoSQL, real-time sync)
- **Storage:** Firebase Cloud Storage (image evidence)
- **Auth:** Firebase Authentication (Google Sign-in + anonymous)
- **Notifications:** Firebase Cloud Messaging (FCM)
- **Maps:** Google Maps API (reverse geocoding)

## Project Structure

```
spotit/
├── frontend/                  ← Flutter mobile & web app
│   ├── lib/
│   │   ├── main.dart          ← App entry point
│   │   ├── firebase_options.dart
│   │   ├── core/              ← Shared modules (all members)
│   │   │   ├── constants/     ← App-wide constants
│   │   │   ├── services/      ← Location, network services
│   │   │   ├── theme/         ← SpotIT theme config
│   │   │   └── utils/         ← Shared utility functions
│   │   └── features/          ← Feature-based modules
│   │       ├── auth/          ← Member 1: Authentication
│   │       ├── complaints/    ← Member 2: Data architecture (DONE)
│   │       ├── reporting/     ← Member 3: Report creation + image upload
│   │       ├── home/          ← Shared: Home feed & complaint details
│   │       ├── notifications/ ← Member 5: Push notifications
│   │       ├── dashboard/     ← Member 6: Admin dashboard
│   │       └── profile/       ← Member 1: User profiles
│   ├── scripts/
│   │   └── seed_data.dart     ← Seed sample data to Firestore
│   ├── test/                  ← Unit & widget tests
│   └── pubspec.yaml
│
├── backend/                   ← Firebase Cloud Functions
│   ├── functions/
│   │   ├── src/
│   │   │   ├── triggers/      ← Member 4: Firestore triggers
│   │   │   ├── api/           ← Member 6: Dashboard endpoints
│   │   │   └── notifications/ ← Member 5: FCM logic
│   │   ├── index.js
│   │   └── package.json
│   └── README.md
│
├── firebase.json              ← Firebase project config
└── .gitignore
```

## Each Feature Directory Follows Clean Architecture

```
feature/
├── data/
│   ├── datasources/     ← API calls, Firebase service integration
│   ├── models/          ← Data models (JSON → Dart)
│   └── repositories/    ← Repository implementations
├── domain/
│   ├── entities/        ← Business entities
│   └── repositories/    ← Abstract repository interfaces
└── presentation/
    ├── pages/           ← Screen-level widgets
    └── widgets/         ← Reusable UI components
```

## Team Member Ownership

| Member | Role | Frontend Features | Backend |
|--------|------|-------------------|---------|
| Member 1 | Security Lead | `auth/`, `profile/` | — |
| Member 2 | Database Lead | `complaints/` (done) | — |
| Member 3 | Storage Lead | `reporting/` | — |
| Member 4 | Cloud Functions | — | `src/triggers/` |
| Member 5 | API & Notifications | `notifications/` | `src/notifications/` |
| Member 6 | Admin Dashboard | `dashboard/` | `src/api/` |

## Getting Started

### Prerequisites
- Flutter SDK (≥ 3.11.0)
- Node.js (v18)
- Firebase CLI (`npm install -g firebase-tools`)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd spotit
   ```

2. **Frontend setup**
   ```bash
   cd frontend
   flutter pub get
   ```

3. **Backend setup**
   ```bash
   cd backend/functions
   npm install
   ```

4. **Run the app**
   ```bash
   cd frontend
   flutter run -d edge     # Web (Edge)
   flutter run -d chrome   # Web (Chrome)
   flutter run              # Connected device/emulator
   ```

5. **Seed sample data** (optional)
   ```bash
   cd frontend
   flutter run -t scripts/seed_data.dart
   ```

## Git Branching Strategy

- `main` — production-ready code
- `development` — integration branch (merge feature branches here)
- `feat/<feature-name>` — individual feature branches (e.g., `feat/auth`, `feat/reporting`)
