# Data Sharing & Read-Only Access Setup Guide

This guide will help you set up Firebase for real-time data syncing and enable you to share read-only access with your organization's secretary general.

## Overview

The sharing feature allows you to:
- Generate a unique 6-character share code
- Share a link with read-only access for viewing and printing reports
- Maintain real-time data synchronization
- Revoke access at any time

## Step 1: Set Up Firebase Project

### 1.1 Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter your project name (e.g., "Finance Club Manager")
4. Uncheck "Enable Google Analytics" (optional)
5. Click "Create project"

### 1.2 Enable Realtime Database
1. In the Firebase Console, go to **Build** → **Realtime Database**
2. Click "Create Database"
3. Choose your region (closest to your location is best)
4. Choose **Start in test mode** for development
   - ⚠️ **Important**: Set up security rules before going to production
5. Click "Enable"

### 1.3 Set Up Security Rules
1. Go to **Build** → **Realtime Database** → **Rules** tab
2. Replace the existing rules with the following:

```json
{
  "rules": {
    "shareCodes": {
      "$code": {
        ".read": true,
        ".write": "auth.uid == root.child('shareCodes').child($code).child('ownerId').val()"
      }
    },
    "sharedData": {
      "$code": {
        ".read": true,
        ".write": "auth.uid == root.child('shareCodes').child($code).child('ownerId').val()"
      }
    }
  }
}
```

3. Click "Publish"

### 1.4 Get Your Firebase Credentials
1. Go to **Project Settings** (gear icon) → **Project Settings**
2. Scroll down to "Your apps" section
3. Click "Web" app icon (or create a new web app if none exists)
4. Copy the Firebase configuration object
5. You'll see the config with these keys:
   - `apiKey`
   - `authDomain`
   - `databaseURL`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

## Step 2: Configure Your App

### 2.1 Create `.env.local` File
1. In your project root, create a file named `.env.local`
2. Copy the contents from `.env.example`
3. Fill in your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY_HERE
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

### 2.2 Install Dependencies
```bash
npm install
```

## Step 3: Set Up Sharing in Your App

### 3.1 Access Share Settings
1. Log in to your app with your PIN
2. Go to **Settings**
3. Find the "Share Settings" section

### 3.2 Generate a Share Code
1. Click "Generate Share Code"
2. A 6-character code will be created (e.g., `ABC123`)
3. The code is valid for 1 year

### 3.3 Share with Secretary General
Share this link with your secretary general:
```
https://yourapp.com?shareCode=ABC123
```

Or share just the code `ABC123` and instruct them to:
1. Visit your app
2. Click "View Report" or access the view-only login page
3. Enter the 6-character share code

## Step 4: Data Syncing

### 4.1 Automatic Sync
- Your transactions, receipts, and notes are automatically synced to Firebase
- This happens whenever you add, update, or delete data
- Changes appear in read-only view within seconds

### 4.2 Manual Sync (if needed)
The app syncs automatically. If you need to manually trigger a sync:
1. Add or update a transaction
2. The data will sync to Firebase automatically

## Step 5: Access Control & Permissions

### 5.1 Owner (You - Full Access)
- ✅ View all data
- ✅ Add, edit, delete transactions
- ✅ Upload and manage receipts
- ✅ Generate and revoke share codes
- ✅ Print reports

### 5.2 Secretary General (Read-Only Access)
- ✅ View all transactions, receipts, and reports
- ✅ Print reports
- ❌ Cannot add, edit, or delete data
- ❌ Cannot access settings or audit trail

## Step 6: Revoking Access

### 6.1 Disable Share Code
1. Go to **Settings** → **Share Settings**
2. Click "Revoke Access"
3. Confirm the action
4. The secretary general will no longer be able to access the data

### 6.2 Generate New Code
1. After revoking, click "Generate New Code"
2. Share the new code with the secretary general

## Troubleshooting

### Share code validation fails
- Ensure the code is exactly 6 characters
- Check that Firebase is properly configured
- Verify internet connection

### Data not syncing
- Check `.env.local` file has correct Firebase credentials
- Verify Firebase Realtime Database is enabled
- Check browser console for errors
- Refresh the page

### Secretary general can't access data
- Verify the share code is correct
- Check the code hasn't expired (1 year from creation)
- Ensure the app has internet connectivity
- Verify Firebase rules allow read access

## Security Best Practices

1. **Share codes are long-lived** - Generate a new code when changing team members
2. **Database rules are in test mode** - Set up proper authentication rules for production
3. **No PIN required for view-only access** - This is intentional for easy sharing
4. **Data is stored in Firebase** - Choose a region close to you
5. **Revoke codes promptly** - When access is no longer needed

## Production Deployment

Before deploying to production:

1. **Update Firebase Security Rules** to require proper authentication
2. **Set up proper backups** in Firebase
3. **Monitor database usage** to stay within free tier
4. **Use environment variables** for sensitive data
5. **Test thoroughly** with the secretary general

## Vercel Deployment

If deploying on Vercel:

1. Go to **Settings** → **Environment Variables**
2. Add all `VITE_FIREBASE_*` variables
3. Redeploy the app
4. Test the share functionality

## Support

For Firebase-related issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Realtime Database Guide](https://firebase.google.com/docs/database)

For app-related issues:
- Check browser console for errors
- Verify `.env.local` file is in the project root
- Ensure all Firebase credentials are correct
