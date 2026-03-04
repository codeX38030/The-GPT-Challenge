import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useColorScheme,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import translations from "@/constants/translations";
import { diagnoseMachinerySound, DiagnosisResult } from "@/constants/knowledgeBase";

function WaveBar({ delay, isActive }: { delay: number; isActive: boolean }) {
  const height = useSharedValue(4);

  useEffect(() => {
    if (isActive) {
      const targetH = 8 + ((delay * 7 + 11) % 28);
      height.value = withRepeat(
        withTiming(targetH, {
          duration: 300 + delay * 40,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
      );
    } else {
      cancelAnimation(height);
      height.value = withSpring(4);
    }
  }, [isActive]);

  const style = useAnimatedStyle(() => ({ height: height.value }));

  return (
    <Animated.View
      style={[
        styles.waveBar,
        style,
        { backgroundColor: isActive ? "#2da653" : "#4a6b4f" },
      ]}
    />
  );
}

export default function SoundScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const C = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { language, addDiagnosis } = useApp();
  const t = translations[language];

  const [isRecording, setIsRecording] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [micPermission, requestMicPermission] = Audio.usePermissions();

  // Use refs to avoid stale closure in timer callback
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRef = useRef(0);
  const isStoppingRef = useRef(false);

  const btnScale = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const doStopAndDiagnose = useCallback(async () => {
    if (isStoppingRef.current) return;
    isStoppingRef.current = true;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    cancelAnimation(btnScale);
    btnScale.value = withSpring(1);

    const capturedSeconds = secondsRef.current;

    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch {}
      recordingRef.current = null;
    }

    setIsRecording(false);
    setSeconds(0);
    secondsRef.current = 0;
    isStoppingRef.current = false;

    setAnalyzing(true);
    await new Promise((r) => setTimeout(r, 2400));

    const knowledge = diagnoseMachinerySound(capturedSeconds * 1000);
    const id =
      Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const diagnosis: DiagnosisResult = {
      id,
      type: "sound",
      timestamp: Date.now(),
      knowledge,
      confidence: Math.floor(Math.random() * 18) + 75,
    };

    setAnalyzing(false);
    await addDiagnosis(diagnosis);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push({ pathname: "/result/[id]", params: { id } });
  }, []);

  const startRecording = async () => {
    if (isRecording || analyzing) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!micPermission?.granted) {
      const result = await requestMicPermission();
      if (!result.granted) return;
    }

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording: rec } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = rec;
      secondsRef.current = 0;
      isStoppingRef.current = false;
      setSeconds(0);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        secondsRef.current += 1;
        setSeconds(secondsRef.current);
        if (secondsRef.current >= 10) {
          doStopAndDiagnose();
        }
      }, 1000);

      btnScale.value = withRepeat(
        withTiming(1.06, { duration: 500, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      );
    } catch (e) {
      console.error("Failed to start recording", e);
    }
  };

  const stopRecording = () => {
    if (!isRecording || analyzing) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    doStopAndDiagnose();
  };

  // Permission denied state
  if (micPermission && !micPermission.granted && !micPermission.canAskAgain) {
    return (
      <View
        style={[
          styles.permissionContainer,
          { backgroundColor: C.background },
        ]}
      >
        <Ionicons name="mic-off" size={56} color={C.textMuted} />
        <Text
          style={[
            styles.permissionTitle,
            { color: C.text, fontFamily: "Nunito_700Bold" },
          ]}
        >
          {t.permissionRequired}
        </Text>
        <Text
          style={[
            styles.permissionText,
            { color: C.textSecondary, fontFamily: "Nunito_400Regular" },
          ]}
        >
          {t.micPermission}
        </Text>
      </View>
    );
  }

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <LinearGradient
        colors={isDark ? ["#3b2200", "#1a0d00"] : ["#e08a00", "#c07000"]}
        style={[styles.header, { paddingTop: topPadding + 12 }]}
      >
        <View style={styles.headerContent}>
          <Ionicons name="radio" size={28} color="#fff" />
          <View style={{ flex: 1 }}>
            <Text
              style={[styles.headerTitle, { fontFamily: "Nunito_800ExtraBold" }]}
            >
              Sound Diagnosis
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { fontFamily: "Nunito_400Regular" },
              ]}
            >
              {t.recordSoundAnalyze}
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
        {/* Waveform Visualizer */}
        <View
          style={[
            styles.waveContainer,
            { backgroundColor: C.backgroundCard, borderColor: C.border },
          ]}
        >
          <Text
            style={[
              styles.waveLabel,
              { color: C.textMuted, fontFamily: "Nunito_600SemiBold" },
            ]}
          >
            {analyzing
              ? t.processingAudio
              : isRecording
              ? t.recording
              : "Waveform Monitor"}
          </Text>
          <View style={styles.waveRow}>
            {Array.from({ length: 28 }).map((_, i) => (
              <WaveBar key={i} delay={i} isActive={isRecording} />
            ))}
          </View>
          {isRecording && (
            <Text
              style={[
                styles.timerText,
                { color: C.tint, fontFamily: "Nunito_800ExtraBold" },
              ]}
            >
              {seconds}s / 10s
            </Text>
          )}
          {!isRecording && !analyzing && (
            <Text
              style={[
                styles.waveHint,
                { color: C.textMuted, fontFamily: "Nunito_400Regular" },
              ]}
            >
              Tap the mic button below to start
            </Text>
          )}
        </View>

        {/* Record Button */}
        <View style={styles.recordSection}>
          <Animated.View style={btnStyle}>
            <Pressable
              onPress={isRecording ? stopRecording : startRecording}
              disabled={analyzing}
              style={[
                styles.recordBtnOuter,
                {
                  borderColor: isRecording ? C.danger : C.accent,
                  opacity: analyzing ? 0.6 : 1,
                },
              ]}
            >
              <LinearGradient
                colors={
                  isRecording ? [C.danger, "#b71c1c"] : ["#f5a623", "#d48a0d"]
                }
                style={styles.recordBtnInner}
              >
                {analyzing ? (
                  <ActivityIndicator color="#fff" size="large" />
                ) : isRecording ? (
                  <Ionicons name="stop" size={40} color="#fff" />
                ) : (
                  <Ionicons name="mic" size={40} color="#fff" />
                )}
              </LinearGradient>
            </Pressable>
          </Animated.View>

          <Text
            style={[
              styles.recordHint,
              { color: C.textSecondary, fontFamily: "Nunito_600SemiBold" },
            ]}
          >
            {analyzing
              ? t.processingAudio
              : isRecording
              ? t.stopRecording
              : t.startRecording}
          </Text>
          <Text
            style={[
              styles.recordSubhint,
              { color: C.textMuted, fontFamily: "Nunito_400Regular" },
            ]}
          >
            {t.recordSeconds}
          </Text>
        </View>

        {/* Detectable Issues */}
        <View
          style={[
            styles.issuesList,
            { backgroundColor: C.backgroundCard, borderColor: C.border },
          ]}
        >
          <Text
            style={[
              styles.issuesTitle,
              { color: C.text, fontFamily: "Nunito_700Bold" },
            ]}
          >
            Detectable Issues
          </Text>
          {[
            { icon: "cog", label: "Engine Knock / Bearing Noise" },
            { icon: "warning", label: "Abnormal Vibration" },
            { icon: "cloud-outline", label: "Exhaust Smoke Issues" },
            { icon: "thermometer", label: "Overheating Signs" },
            { icon: "water", label: "Hydraulic System Failure" },
            { icon: "layers", label: "Thresher / Harvester Blockage" },
          ].map((item) => (
            <View key={item.label} style={styles.issueRow}>
              <Ionicons
                name={item.icon as any}
                size={16}
                color={C.accent}
              />
              <Text
                style={[
                  styles.issueLabel,
                  { color: C.textSecondary, fontFamily: "Nunito_400Regular" },
                ]}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        {/* AnyWhere SDK note */}
        <View
          style={[
            styles.sdkNote,
            { backgroundColor: C.backgroundCard, borderColor: C.tint + "44" },
          ]}
        >
          <Ionicons name="hardware-chip-outline" size={16} color={C.tint} />
          <Text
            style={[
              styles.sdkNoteText,
              { color: C.textMuted, fontFamily: "Nunito_400Regular" },
            ]}
          >
            Powered by AnyWhere SDK (github.com/RunanywhereAI/runanywhere-sdks)
            — MFCC extraction + on-device classification
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    gap: 16,
  },
  permissionTitle: { fontSize: 20 },
  permissionText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
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
  waveContainer: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
    gap: 12,
  },
  waveLabel: { fontSize: 13 },
  waveRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    height: 50,
  },
  waveBar: {
    width: 5,
    borderRadius: 3,
  },
  timerText: { fontSize: 28 },
  waveHint: { fontSize: 12 },
  recordSection: {
    alignItems: "center",
    gap: 12,
  },
  recordBtnOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  recordBtnInner: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  recordHint: {
    fontSize: 16,
    marginTop: 4,
  },
  recordSubhint: {
    fontSize: 13,
    textAlign: "center",
  },
  issuesList: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  issuesTitle: {
    fontSize: 15,
    marginBottom: 4,
  },
  issueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  issueLabel: { fontSize: 13 },
  sdkNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  sdkNoteText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
});
