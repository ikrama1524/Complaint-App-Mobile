@echo off
echo ========================================
echo Civic Complaint Mobile - Android Setup
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] Installing npm dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)
echo.

echo [2/5] Generating Android project files...
call npx expo prebuild --platform android --clean
if %errorlevel% neq 0 (
    echo ERROR: expo prebuild failed
    pause
    exit /b 1
)
echo.

echo [3/5] Setup complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Open Android Studio
echo 2. File -^> Open -^> Select: %cd%\android
echo 3. Wait for Gradle sync
echo 4. Create emulator: Tools -^> Device Manager -^> Create Device
echo 5. Run Metro bundler in a new terminal:
echo    npx react-native start
echo 6. Run app:
echo    npx react-native run-android
echo.
echo OR click the green Run button in Android Studio
echo.
echo ========================================
echo Important Notes:
echo ========================================
echo.
echo - Backend URL is configured for emulator: http://10.0.2.2:8080
echo - Make sure backend is running on port 8080
echo - First build takes 5-10 minutes
echo.
echo For detailed instructions, see:
echo - QUICKSTART_ANDROID_STUDIO.md
echo - ANDROID_STUDIO_GUIDE.md
echo.
pause
