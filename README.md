# Civic Complaint Mobile App

A React Native mobile application for the Civic Complaint Management System built with Expo. This app allows citizens to report and track civic complaints in Pune Municipal Corporation.

## Features

- ✅ **Citizen Authentication** - Login and Registration
- ✅ **Dashboard** - View complaint statistics with interactive tiles
- ✅ **Complaint Management** - Create, view, and track complaints
- ✅ **Location Picker** - Map-based location selection with GPS
- ✅ **Image Upload** - Attach up to 3 photos per complaint
- ✅ **Status Filtering** - Filter complaints by status (Pending, In Progress, Resolved)
- ✅ **Read-Only Details** - View full complaint information

## Technology Stack

- **Framework**: React Native with Expo SDK 50
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **State Management**: React Context API
- **API Client**: Axios with JWT interceptors
- **Maps**: react-native-maps (OpenStreetMap compatible)
- **Storage**: expo-secure-store (encrypted JWT storage)
- **Permissions**: expo-location, expo-image-picker

## Prerequisites

- Node.js 16+ and npm
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android emulator) OR Physical Android device
- Backend API running at `http://localhost:8080`

## Installation

### 1. Install Dependencies

```bash
cd civic-complaint-mobile
npm install
```

### 2. Configure Backend URL

Edit `src/utils/constants.js` and update the API_BASE_URL:

```javascript
// For Android Emulator (localhost on host machine)
export const API_BASE_URL = 'http://10.0.2.2:8080';

// For Physical Device (use your computer's IP)
// export const API_BASE_URL = 'http://192.168.x.x:8080';
```

### 3. Run the App

#### Option A: Using Expo Go (Recommended for Development)

```bash
npm start
```

Then:
- Scan QR code with Expo Go app (Android)
- Or press `a` to open in Android emulator

#### Option B: Development Build

```bash
npm run android
```

This will build and run on connected Android device or emulator.

## Project Structure

```
civic-complaint-mobile/
├── App.js                          # Root component
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── src/
│   ├── api/
│   │   ├── axios.js               # Axios instance with JWT
│   │   ├── authService.js         # Auth API calls
│   │   └── complaintService.js    # Complaint API calls
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── DashboardTile.js
│   │   │   └── ComplaintsModal.js
│   │   └── complaint/
│   │       ├── ComplaintCard.js
│   │       └── ComplaintDetailModal.js
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   └── RegisterScreen.js
│   │   ├── dashboard/
│   │   │   └── DashboardScreen.js
│   │   └── complaint/
│   │       └── CreateComplaintScreen.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── context/
│   │   └── AuthContext.js
│   └── utils/
│       ├── constants.js
│       └── storage.js
```

## Building APK

### Method 1: EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Configure build
eas build:configure

# Build APK
eas build --platform android --profile preview
```

The APK will be available for download from the Expo dashboard.

### Method 2: Local Build (Requires Android Studio)

```bash
# Eject to bare workflow
expo eject

# Build APK using Gradle
cd android
./gradlew assembleRelease

# APK location: android/app/build/outputs/apk/release/app-release.apk
```

## Opening in Android Studio

1. **Eject to bare workflow** (if not already done):
   ```bash
   expo eject
   ```

2. **Open in Android Studio**:
   - File → Open
   - Navigate to `civic-complaint-mobile/android`
   - Click OK

3. **Run on Emulator**:
   - Tools → AVD Manager → Create Virtual Device
   - Select device (e.g., Pixel 5)
   - Click Run (green play button)

4. **Build APK**:
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

## Backend Compatibility

✅ **ZERO Backend Changes Required**

This mobile app uses the existing backend APIs:

- `POST /auth/citizen/login` - Login
- `POST /auth/register` - Registration
- `GET /citizen/complaints` - List complaints (with status filter)
- `GET /api/complaints/{id}` - Complaint details
- `POST /citizen/complaints/create` - Create complaint (multipart)
- `GET /api/complaints/attachments/{id}` - Fetch images

All DTOs, authentication, and endpoints remain unchanged.

## Permissions

The app requests the following Android permissions:

- **Location** - For complaint location tagging
- **Camera** - For taking photos
- **Storage** - For selecting photos from gallery

These are configured in `app.json` and requested at runtime.

## Troubleshooting

### Cannot connect to backend

- **Android Emulator**: Use `http://10.0.2.2:8080`
- **Physical Device**: Use your computer's IP address (e.g., `http://192.168.1.100:8080`)
- Ensure backend is running and accessible

### Map not showing

- Ensure location permissions are granted
- Check internet connection (maps require tiles to load)

### Images not uploading

- Check storage permissions
- Verify multipart form-data format matches backend expectations

## Development Tips

- Use `npm start` and Expo Go for fastest development
- Hot reload is enabled by default
- Check console logs in terminal for debugging
- Use React DevTools for component inspection

## License

This project is part of the Civic Complaint Management System.
