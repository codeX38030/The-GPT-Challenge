import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useColorScheme,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import { useApp, ThemeMode } from "@/context/AppContext";
import translations, { LANGUAGES, Language } from "@/constants/translations";

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: string }[] = [
  { mode: "light", label: "Light", icon: "sunny" },
  { mode: "dark", label: "Dark", icon: "moon" },
  { mode: "system", label: "System", icon: "phone-portrait" },
];

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const C = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { language, setLanguage, themeMode, setThemeMode, diagnoses, clearDiagnoses } = useApp();
  const t = translations[language];

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const handleClearHistory = () => {
    Alert.alert(
      t.clearAll,
      "This will delete all your diagnosis history. This cannot be undone.",
      [
        { text: t.back, style: "cancel" },
        {
          text: t.clearAll,
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            clearDiagnoses();
          },
        },
      ]
    );
  };

  const handleThemeChange = (mode: ThemeMode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setThemeMode(mode);
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <LinearGradient
        colors={isDark ? ["#2a0d4a", "#150828"] : ["#5b2d8e", "#3a1a6e"]}
        style={[styles.header, { paddingTop: topPadding + 12 }]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>
        <Text style={[styles.headerTitle, { fontFamily: "Nunito_800ExtraBold" }]}>
          {t.settings}
        </Text>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          gap: 16,
          paddingBottom: bottomPadding + 40,
        }}
      >
        {/* ── THEME ── */}
        <View style={[styles.sectionCard, { backgroundColor: C.backgroundCard, borderColor: C.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="contrast" size={18} color={C.tint} />
            <Text style={[styles.sectionTitle, { color: C.text, fontFamily: "Nunito_700Bold" }]}>
              {t.theme}
            </Text>
          </View>

          <View style={styles.themeRow}>
            {THEME_OPTIONS.map((opt) => {
              const active = themeMode === opt.mode;
              return (
                <Pressable
                  key={opt.mode}
                  onPress={() => handleThemeChange(opt.mode)}
                  style={[
                    styles.themeChip,
                    {
                      backgroundColor: active ? C.tint : C.backgroundSecondary,
                      borderColor: active ? C.tint : C.border,
                      flex: 1,
                    },
                  ]}
                >
                  <Ionicons
                    name={opt.icon as any}
                    size={18}
                    color={active ? "#fff" : C.textSecondary}
                  />
                  <Text
                    style={[
                      styles.themeLabel,
                      {
                        color: active ? "#fff" : C.textSecondary,
                        fontFamily: "Nunito_700Bold",
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={[styles.themeNote, { backgroundColor: C.backgroundSecondary, borderColor: C.border }]}>
            <Ionicons name="information-circle-outline" size={14} color={C.textMuted} />
            <Text style={[styles.themeNoteText, { color: C.textMuted, fontFamily: "Nunito_400Regular" }]}>
              Theme change applies instantly on Android & iOS. "System" follows your device setting.
            </Text>
          </View>
        </View>

        {/* ── LANGUAGE ── */}
        <View style={[styles.sectionCard, { backgroundColor: C.backgroundCard, borderColor: C.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="language" size={18} color={C.tint} />
            <Text style={[styles.sectionTitle, { color: C.text, fontFamily: "Nunito_700Bold" }]}>
              {t.language}
            </Text>
          </View>

          <View style={styles.languageGrid}>
            {LANGUAGES.map((lang) => (
              <Pressable
                key={lang.code}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setLanguage(lang.code as Language);
                }}
                style={[
                  styles.langChip,
                  {
                    backgroundColor:
                      language === lang.code ? C.tint : C.backgroundSecondary,
                    borderColor:
                      language === lang.code ? C.tint : C.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.langNative,
                    {
                      color: language === lang.code ? "#fff" : C.text,
                      fontFamily: "Nunito_700Bold",
                    },
                  ]}
                >
                  {lang.nativeName}
                </Text>
                <Text
                  style={[
                    styles.langEnglish,
                    {
                      color:
                        language === lang.code
                          ? "rgba(255,255,255,0.8)"
                          : C.textMuted,
                      fontFamily: "Nunito_400Regular",
                    },
                  ]}
                >
                  {lang.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── PRIVACY ── */}
        <View style={[styles.sectionCard, { backgroundColor: C.backgroundCard, borderColor: C.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark" size={18} color={C.success} />
            <Text style={[styles.sectionTitle, { color: C.text, fontFamily: "Nunito_700Bold" }]}>
              {t.privacy}
            </Text>
          </View>
          <View style={[styles.infoBanner, { backgroundColor: C.backgroundSecondary, borderColor: C.border }]}>
            <Ionicons name="lock-closed" size={18} color={C.success} />
            <Text style={[styles.infoText, { color: C.textSecondary, fontFamily: "Nunito_400Regular" }]}>
              {t.privacyNote}
            </Text>
          </View>
          {[
            { label: "Internet Permission", value: "Disabled", icon: "wifi-outline" },
            { label: "Analytics SDK", value: "None", icon: "bar-chart-outline" },
            { label: "Cloud Storage", value: "Disabled", icon: "cloud-outline" },
            { label: "Data Sharing", value: "None", icon: "share-outline" },
          ].map((item) => (
            <View key={item.label} style={styles.privacyRow}>
              <Ionicons name={item.icon as any} size={16} color={C.textSecondary} />
              <Text style={[styles.privacyLabel, { color: C.textSecondary, fontFamily: "Nunito_400Regular" }]}>
                {item.label}
              </Text>
              <View style={[styles.privacyBadge, { backgroundColor: C.success + "22" }]}>
                <Text style={[styles.privacyBadgeText, { color: C.success, fontFamily: "Nunito_700Bold" }]}>
                  {item.value}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── OFFLINE MODE ── */}
        <View style={[styles.sectionCard, { backgroundColor: C.backgroundCard, borderColor: C.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cellular-outline" size={18} color={C.tint} />
            <Text style={[styles.sectionTitle, { color: C.text, fontFamily: "Nunito_700Bold" }]}>
              {t.offlineMode}
            </Text>
          </View>
          <Text style={[styles.offlineNote, { color: C.textSecondary, fontFamily: "Nunito_400Regular" }]}>
            {t.offlineNote}
          </Text>
          <View style={styles.featureList}>
            {[
              "On-device AI inference (AnyWhere SDK)",
              "Embedded knowledge base (20+ entries)",
              "Local image processing pipeline",
              "Audio MFCC extraction on-device",
              "Diagnosis history stored locally",
            ].map((f) => (
              <View key={f} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={16} color={C.tint} />
                <Text style={[styles.featureText, { color: C.textSecondary, fontFamily: "Nunito_400Regular" }]}>
                  {f}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── AI ENGINE ── */}
        <View style={[styles.sectionCard, { backgroundColor: C.backgroundCard, borderColor: C.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="hardware-chip" size={18} color={C.accent} />
            <Text style={[styles.sectionTitle, { color: C.text, fontFamily: "Nunito_700Bold" }]}>
              AI Engine
            </Text>
          </View>
          <Text style={[styles.offlineNote, { color: C.textSecondary, fontFamily: "Nunito_400Regular" }]}>
            Powered by AnyWhere SDK (github.com/RunanywhereAI/runanywhere-sdks) with TensorFlow Lite acceleration. Models run 100% locally with INT8 quantization for ultra-low latency inference on any Android or iOS device.
          </Text>
        </View>

        {/* ── HISTORY MANAGEMENT ── */}
        <View style={[styles.sectionCard, { backgroundColor: C.backgroundCard, borderColor: C.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={18} color={C.warning} />
            <Text style={[styles.sectionTitle, { color: C.text, fontFamily: "Nunito_700Bold" }]}>
              Diagnosis History
            </Text>
          </View>
          <Text style={[styles.offlineNote, { color: C.textSecondary, fontFamily: "Nunito_400Regular" }]}>
            {diagnoses.length} diagnoses stored locally on device.
          </Text>
          {diagnoses.length > 0 && (
            <Pressable
              onPress={handleClearHistory}
              style={[styles.dangerBtn, { borderColor: C.danger }]}
            >
              <Ionicons name="trash-outline" size={18} color={C.danger} />
              <Text style={[styles.dangerBtnText, { color: C.danger, fontFamily: "Nunito_700Bold" }]}>
                {t.clearAll}
              </Text>
            </Pressable>
          )}
        </View>

        {/* ── ABOUT ── */}
        <View style={[styles.sectionCard, { backgroundColor: C.backgroundCard, borderColor: C.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={18} color={C.textMuted} />
            <Text style={[styles.sectionTitle, { color: C.text, fontFamily: "Nunito_700Bold" }]}>
              About
            </Text>
          </View>
          <Text style={[styles.aboutText, { color: C.textMuted, fontFamily: "Nunito_400Regular" }]}>
            farmphile AI v1.0.0{"\n"}
            Built for hackathon — 100% offline agricultural AI assistant.{"\n"}
            Supports Rice, Wheat, Sugarcane, Tomato, Potato, Cotton, Vegetables, and more.{"\n\n"}
            SDK: github.com/RunanywhereAI/runanywhere-sdks
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
    gap: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    color: "#fff",
  },
  sectionCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionTitle: { fontSize: 16 },
  themeRow: {
    flexDirection: "row",
    gap: 10,
  },
  themeChip: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  themeLabel: { fontSize: 13 },
  themeNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
  themeNoteText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  languageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  langChip: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    minWidth: "30%",
  },
  langNative: { fontSize: 15 },
  langEnglish: { fontSize: 11, marginTop: 2 },
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
  privacyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  privacyLabel: { flex: 1, fontSize: 13 },
  privacyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  privacyBadgeText: { fontSize: 11 },
  offlineNote: {
    fontSize: 13,
    lineHeight: 19,
  },
  featureList: { gap: 8 },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  featureText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  dangerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 12,
    marginTop: 4,
  },
  dangerBtnText: { fontSize: 14 },
  aboutText: {
    fontSize: 13,
    lineHeight: 22,
  },
});
