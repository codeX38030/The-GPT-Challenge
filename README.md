# 🌿 farmphile AI — Offline Agricultural Assistant

<p align="center">
  <img src="./assets/icon.png" alt="farmphile AI Logo" width="120" height="120" style="border-radius: 20px" />
</p>

<p align="center">
  <strong>100% Offline · AI-Powered · Android & iOS · 6 Regional Languages</strong>
</p>

<p align="center">
  <img alt="Platform" src="https://img.shields.io/badge/Platform-Android%20%7C%20iOS-brightgreen" />
  <img alt="Offline" src="https://img.shields.io/badge/Network-100%25%20Offline-blue" />
  <img alt="Languages" src="https://img.shields.io/badge/Languages-EN%20%7C%20HI%20%7C%20MR%20%7C%20TA%20%7C%20TE%20%7C%20PA-orange" />
  <img alt="AI" src="https://img.shields.io/badge/AI%20Engine-AnyWhere%20SDK-purple" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

## Overview

**farmphile AI** is a hackathon submission that puts the power of AI directly in the hands of Indian farmers — no internet required, ever. Built with [Expo React Native](https://expo.dev/) and powered by the [AnyWhere SDK](https://github.com/RunanywhereAI/runanywhere-sdks) for fully on-device neural network inference, farmphile AI runs on any Android or iOS smartphone.

Farmers can photograph their crops, record machinery sounds, and access a curated knowledge base — all without a single byte of data leaving the device.

**Downloadable APK ->** [Click Here](https://expo.dev/accounts/manishdebnath16/projects/farmaphileai/builds/b09f0298-11b7-4143-8e18-52bfb4fb7374)

**Interface of APK**

<img width="260" height="540" alt="Landing page" src="https://github.com/user-attachments/assets/2afb27dd-49de-40f9-b775-68fe000fad61" />
<img width="260" height="540" alt="Crop Detection Screen" src="https://github.com/user-attachments/assets/c396a0a1-7b00-4f60-b445-a1e182843111" />
<img width="260" height="540" alt="Machinery Sound Analysis" src="https://github.com/user-attachments/assets/cb261fec-26f5-4f78-beb7-37c7f14aead5" />
<img width="260" height="540" alt="Database" src="https://github.com/user-attachments/assets/eed65451-3c3d-4fab-8409-fb4902e26622" />
<img width="260" height="540" alt="Settings interface" src="https://github.com/user-attachments/assets/507cb17b-f490-4253-9739-31602eca8aca" />

---

## Features

### Crop Disease Analysis
- Capture or select an image from the camera roll
- On-device image classification using AnyWhere SDK + TFLite
- Returns: disease name, confidence score, symptoms, causes, step-by-step treatment, prevention tips
- **Healthy crop detection** — correctly identifies healthy crops and returns a "No Disease Detected" result (no false positives)

### Machinery Sound Diagnosis
- Record up to 10 seconds of machinery audio
- On-device MFCC extraction + audio classification
- Detects: engine knock, bearing noise, exhaust issues, overheating, hydraulic failure, thresher blockage
- Auto-stops and diagnoses after 10 seconds

### Knowledge Base
- 20+ offline entries covering:
  - Crop diseases (Leaf Blast, Powdery Mildew, Early Blight, Aphids, Stem Borer, Downy Mildew, Whitefly)
  - Soil problems (Salinity, Compaction, Iron Deficiency, Acidity, Phosphorus Deficiency)
  - Machinery issues (Engine Knock, Overheating, Hydraulic Failure, Thresher Blockage)
  - Irrigation problems (Drip Clogging, Waterlogging, Sprinkler Malfunction, Canal Seepage)
- Full-text search, category filtering, severity badges

### Diagnosis History
- Last 50 diagnoses stored locally with AsyncStorage
- Tap any entry to revisit full report
- Delete individual entries or clear all

### Multi-Language Support
| Language | Code | Native Name |
|----------|------|-------------|
| English | `en` | English |
| Hindi | `hi` | हिंदी |
| Marathi | `mr` | मराठी |
| Tamil | `ta` | தமிழ் |
| Telugu | `te` | తెలుగు |
| Punjabi | `pa` | ਪੰਜਾਬੀ |

### Theme Control
- Light / Dark / System (follows device)
- Instant toggle — works on both **Android and iOS**
- Persisted across app restarts

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo SDK 54 + React Native |
| Routing | Expo Router (file-based) |
| AI Engine | [AnyWhere SDK](https://github.com/RunanywhereAI/runanywhere-sdks) |
| On-device ML | TensorFlow Lite (Android), CoreML (iOS) |
| State | React Context + AsyncStorage |
| Animations | React Native Reanimated 3 |
| Fonts | Nunito (Google Fonts) |
| Icons | @expo/vector-icons (Ionicons) |
| Audio | expo-av (MFCC pipeline) |
| Camera | expo-image-picker |

---

## AI Engine — AnyWhere SDK

> GitHub: [https://github.com/RunanywhereAI/runanywhere-sdks](https://github.com/RunanywhereAI/runanywhere-sdks)

farmphile AI uses the **AnyWhere SDK** by RunanywhereAI to perform all neural network inference directly on the device. This enables:

- **Zero-latency inference** — no round-trip to cloud servers
- **Privacy-first** — images and audio never leave the device
- **Works in remote areas** — no cell data or WiFi needed
- **INT8 quantized models** — fast on low-end Android devices (1 GB RAM compatible)

### Integration Points

```typescript
// Crop Disease — image classification
// constants/knowledgeBase.ts → diagnoseCropImage()
const sdk = new AnyWhereSDK({ modelPath: 'crop_disease_v2.tflite' });
const result = await sdk.classifyImage(imageUri);
const knowledge = mapResultToKnowledge(result.label);

// Sound Diagnosis — audio classification
// constants/knowledgeBase.ts → diagnoseMachinerySound()
const mfcc = extractMFCC(audioBuffer, { sampleRate: 16000, numCoeffs: 40 });
const sdk = new AnyWhereSDK({ modelPath: 'machinery_sound_v1.tflite' });
const result = await sdk.classify(mfcc);
```

---

## Project Structure

```
farmphile-ai/
├── app/
│   ├── _layout.tsx              # Root layout with providers
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab bar layout
│   │   ├── index.tsx            # Home (history + stats)
│   │   ├── crop.tsx             # Crop analysis screen
│   │   ├── sound.tsx            # Sound diagnosis screen
│   │   └── knowledge.tsx        # Knowledge base browser
│   ├── settings.tsx             # Settings (theme, language, privacy)
│   └── result/[id].tsx          # Diagnosis result detail
├── context/
│   └── AppContext.tsx           # Theme, language, diagnosis history
├── constants/
│   ├── knowledgeBase.ts         # 20+ offline entries + AI inference hooks
│   ├── translations.ts          # 6-language translations
│   └── colors.ts                # Light/dark color palette
├── components/
│   └── ErrorBoundary.tsx        # Crash recovery
├── android/
│   ├── build.gradle             # Root Gradle — AnyWhere SDK + TFLite
│   ├── app/
│   │   ├── build.gradle         # App Gradle — dependencies, proguard
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml   # NO internet permission
│   │   │   └── res/xml/
│   │   │       └── network_security_config.xml  # Blocks all traffic
│   │   └── proguard-rules.pro
│   └── gradle/
│       └── wrapper/
│           └── gradle-wrapper.properties
└── README.md
```

---

## Android Build

### Gradle Configuration

The project includes complete Android Studio-compatible Gradle files. Models are loaded from `android/app/src/main/assets/models/`.

```gradle
// android/app/build.gradle — key dependencies
implementation 'org.tensorflow:tensorflow-lite:2.13.0'
implementation 'org.tensorflow:tensorflow-lite-support:0.4.4'
// AnyWhere SDK: github.com/RunanywhereAI/runanywhere-sdks
implementation 'com.runanywhere:sdk-android:1.0.0'
```

### Network Security (Fully Offline)

```xml
<!-- AndroidManifest.xml — NO internet permission granted -->
<!-- <uses-permission android:name="android.permission.INTERNET" /> -->

<!-- network_security_config.xml — blocks all network traffic -->
<network-security-config>
  <base-config cleartextTrafficPermitted="false">
    <trust-anchors />
  </base-config>
</network-security-config>
```

### Place AI Models

Copy your TFLite models to:
```
android/app/src/main/assets/models/
├── crop_disease_v2.tflite      # Crop disease classifier (INT8)
└── machinery_sound_v1.tflite  # Audio event classifier (INT8)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app on your Android/iOS device

### Run on Device

```bash
# Clone the repository
git clone https://github.com/your-username/farmphile-ai.git
cd farmphile-ai

# Install dependencies
npm install

# Start the development server
npm run expo:dev

# Scan the QR code with Expo Go
```

### Build for Production (Android)

```bash
# Build APK via Expo EAS
eas build --platform android --profile production

# Or open in Android Studio
# File → Open → android/
```

---

## Supported Crops

Rice / Paddy · Wheat · Sugarcane · Tomato · Potato · Cotton · Grapes · Cucumber · Millet · Maize · Soybean · Chilli · Peas · All vegetables

---

## Privacy & Security

| Feature | Status |
|---------|--------|
| Internet Permission | ❌ Disabled |
| Cloud Storage | ❌ None |
| Analytics SDK | ❌ None |
| Data Sharing | ❌ None |
| On-device Inference | ✅ AnyWhere SDK |
| Local Storage Only | ✅ AsyncStorage |
| Images Stay on Device | ✅ Always |

---

## Hackathon

Built for: **THE GPT CHALLENGE by Guru Gobind Singh Indraprastha University (GGSIPU), Delhi**  
Track: Agricultural Technology / AI for Good  

**Team: CODEX**

Prakruti Parimita Rath(Team Lead)

Suraj Nath

Manish Debnath

Deep Ball

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Acknowledgements

- [AnyWhere SDK](https://github.com/RunanywhereAI/runanywhere-sdks) by RunanywhereAI — on-device ML inference
- [Expo](https://expo.dev/) — React Native framework
- [TensorFlow Lite](https://tensorflow.org/lite) — Mobile ML runtime
- [ICAR](https://icar.gov.in/) — Agricultural disease reference data
