# Android Studio Setup Guide

## Prerequisites

1. **Android Studio** - [Download Latest Version](https://developer.android.com/studio)
2. **Node.js 16+** - Already installed
3. **JDK 11 or higher** - Comes with Android Studio

## Step 1: Install Dependencies

```bash
cd C:\Users\KabirBagalkot\.gemini\antigravity\scratch\civic-complaint-mobile
npm install
```

## Step 2: Install React Native CLI

```bash
npm install -g react-native-cli
```

## Step 3: Prebuild for Android (Expo)

Expo provides a way to generate native Android project without full ejection:

```bash
npx expo prebuild --platform android
```

This will create an `android/` folder with all necessary Android Studio files.

## Step 4: Open in Android Studio

1. **Launch Android Studio**
2. **Open Project**:
   - File → Open
   - Navigate to: `C:\Users\KabirBagalkot\.gemini\antigravity\scratch\civic-complaint-mobile\android`
   - Click OK

3. **Wait for Gradle Sync**:
   - Android Studio will automatically sync Gradle
   - This may take 5-10 minutes on first run
   - You'll see progress in the bottom status bar

## Step 5: Configure Android SDK

1. **Open SDK Manager**:
   - Tools → SDK Manager (or click SDK Manager icon in toolbar)

2. **Install Required Components**:
   - ✅ Android SDK Platform 33 (or latest)
   - ✅ Android SDK Build-Tools 33.0.0
   - ✅ Android SDK Platform-Tools
   - ✅ Android Emulator
   - ✅ Intel x86 Emulator Accelerator (HAXM) - for Intel processors

3. **Click Apply** to install

## Step 6: Create Android Virtual Device (AVD)

1. **Open AVD Manager**:
   - Tools → Device Manager (or AVD Manager icon)

2. **Create Virtual Device**:
   - Click "Create Device"
   - Select: **Pixel 5** (recommended)
   - Click Next

3. **Select System Image**:
   - Choose: **API Level 33 (Android 13)** or latest
   - Click Download if not installed
   - Click Next

4. **Verify Configuration**:
   - AVD Name: Pixel_5_API_33
   - Click Finish

## Step 7: Configure Backend URL

Edit `src/utils/constants.js`:

```javascript
// For Android Emulator
export const API_BASE_URL = 'http://10.0.2.2:8080';
```

**Note**: `10.0.2.2` is a special IP that maps to `localhost` on your host machine when using Android Emulator.

## Step 8: Start Metro Bundler

Open a terminal in the project root:

```bash
npx react-native start
```

Keep this terminal running.

## Step 9: Run App in Android Studio

### Method A: Using Run Button

1. **Select Device**: 
   - Top toolbar → Select "Pixel_5_API_33" from device dropdown

2. **Click Run** (Green Play button)
   - App will build and install on emulator
   - First build takes 5-10 minutes

### Method B: Using Terminal

```bash
# In a new terminal (keep Metro running in another)
npx react-native run-android
```

## Step 10: Build APK

### Debug APK (for testing)

1. **Using Android Studio**:
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - Wait for build to complete
   - Click "locate" in notification to find APK

2. **APK Location**:
   ```
   android\app\build\outputs\apk\debug\app-debug.apk
   ```

### Release APK (for distribution)

1. **Generate Signing Key** (first time only):
   ```bash
   cd android\app
   keytool -genkeypair -v -storetype PKCS12 -keystore civic-complaints.keystore -alias civic-complaints -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure Signing** in `android/app/build.gradle`:
   ```gradle
   android {
       ...
       signingConfigs {
           release {
               storeFile file('civic-complaints.keystore')
               storePassword 'your-password'
               keyAlias 'civic-complaints'
               keyPassword 'your-password'
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
               ...
           }
       }
   }
   ```

3. **Build Release APK**:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

4. **APK Location**:
   ```
   android\app\build\outputs\apk\release\app-release.apk
   ```

## Troubleshooting

### Gradle Sync Failed

**Solution**:
```bash
cd android
./gradlew clean
./gradlew build
```

### Metro Bundler Connection Failed

**Solution**:
1. Stop Metro: `Ctrl+C` in Metro terminal
2. Clear cache: `npx react-native start --reset-cache`

### App Crashes on Launch

**Solution**:
1. Check Metro bundler is running
2. Rebuild app: Build → Clean Project → Rebuild Project
3. Check logs in Android Studio Logcat

### Cannot Connect to Backend

**Solution**:
1. Ensure backend is running on `http://localhost:8080`
2. Verify `API_BASE_URL` is set to `http://10.0.2.2:8080`
3. Check Windows Firewall allows port 8080

### Build Failed - SDK Not Found

**Solution**:
1. Set ANDROID_HOME environment variable:
   ```
   ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
   ```
2. Add to PATH:
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\tools
   ```

## Useful Commands

```bash
# Start Metro bundler
npx react-native start

# Run on Android
npx react-native run-android

# Clean build
cd android && ./gradlew clean

# Build debug APK
cd android && ./gradlew assembleDebug

# Build release APK
cd android && ./gradlew assembleRelease

# View logs
npx react-native log-android
```

## Android Studio Shortcuts

- **Run App**: `Shift + F10`
- **Build APK**: `Ctrl + F9`
- **Clean Project**: `Build → Clean Project`
- **Rebuild Project**: `Build → Rebuild Project`
- **Open Logcat**: `Alt + 6`

## Next Steps

1. ✅ Run app in emulator
2. ✅ Test all features (login, create complaint, view dashboard)
3. ✅ Build debug APK for testing
4. ✅ Build release APK for distribution
5. ✅ Test on physical device

## Testing on Physical Device

1. **Enable Developer Options** on Android phone:
   - Settings → About Phone → Tap "Build Number" 7 times

2. **Enable USB Debugging**:
   - Settings → Developer Options → USB Debugging

3. **Connect Phone** via USB

4. **Run App**:
   ```bash
   npx react-native run-android
   ```

5. **Update Backend URL** in `constants.js`:
   ```javascript
   // Use your computer's IP address
   export const API_BASE_URL = 'http://192.168.1.100:8080';
   ```

## Support

- **React Native Docs**: https://reactnative.dev/docs/environment-setup
- **Android Studio Docs**: https://developer.android.com/studio/intro
- **Expo Prebuild**: https://docs.expo.dev/workflow/prebuild/
