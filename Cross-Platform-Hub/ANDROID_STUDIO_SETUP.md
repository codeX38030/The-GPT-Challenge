# farmphile AI — Android Studio Setup Guide

## Prerequisites

- Android Studio Ladybug (2024.2) or newer
- JDK 17
- Android SDK 35 (API Level 35)
- NDK 26.1.10909125

## Steps to Open in Android Studio

### Option A: Use Expo Prebuild (Recommended)

This generates the full native Android project from the Expo app.

1. Install Expo CLI: `npm install -g expo-cli`
2. In the project root, run: `npx expo prebuild --platform android`
3. This creates/updates the `android/` folder with all native code
4. Open Android Studio → `File → Open` → select the `android/` folder
5. Let Gradle sync complete
6. Connect device or start emulator
7. Click the **Run** button

### Option B: Zip the Project and Import

1. Zip the entire project folder
2. Extract on your development machine
3. Run `npm install` in the extracted folder
4. Run `npx expo prebuild --platform android`
5. Open `android/` folder in Android Studio

## Gradle Files Included

```
android/
├── build.gradle          # Project-level dependencies (Hilt, Kotlin, etc.)
├── settings.gradle       # Project name, repository config
└── app/
    ├── build.gradle      # App-level dependencies
    │   ├── TensorFlow Lite (crop disease + sound models)
    │   ├── AnyWhere SDK (placeholder — add when SDK is published)
    │   ├── Room Database (offline knowledge base)
    │   ├── Hilt (dependency injection)
    │   ├── CameraX
    │   └── Jetpack Compose (Material 3)
    ├── proguard-rules.pro # Keeps TFLite + AnyWhere SDK classes
    └── src/main/
        ├── AndroidManifest.xml  # NO internet permission
        └── res/xml/
            └── network_security_config.xml  # Blocks all network
```

## Adding AnyWhere SDK

1. Clone the SDK: `git clone https://github.com/RunanywhereAI/runanywhere-sdks`
2. Follow the SDK's integration instructions
3. In `android/app/build.gradle`, uncomment:
   ```groovy
   implementation 'com.runanywhere:sdk:latest'
   ```
   Or add as local `.aar`:
   ```groovy
   implementation files('libs/runanywhere-sdk.aar')
   ```

## Adding TFLite Models

Place models in `android/app/src/main/assets/models/`:

| File | Purpose | Target Size |
|------|---------|-------------|
| `crop_disease_model.tflite` | Leaf disease, pest, nutrient deficiency | <10MB |
| `soil_analysis_model.tflite` | Soil quality classification | <8MB |
| `machinery_sound_model.tflite` | Engine/machinery sound classification | <5MB |

All models should be INT8 quantized for best performance on low-end devices.

## Privacy Architecture

The app is designed with zero network access:
- **No INTERNET permission** in AndroidManifest.xml
- **Network Security Config** blocks all cleartext and HTTPS traffic
- **No analytics SDK** (Firebase disabled)
- All data processed on-device using TFLite + AnyWhere SDK
- Diagnosis history stored only in local Room database / AsyncStorage

## App Size Budget

| Component | Target Size |
|-----------|-------------|
| Base APK | ~15MB |
| TFLite models | ~25MB |
| Knowledge base | <1MB |
| **Total** | **<50MB** |

Use Android App Bundle (`.aab`) for Play Store — enables model delivery on-demand.

## Supported Devices

- Android 7.0 (API 24) and above
- Minimum 3GB RAM recommended
- Camera with autofocus (optional)
- Microphone (optional for sound diagnosis)

## Testing Offline Mode

1. Enable airplane mode on test device
2. Open farmphile AI
3. All features must work without any network
4. No error messages about network connectivity
