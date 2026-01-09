# CivicReport - Community Issue Tracker

A mobile and desktop application for reporting and tracking community infrastructure issues like potholes, waste management, and damaged infrastructure.

## 📱 Available Versions

This project includes multiple versions that you can access:

### 1. **AppWithAuth.tsx** (Recommended - Current Active)
- Complete app with Google login page
- Toggle between Mobile and Desktop views
- User authentication flow
- **This is the main entry point**

### 2. **App.tsx** (Mobile Version)
- Optimized for mobile devices
- Full-screen detail views
- Touch-friendly interface
- Responsive design for all phone sizes

### 3. **AppDesktop.tsx** (Desktop Version)
- Side-by-side layout
- Feed on left, details on right
- Optimized for large screens

## 🔄 How to Switch Between Versions

### Method 1: Using AppWithAuth (Easy - Recommended)
The `AppWithAuth.tsx` component includes both versions with a built-in toggle:
1. Login using Google or email
2. Use the floating buttons in the top-right to switch between Mobile/Desktop views
3. Your user session persists across both views

### Method 2: Manually Change Entry Point
Edit your main entry file (e.g., `main.tsx` or `index.tsx`):

```typescript
// For version with authentication (default)
import App from './AppWithAuth'

// For mobile-only version
import App from './App'

// For desktop-only version
import App from './AppDesktop'
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. **Create a new Vite project:**
```bash
npm create vite@latest civic-report -- --template react-ts
cd civic-report
```

2. **Install dependencies:**
```bash
npm install
npm install tailwindcss@next @tailwindcss/vite@next
npm install lucide-react
npm install class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-slot @radix-ui/react-separator
```

3. **Copy all project files to your `src/` directory**

4. **Configure Tailwind (vite.config.ts):**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

5. **Update src/main.tsx:**
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './AppWithAuth.tsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

6. **Run the development server:**
```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

## 🔐 Google Authentication Setup

### Current Implementation (Demo Mode)
The app currently uses **simulated Google login** for demonstration purposes. Click any login button to access the app.

### Production Setup (Real Google OAuth)

To implement real Google authentication:

1. **Create a Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable Google+ API

2. **Create OAuth Credentials:**
   - Go to Credentials → Create Credentials → OAuth 2.0 Client ID
   - Add authorized redirect URIs (e.g., `http://localhost:5173/auth/callback`)
   - Copy your Client ID

3. **Install Google Auth Library:**
```bash
npm install @react-oauth/google
```

4. **Update LoginPage.tsx:**
```typescript
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// Wrap your app with GoogleOAuthProvider
<GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
  <App />
</GoogleOAuthProvider>

// Replace the handleGoogleLogin function
<GoogleLogin
  onSuccess={credentialResponse => {
    // Handle successful login
    const decoded = jwt_decode(credentialResponse.credential);
    onLogin({
      name: decoded.name,
      email: decoded.email,
      avatar: decoded.picture
    });
  }}
  onError={() => {
    console.log('Login Failed');
  }}
/>
```

## 📂 Project Structure

```
src/
├── App.tsx                      # Mobile version (main)
├── AppDesktop.tsx              # Desktop version
├── AppWithAuth.tsx             # Authentication wrapper (entry point)
├── components/
│   ├── LoginPage.tsx           # Login/authentication page
│   ├── ReportFeed.tsx          # Desktop feed component
│   ├── ReportFeedMobile.tsx    # Mobile feed component
│   ├── ReportCard.tsx          # Desktop report card
│   ├── ReportCardMobile.tsx    # Mobile report card
│   ├── ReportDetail.tsx        # Desktop detail view
│   ├── ReportDetailMobile.tsx  # Mobile detail view
│   ├── ReportForm.tsx          # Report submission form
│   └── ui/                     # Shadcn UI components
├── lib/
│   └── data.ts                 # Mock data and types
└── styles/
    └── globals.css             # Global styles and Tailwind config
```

## 🎨 Features

- ✅ Google OAuth login (demo mode)
- ✅ Report community issues with photos and location
- ✅ Filter by category and status
- ✅ Sort by recent or popular
- ✅ Upvote issues
- ✅ Comment on reports
- ✅ Government official view with status updates
- ✅ Mobile-optimized UI
- ✅ Desktop-optimized UI
- ✅ Responsive design

## 🔧 Customization

### Switch Default View
Edit `AppWithAuth.tsx`:
```typescript
const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
// Change to 'desktop' for desktop default
```

### Modify Mock Data
Edit `lib/data.ts` to change the initial reports and categories.

### Styling
All styles are in `styles/globals.css` using Tailwind CSS v4.

## 📱 Mobile Optimization

The mobile version includes:
- Viewport meta tag configuration
- Touch-friendly UI elements
- Prevented zoom on input focus
- Full-screen transitions
- Optimized for screens 320px - 768px

## 🖥️ Desktop Features

The desktop version includes:
- Side-by-side layout
- Persistent detail panel
- Larger content area
- Optimized for screens 1024px+

## 🤝 Contributing

Feel free to fork this project and customize it for your community's needs!

## 📄 License

This project is open source and available for community use.
