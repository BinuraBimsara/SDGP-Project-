# Backend — Cloud Functions & Server Logic

This directory contains the Firebase Cloud Functions backend for SpotIT.

## Structure
```
backend/
├── functions/
│   ├── src/
│   │   ├── triggers/        ← Member 4: Firestore triggers (status changes, upvote milestones)
│   │   ├── api/             ← Member 6: Dashboard HTTP endpoints (filtering, sorting, auditing)
│   │   └── notifications/   ← Member 5: FCM push notification logic
│   ├── index.js             ← Entry point — exports all Cloud Functions
│   └── package.json
└── README.md
```

## Setup
```bash
cd backend/functions
npm install
```

## Local Development
```bash
# Start Firebase Emulators
npm run serve

# Deploy to production
npm run deploy
```

## Member Responsibilities
| Member | Directory | Scope |
|--------|-----------|-------|
| Member 4 | `src/triggers/` | Status change triggers, upvote count logic |
| Member 5 | `src/notifications/` | FCM notifications, real-time alerts |
| Member 6 | `src/api/` | Dashboard endpoints, filtering, audit logs |
