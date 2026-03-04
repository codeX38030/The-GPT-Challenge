# farmphile AI

A 100% offline farm and agricultural machinery assistant mobile app built with Expo React Native.

## Architecture

- **Frontend**: Expo Router (React Native), served on port 8081
- **Backend**: Express.js server on port 5000 (minimal — app is fully offline-first)
- **AI Engine**: On-device rule-based inference (AnyWhere SDK integration point)
- **Storage**: AsyncStorage for diagnosis history and settings

## Key Features

1. **Crop & Soil Analysis** — Camera/gallery photo capture with on-device AI diagnosis
2. **Machinery Sound Diagnosis** — Audio recording with on-device classification
3. **Offline Knowledge Base** — 20+ embedded agricultural entries (crop diseases, soil issues, machinery, irrigation)
4. **Multi-language Support** — English, Hindi, Marathi, Tamil, Telugu, Punjabi
5. **Dark/Light Mode** — Full theme support
6. **Liquid Glass Tab Bar** — iOS 26+ native tabs with liquid glass effect
7. **Privacy-first** — No internet required, no data leaves device

## Project Structure

```
app/
  _layout.tsx          # Root layout with Nunito font, AppProvider
  (tabs)/
    _layout.tsx        # 4-tab nav (Home, Crop, Sound, Knowledge)
    index.tsx          # Home dashboard
    crop.tsx           # Crop/soil photo analysis
    sound.tsx          # Machinery sound diagnosis
    knowledge.tsx      # Offline knowledge base with search
  settings.tsx         # Settings with language picker
  result/[id].tsx      # Diagnosis result detail screen

constants/
  colors.ts            # Green/earth theme palette
  translations.ts      # 6 languages (EN, HI, MR, TA, TE, PA)
  knowledgeBase.ts     # Embedded agricultural knowledge + AI inference engine

context/
  AppContext.tsx        # Language, diagnosis history state

android/               # Android Studio compatible gradle files
  build.gradle
  settings.gradle
  app/build.gradle     # Full dependency list incl. TFLite + AnyWhere SDK
  app/src/main/AndroidManifest.xml
  app/proguard-rules.pro
```

## AI Engine

The app uses a rule-based on-device inference engine in `constants/knowledgeBase.ts`. In production:
- Integrate AnyWhere SDK from `https://github.com/RunanywhereAI/runanywhere-sdks`
- Add TFLite models in `android/app/src/main/assets/models/`
- Call `diagnoseCropImage()` and `diagnoseMachinerySound()` — these are the inference hooks

## Android Studio Setup

See `ANDROID_STUDIO_SETUP.md` for complete instructions on running in Android Studio.

## Theme

- Primary: Forest green (#1a7a3c)
- Accent: Golden amber (#f5a623)
- Font: Nunito (Google Fonts)
- Background: Light sage / Dark forest

## Dependencies (Key)

- expo-av: Audio recording
- expo-image-picker: Camera/gallery access
- expo-linear-gradient: Gradient UI
- expo-haptics: Haptic feedback
- @expo-google-fonts/nunito: Typography
- react-native-reanimated: Animations
