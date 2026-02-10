# Mobile App Setup Instructions

## Quick Start Guide

### Prerequisites
1. **Node.js 16+** - [Download](https://nodejs.org/)
2. **Expo CLI** - Install globally:
   ```bash
   npm install -g expo-cli
   ```
3. **Android Studio** (Optional, for emulator) - [Download](https://developer.android.com/studio)
4. **Expo Go App** (For testing on physical device) - Install from Play Store

### Step 1: Install Dependencies

```bash
cd civic-complaint-mobile
npm install
```

### Step 2: Configure Backend URL

Open `src/utils/constants.js` and set your backend URL:

```javascript
// For Android Emulator (default)
export const API_BASE_URL = 'http://10.0.2.2:8080';

// For Physical Device (replace with your computer's IP)
// Find your IP: ipconfig (Windows) or ifconfig (Mac/Linux)
// export const API_BASE_URL = 'http://192.168.1.100:8080';
```

### Step 3: Start the App

#### Method A: Expo Go (Fastest - Recommended)

```bash
npm start
```

This will open Expo DevTools in your browser. Then:

**On Physical Device:**
1. Install "Expo Go" from Play Store
2. Scan the QR code shown in terminal/browser
3. App will load on your device

**On Android Emulator:**
1. Start Android emulator from Android Studio
2. Press `a` in the terminal to open app in emulator

#### Method B: Development Build

```bash
npm run android
```

This builds and installs the app on connected device/emulator.

### Step 4: Test the App

1. **Register** a new citizen account
2. **Login** with credentials
3. **View Dashboard** - See complaint statistics
4. **Create Complaint** - Add title, description, location, images
5. **View Complaints** - Click tiles to filter by status

## Building APK for Distribution

### Option 1: EAS Build (Cloud Build - Easiest)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo (create free account if needed)
eas login

# Configure build
eas build:configure

# Build APK
eas build --platform android --profile preview
```

APK will be available for download from Expo dashboard (~5-10 minutes).

### Option 2: Local Build (Requires Android Studio)

```bash
# Eject from managed workflow
expo eject

# Navigate to android folder
cd android

# Build release APK
./gradlew assembleRelease

# APK location:
# android/app/build/outputs/apk/release/app-release.apk
```

## Opening in Android Studio

1. **Eject first** (if not done):
   ```bash
   expo eject
   ```

2. **Open Android Studio**
   - File → Open
   - Select `civic-complaint-mobile/android` folder
   - Wait for Gradle sync

3. **Run on Emulator**
   - Tools → AVD Manager
   - Create Virtual Device (Pixel 5 recommended)
   - Click Run (green play button)

4. **Build APK**
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - APK: `android/app/build/outputs/apk/debug/app-debug.apk`

## Troubleshooting

### "Cannot connect to backend"

**Android Emulator:**
- Use `http://10.0.2.2:8080` (this maps to localhost on host machine)
- Ensure backend is running on port 8080

**Physical Device:**
- Use your computer's IP address (e.g., `http://192.168.1.100:8080`)
- Ensure device and computer are on same WiFi network
- Check firewall settings

**Find your IP:**
- Windows: `ipconfig` → Look for IPv4 Address
- Mac/Linux: `ifconfig` → Look for inet address

### "Expo Go not loading"

- Ensure phone and computer are on same network
- Try restarting Expo server: `npm start --clear`
- Check if port 19000 is blocked by firewall

### "Map not showing"

- Grant location permissions when prompted
- Check internet connection (maps need to download tiles)
- Verify Google Play Services is installed (for Android)

### "Images not uploading"

- Grant storage/camera permissions
- Check image size (large images may timeout)
- Verify backend multipart endpoint is working

### "Build failed"

- Clear cache: `npm start --clear`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Expo SDK compatibility

## Testing Checklist

- [ ] Login with existing citizen account
- [ ] Register new citizen account
- [ ] View dashboard statistics
- [ ] Click each tile to filter complaints
- [ ] Create new complaint with:
  - [ ] Title and description
  - [ ] Location (GPS)
  - [ ] Complaint type
  - [ ] Image attachments (1-3)
- [ ] View complaint details (read-only)
- [ ] Pull to refresh dashboard
- [ ] Logout and login again

## Important Notes

✅ **Backend Compatibility**: This app uses existing backend APIs - NO changes required

✅ **Permissions**: App requests Location, Camera, and Storage permissions at runtime

✅ **Offline**: App requires internet connection to function

✅ **Security**: JWT tokens are stored in encrypted SecureStore

## Next Steps

1. Test on multiple devices
2. Customize app icon and splash screen (in `assets/` folder)
3. Configure app signing for Play Store release
4. Submit to Google Play Store (optional)

## Support

For issues or questions:
- Check README.md for detailed documentation
- Review mobile_app_plan.md for architecture details
- Check Expo documentation: https://docs.expo.dev/
