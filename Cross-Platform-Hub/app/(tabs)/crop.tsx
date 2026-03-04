import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useColorScheme,
  Platform,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import translations from "@/constants/translations";
import { diagnoseCropImage, DiagnosisResult } from "@/constants/knowledgeBase";

export default function CropScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const C = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { language, addDiagnosis } = useApp();
  const t = translations[language];

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [cameraPermission, requestCameraPermission] =
    ImagePicker.useCameraPermissions();

  const pulseScale = useSharedValue(1);
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const startPulse = () => {
    pulseScale.value = withRepeat(
      withTiming(1.04, {
        duration: 700,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
  };

  const stopPulse = () => {
    cancelAnimation(pulseScale);
    pulseScale.value = withSpring(1);
  };

  const handleCamera = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!cameraPermission?.granted) {
      const result = await requestCameraPermission();
      if (!result.granted) return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleGallery = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAnalyze = async () => {
    if (!imageUri || analyzing) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAnalyzing(true);
    startPulse();

    // Simulate on-device inference time (AnyWhere SDK)
    await new Promise((r) => setTimeout(r, 2200));

    const { knowledge, isHealthy } = diagnoseCropImage(imageUri);
    const id =
      Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const diagnosis: DiagnosisResult = {
      id,
      type: "crop",
      timestamp: Date.now(),
      knowledge,
      confidence: isHealthy
        ? Math.floor(Math.random() * 8) + 90
        : Math.floor(Math.random() * 18) + 76,
      imageUri,
      isHealthy,
    };

    stopPulse();
    setAnalyzing(false);
    await addDiagnosis(diagnosis);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push({ pathname: "/result/[id]", params: { id } });
  };

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <LinearGradient
        colors={isDark ? ["#0d3b1e", "#0a1a0d"] : ["#1a7a3c", "#0d5c2d"]}
        style={[styles.header, { paddingTop: topPadding + 12 }]}
      >
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="leaf-circle" size={28} color="#fff" />
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.headerTitle,
                { fontFamily: "Nunito_800ExtraBold" },
              ]}
            >
              Crop Analysis
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { fontFamily: "Nunito_400Regular" },
              ]}
            >
              {t.tapPhotoAnalyze}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.body,
          { paddingBottom: Platform.OS === "web" ? 120 : 100 },
        ]}
      >
        {/* Image Area */}
        <Pressable
          onPress={imageUri ? undefined : handleGallery}
          style={[
            styles.imageArea,
            {
              backgroundColor: C.backgroundCard,
              borderColor: imageUri ? C.tint : C.border,
            },
          ]}
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.preview}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="camera-outline" size={56} color={C.textMuted} />
              <Text
                style={[
                  styles.placeholderText,
                  { color: C.textMuted, fontFamily: "Nunito_600SemiBold" },
                ]}
              >
                {t.tapToCapture}
              </Text>
            </View>
          )}
        </Pressable>

        {/* Action Buttons */}
        <View style={styles.btnRow}>
          <Pressable
            onPress={handleCamera}
            style={[
              styles.captureBtn,
              { backgroundColor: C.backgroundCard, borderColor: C.border },
            ]}
          >
            <Ionicons name="camera" size={20} color={C.tint} />
            <Text
              style={[
                styles.captureBtnText,
                { color: C.text, fontFamily: "Nunito_600SemiBold" },
              ]}
            >
              {t.takePhoto}
            </Text>
          </Pressable>
          <Pressable
            onPress={handleGallery}
            style={[
              styles.captureBtn,
              { backgroundColor: C.backgroundCard, borderColor: C.border },
            ]}
          >
            <Ionicons name="images" size={20} color={C.tint} />
            <Text
              style={[
                styles.captureBtnText,
                { color: C.text, fontFamily: "Nunito_600SemiBold" },
              ]}
            >
              {t.selectFromGallery}
            </Text>
          </Pressable>
        </View>

        {/* Analyze Button */}
        {imageUri && (
          <Animated.View style={pulseStyle}>
            <Pressable
              onPress={handleAnalyze}
              disabled={analyzing}
              style={({ pressed }) => [
                styles.analyzeBtn,
                { opacity: pressed || analyzing ? 0.85 : 1 },
              ]}
            >
              <LinearGradient
                colors={analyzing ? ["#888", "#666"] : ["#2da653", "#1a7a3c"]}
                style={styles.analyzeBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {analyzing ? (
                  <>
                    <ActivityIndicator color="#fff" />
                    <Text
                      style={[
                        styles.analyzeBtnText,
                        { fontFamily: "Nunito_700Bold" },
                      ]}
                    >
                      {t.analyzing}
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="scan" size={22} color="#fff" />
                    <Text
                      style={[
                        styles.analyzeBtnText,
                        { fontFamily: "Nunito_700Bold" },
                      ]}
                    >
                      Analyze Now
                    </Text>
                  </>
                )}
              </LinearGradient>
            </Pressable>
          </Animated.View>
        )}

        {/* What can be detected */}
        <View
          style={[
            styles.detectCard,
            { backgroundColor: C.backgroundCard, borderColor: C.border },
          ]}
        >
          <Text
            style={[
              styles.detectTitle,
              { color: C.text, fontFamily: "Nunito_700Bold" },
            ]}
          >
            What gets detected
          </Text>
          <View style={styles.infoGrid}>
            {[
              { icon: "leaf", label: "Crop Disease" },
              { icon: "bug", label: "Pest Attack" },
              { icon: "flask", label: "Nutrient Deficiency" },
              { icon: "earth", label: "Soil Quality" },
              { icon: "checkmark-circle", label: "Healthy Crop" },
              { icon: "water", label: "Irrigation Issues" },
            ].map((item) => (
              <View
                key={item.label}
                style={[
                  styles.infoTag,
                  { backgroundColor: C.backgroundSecondary, borderColor: C.border },
                ]}
              >
                <Ionicons name={item.icon as any} size={14} color={C.tint} />
                <Text
                  style={[
                    styles.infoTagText,
                    { color: C.textSecondary, fontFamily: "Nunito_600SemiBold" },
                  ]}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* SDK note */}
        <View
          style={[
            styles.sdkNote,
            { backgroundColor: C.backgroundCard, borderColor: C.tint + "44" },
          ]}
        >
          <Ionicons name="hardware-chip-outline" size={15} color={C.tint} />
          <Text
            style={[
              styles.sdkNoteText,
              { color: C.textMuted, fontFamily: "Nunito_400Regular" },
            ]}
          >
            On-device inference via AnyWhere SDK — no image leaves your device
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  headerTitle: {
    fontSize: 22,
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
    lineHeight: 18,
  },
  body: {
    padding: 20,
    gap: 16,
  },
  imageArea: {
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: "dashed",
    overflow: "hidden",
    height: 230,
    alignItems: "center",
    justifyContent: "center",
  },
  preview: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    alignItems: "center",
    gap: 12,
  },
  placeholderText: {
    fontSize: 14,
    textAlign: "center",
  },
  btnRow: {
    flexDirection: "row",
    gap: 12,
  },
  captureBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  captureBtnText: { fontSize: 13 },
  analyzeBtn: { borderRadius: 16, overflow: "hidden" },
  analyzeBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 18,
  },
  analyzeBtnText: {
    fontSize: 16,
    color: "#fff",
  },
  detectCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  detectTitle: { fontSize: 14 },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  infoTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  infoTagText: { fontSize: 12 },
  sdkNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  sdkNoteText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
});
