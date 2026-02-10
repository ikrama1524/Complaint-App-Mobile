# Quick Start - Android Studio

## Fastest Way to Run in Android Studio

### Step 1: Generate Android Project

```bash
cd C:\Users\KabirBagalkot\.gemini\antigravity\scratch\civic-complaint-mobile
npm install
npx expo prebuild --platform android
```

This creates the `android/` folder needed for Android Studio.

### Step 2: Open in Android Studio

1. Open Android Studio
2. File → Open → Select `civic-complaint-mobile\android` folder
3. Wait for Gradle sync (5-10 min)

### Step 3: Create Emulator

1. Tools → Device Manager
2. Create Device → Pixel 5 → API 33
3. Finish

### Step 4: Run App

**Terminal 1** (Metro Bundler):
```bash
npx react-native start
```

**Terminal 2** (Build & Run):
```bash
npx react-native run-android
```

OR click the green **Run** button in Android Studio.

### Step 5: Build APK

```bash
cd android
./gradlew assembleDebug
```

APK location: `android\app\build\outputs\apk\debug\app-debug.apk`

## Important Notes

✅ **Backend URL**: Already configured to `http://10.0.2.2:8080` for emulator

✅ **API Endpoints**: All verified and correct

✅ **First build**: Takes 5-10 minutes

✅ **Subsequent builds**: Much faster (~1-2 min)

## Troubleshooting

**"Metro bundler not found"**:
```bash
npx react-native start --reset-cache
```

**"Build failed"**:
```bash
cd android
./gradlew clean
./gradlew build
```

**"Cannot connect to backend"**:
- Ensure backend is running on port 8080
- Check firewall settings

## Done!

Your app should now be running in the Android emulator. Test login, create complaint, and view dashboard.
