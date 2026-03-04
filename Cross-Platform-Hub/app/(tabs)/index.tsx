import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  useColorScheme,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import translations from "@/constants/translations";
import { DiagnosisResult } from "@/constants/knowledgeBase";

function QuickActionButton({
  icon,
  label,
  onPress,
  gradient,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  gradient: [string, string];
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      onPressIn={() => { scale.value = withSpring(0.94); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      onPress={onPress}
      style={styles.actionPressable}
    >
      <Animated.View style={[styles.actionCard, animStyle]}>
        <LinearGradient colors={gradient} style={styles.actionGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          {icon}
          <Text style={styles.actionLabel}>{label}</Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

function DiagnosisHistoryItem({ item, onPress }: { item: DiagnosisResult; onPress: () => void }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const C = isDark ? Colors.dark : Colors.light;

  const categoryIcon: Record<string, string> = {
    crop: "leaf",
    soil: "earth",
    machinery: "construct",
    irrigation: "water",
  };

  const severityColor: Record<string, string> = {
    high: C.danger,
    medium: C.warning,
    low: C.success,
  };

  return (
    <Pressable onPress={onPress} style={[styles.historyItem, { backgroundColor: C.backgroundCard, borderColor: C.border }]}>
      <View style={[styles.historyIcon, { backgroundColor: C.backgroundSecondary }]}>
        <Ionicons name={categoryIcon[item.knowledge.category] as any} size={20} color={C.tint} />
      </View>
      <View style={styles.historyContent}>
        <Text style={[styles.historyTitle, { color: C.text, fontFamily: "Nunito_700Bold" }]} numberOfLines={1}>
          {item.knowledge.title}
        </Text>
        <Text style={[styles.historyDate, { color: C.textMuted, fontFamily: "Nunito_400Regular" }]}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
      <View style={[styles.severityBadge, { backgroundColor: severityColor[item.knowledge.severity] + "22" }]}>
        <Text style={[styles.severityText, { color: severityColor[item.knowledge.severity], fontFamily: "Nunito_700Bold" }]}>
          {item.knowledge.severity.toUpperCase()}
        </Text>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const C = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { language, diagnoses } = useApp();
  const t = translations[language];

  const navigateTo = useCallback((path: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(path as any);
  }, []);

  const openDiagnosis = useCallback((id: string) => {
    router.push({ pathname: "/result/[id]", params: { id } });
  }, []);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 120 : 100 }}
      >
        {/* Header */}
        <LinearGradient
          colors={isDark ? ["#0d3b1e", "#0a1a0d"] : ["#1a7a3c", "#0d5c2d"]}
          style={[styles.header, { paddingTop: topPadding + 16 }]}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.greeting, { fontFamily: "Nunito_400Regular" }]}>Welcome back</Text>
              <Text style={[styles.appName, { fontFamily: "Nunito_800ExtraBold" }]}>farmphile AI</Text>
            </View>
            <Pressable onPress={() => navigateTo("/settings")} style={styles.settingsBtn}>
              <Ionicons name="settings-outline" size={24} color="rgba(255,255,255,0.9)" />
            </Pressable>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { fontFamily: "Nunito_800ExtraBold" }]}>{diagnoses.length}</Text>
              <Text style={[styles.statLabel, { fontFamily: "Nunito_400Regular" }]}>Diagnoses</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCard}>
              <Ionicons name="wifi-outline" size={18} color="rgba(255,255,255,0.8)" />
              <Text style={[styles.statLabel, { fontFamily: "Nunito_400Regular" }]}>100% Offline</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCard}>
              <Ionicons name="shield-checkmark-outline" size={18} color="rgba(255,255,255,0.8)" />
              <Text style={[styles.statLabel, { fontFamily: "Nunito_400Regular" }]}>Private</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: C.text, fontFamily: "Nunito_700Bold" }]}>
            {t.quickActions}
          </Text>
          <View style={styles.actionsGrid}>
            <QuickActionButton
              icon={<MaterialCommunityIcons name="leaf-circle" size={32} color="#fff" />}
              label={t.analyzeImage}
              onPress={() => navigateTo("/(tabs)/crop")}
              gradient={["#2da653", "#1a7a3c"]}
            />
            <QuickActionButton
              icon={<Ionicons name="radio" size={32} color="#fff" />}
              label={t.recordSound}
              onPress={() => navigateTo("/(tabs)/sound")}
              gradient={["#f5a623", "#d48a0d"]}
            />
            <QuickActionButton
              icon={<Ionicons name="library" size={32} color="#fff" />}
              label={t.browseKnowledge}
              onPress={() => navigateTo("/(tabs)/knowledge")}
              gradient={["#1a6b9e", "#0d4f7a"]}
            />
            <QuickActionButton
              icon={<Ionicons name="settings" size={32} color="#fff" />}
              label={t.settings}
              onPress={() => navigateTo("/settings")}
              gradient={["#6c4db8", "#4a2d8e"]}
            />
          </View>
        </View>

        {/* Offline Banner */}
        <View style={[styles.offlineBanner, { backgroundColor: C.backgroundCard, borderColor: C.tint + "44" }]}>
          <View style={[styles.offlineDot, { backgroundColor: C.tint }]} />
          <Text style={[styles.offlineText, { color: C.textSecondary, fontFamily: "Nunito_600SemiBold" }]}>
            All AI processing happens on-device — no cloud, full privacy
          </Text>
        </View>

        {/* Recent Diagnoses */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: C.text, fontFamily: "Nunito_700Bold" }]}>
            {t.recentDiagnoses}
          </Text>

          {diagnoses.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: C.backgroundCard, borderColor: C.border }]}>
              <Ionicons name="leaf-outline" size={48} color={C.textMuted} />
              <Text style={[styles.emptyText, { color: C.textMuted, fontFamily: "Nunito_400Regular" }]}>
                {t.noDiagnoses}
              </Text>
            </View>
          ) : (
            <View style={styles.historyList}>
              {diagnoses.slice(0, 5).map(item => (
                <DiagnosisHistoryItem
                  key={item.id}
                  item={item}
                  onPress={() => openDiagnosis(item.id)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    marginBottom: 2,
  },
  appName: {
    fontSize: 26,
    color: "#fff",
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  statRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    justifyContent: "space-around",
  },
  statCard: {
    alignItems: "center",
    gap: 2,
  },
  statNumber: {
    fontSize: 22,
    color: "#fff",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 14,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionPressable: {
    width: "47%",
  },
  actionCard: {
    borderRadius: 20,
    overflow: "hidden",
  },
  actionGradient: {
    padding: 20,
    alignItems: "flex-start",
    gap: 12,
    minHeight: 110,
    justifyContent: "space-between",
  },
  actionLabel: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Nunito_700Bold",
  },
  offlineBanner: {
    marginHorizontal: 20,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  offlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  offlineText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  historyList: { gap: 10 },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  historyContent: { flex: 1 },
  historyTitle: { fontSize: 14 },
  historyDate: { fontSize: 12, marginTop: 2 },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  severityText: { fontSize: 10 },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 260,
  },
});
