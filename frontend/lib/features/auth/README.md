# Auth Feature — Member 1 (Authentication & User Management)

This feature handles:
- Firebase Auth for Google Sign-in
- Anonymous reporting (guest mode)
- Hybrid authentication (guest vs profile)
- Security rules enforcement

## Directory Structure
```
auth/
├── data/
│   ├── datasources/    ← Firebase Auth service calls
│   └── repositories/   ← Auth repository implementations
├── domain/
│   ├── entities/       ← User model, auth state
│   └── repositories/   ← Abstract auth repository interface
└── presentation/
    ├── pages/          ← Login, signup, account pages
    └── widgets/        ← Auth-related UI components
```
