import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useColorScheme,
  Platform,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import translations from "@/constants/translations";

export default function ResultScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const C = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { language, diagnoses, deleteDiagnosis } = useApp();
  const t = translations[language];
  const { id } = useLocalSearchParams<{ id: string }>();

  const diagnosis = diagnoses.find((d) => d.id === id);
  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  if (!diagnosis) {
    return (
      <View style={[styles.container, { backgroundColor: C.background }]}>
        <View style={[styles.emptyState, { paddingTop: topPadding + 40 }]}>
          <Ionicons name="alert-circle-outline" size={56} color={C.textMuted} />
          <Text
            style={[
              styles.emptyText,
              { color: C.textMuted, fontFamily: "Nunito_400Regular" },
            ]}
          >
            Diagnosis not found
          </Text>
          <Pressable
            onPress={() => router.back()}
            style={[
              styles.backChip,
              { backgroundColor: C.backgroundCard, borderColor: C.border },
            ]}
          >
            <Ionicons name="arrow-back" size={18} color={C.tint} />
            <Text
              style={[
                { color: C.tint, fontFamily: "Nunito_600SemiBold", fontSize: 14 },
              ]}
            >
              {t.back}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const { knowledge, confidence, imageUri, isHealthy } = diagnosis;

  const severityColorMap: Record<string, string> = {
    high: C.danger,
    medium: C.warning,
    low: C.success,
    none: C.success,
  };
  const severityColor = severityColorMap[knowledge.severity] ?? C.success;

  // Healthy crop uses a special green gradient
  const catGradient: Record<string, [string, string]> = {
    crop: isHealthy ? ["#2e7d32", "#1b5e20"] : ["#2da653", "#1a7a3c"],
    soil: ["#8B5E3C", "#5a3a20"],
    machinery: ["#f5a623", "#d48a0d"],
    irrigation: ["#1a6b9e", "#0d4f7a"],
  };

  const catIcon: Record<string, string> = {
    crop: "leaf",
    soil: "earth",
    machinery: "construct",
    irrigation: "water",
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    deleteDiagnosis(diagnosis.id);
    router.replace("/");
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <LinearGradient
        colors={catGradient[knowledge.category]}
        style={[styles.header, { paddingTop: topPadding + 8 }]}
      >
        <View style={styles.headerTop}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <Pressable onPress={handleDelete} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={20} color="rgba(255,255,255,0.8)" />
          </Pressable>
        </View>

        <View style={styles.headerInfo}>
          {isHealthy ? (
            <MaterialCommunityIcons name="check-circle" size={36} color="rgba(255,255,255,0.95)" />
          ) : (
            <Ionicons
              name={catIcon[knowledge.category] as any}
              size={32}
              color="rgba(255,255,255,0.9)"
            />
          )}
          <View style={styles.headerText}>
            <Text
              style={[
                styles.headerTitle,
                { fontFamily: "Nunito_800ExtraBold" },
              ]}
            >
              {knowledge.title}
            </Text>
            <Text
              style={[
                styles.headerDate,
                { fontFamily: "Nunito_400Regular" },
              ]}
            >
              {t.diagnosedOn} {new Date(diagnosis.timestamp).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.headerBadges}>
          {isHealthy ? (
            <View style={[styles.badge, { backgroundColor: "rgba(255,255,255,0.25)" }]}>
              <Ionicons name="checkmark-circle" size={13} color="#fff" />
              <Text style={[styles.badgeText, { fontFamily: "Nunito_700Bold" }]}>
                HEALTHY
              </Text>
            </View>
          ) : (
            <View style={[styles.badge, { backgroundColor: severityColor + "cc" }]}>
              <Text style={[styles.badgeText, { fontFamily: "Nunito_700Bold" }]}>
                {knowledge.severity.toUpperCase()} RISK
              </Text>
            </View>
          )}
          <View style={[styles.badge, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Ionicons name="analytics" size={12} color="#fff" />
            <Text style={[styles.badgeText, { fontFamily: "Nunito_700Bold" }]}>
              {confidence}% confidence
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 16,
          gap: 14,
          paddingBottom: bottomPadding + 40,
        }}
      >
        {/* Captured Image */}
        {imageUri && (
          <View
            style={[
              styles.imageCard,
              { backgroundColor: C.backgroundCard, borderColor: C.border },
            ]}
          >
            <Image
              source={{ uri: imageUri }}
              style={styles.capturedImage}
              resizeMode="cover"
            />
            <View style={styles.imageOverlay}>
              <View
                style={[
                  styles.imageTag,
                  { backgroundColor: "rgba(0,0,0,0.6)" },
                ]}
              >
                <Ionicons name="camera" size={12} color="#fff" />
                <Text
                  style={[
                    styles.imageTagText,
                    { fontFamily: "Nunito_600SemiBold" },
                  ]}
                >
                  Analyzed Image
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* HEALTHY CROP — special view */}
        {isHealthy ? (
          <>
            <View
              style={[
                styles.healthyBanner,
                { backgroundColor: C.success + "18", borderColor: C.success + "44" },
              ]}
            >
              <MaterialCommunityIcons
                name="check-circle"
                size={32}
                color={C.success}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.healthyTitle,
                    { color: C.success, fontFamily: "Nunito_800ExtraBold" },
                  ]}
                >
                  No Disease Detected
                </Text>
                <Text
                  style={[
                    styles.healthySubtitle,
                    { color: C.textSecondary, fontFamily: "Nunito_400Regular" },
                  ]}
                >
                  Your crop appears healthy. Continue your current care routine.
                </Text>
              </View>
            </View>

            <ResultSection
              title="Healthy Signs Observed"
              icon="leaf-outline"
              color={C.success}
              C={C}
            >
              {knowledge.symptoms.map((s, i) => (
                <BulletItem key={i} text={s} color={C.success} C={C} />
              ))}
            </ResultSection>

            <ResultSection
              title="Recommended Care"
              icon="medkit-outline"
              color={C.tint}
              C={C}
            >
              {knowledge.solution.map((s, i) => (
                <BulletItem key={i} text={s} color={C.tint} C={C} numbered={i + 1} />
              ))}
            </ResultSection>

            <ResultSection
              title="Prevention Tips"
              icon="shield-checkmark-outline"
              color={C.tint}
              C={C}
            >
              {knowledge.prevention.map((p, i) => (
                <BulletItem key={i} text={p} color={C.tint} C={C} />
              ))}
            </ResultSection>
          </>
        ) : (
          <>
            {/* AI Inference Note */}
            <View
              style={[
                styles.infoCard,
                { backgroundColor: C.backgroundCard, borderColor: C.tint + "44", borderWidth: 1.5 },
              ]}
            >
              <Ionicons name="hardware-chip" size={16} color={C.tint} />
              <Text
                style={[
                  styles.infoCardText,
                  { color: C.textSecondary, fontFamily: "Nunito_400Regular" },
                ]}
              >
                Diagnosed using AnyWhere SDK — on-device inference. No data left your device.
              </Text>
            </View>

            {/* Symptoms */}
            <ResultSection
              title="Detected Symptoms"
              icon="warning-outline"
              color={C.danger}
              C={C}
            >
              {knowledge.symptoms.map((s, i) => (
                <BulletItem key={i} text={s} color={C.danger} C={C} />
              ))}
            </ResultSection>

            {/* Causes */}
            <ResultSection
              title="Likely Causes"
              icon="bug-outline"
              color={C.warning}
              C={C}
            >
              {knowledge.causes.map((c, i) => (
                <BulletItem key={i} text={c} color={C.warning} C={C} />
              ))}
            </ResultSection>

            {/* Step-by-step solution */}
            <ResultSection
              title={t.stepSolution}
              icon="medkit-outline"
              color={C.tint}
              C={C}
            >
              {knowledge.solution.map((s, i) => (
                <BulletItem key={i} text={s} color={C.tint} C={C} numbered={i + 1} />
              ))}
            </ResultSection>

            {/* Prevention */}
            <ResultSection
              title={t.preventionTips}
              icon="shield-checkmark-outline"
              color={C.success}
              C={C}
            >
              {knowledge.prevention.map((p, i) => (
                <BulletItem key={i} text={p} color={C.success} C={C} />
              ))}
            </ResultSection>

            {/* Crops affected */}
            {knowledge.crops && knowledge.crops.length > 0 && (
              <View
                style={[
                  styles.cropsCard,
                  { backgroundColor: C.backgroundCard, borderColor: C.border },
                ]}
              >
                <Text
                  style={[
                    styles.cropsTitle,
                    { color: C.text, fontFamily: "Nunito_700Bold" },
                  ]}
                >
                  Affected Crops
                </Text>
                <View style={styles.cropTags}>
                  {knowledge.crops.map((crop) => (
                    <View
                      key={crop}
                      style={[
                        styles.cropTag,
                        { backgroundColor: C.backgroundSecondary, borderColor: C.border },
                      ]}
                    >
                      <Text
                        style={[
                          styles.cropTagText,
                          { color: C.text, fontFamily: "Nunito_600SemiBold" },
                        ]}
                      >
                        {crop}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function ResultSection({
  title,
  icon,
  color,
  children,
  C,
}: {
  title: string;
  icon: string;
  color: string;
  children: React.ReactNode;
  C: any;
}) {
  return (
    <View
      style={[
        resultStyles.section,
        { backgroundColor: C.backgroundCard, borderColor: C.border },
      ]}
    >
      <View style={resultStyles.sectionHeader}>
        <View
          style={[resultStyles.iconWrap, { backgroundColor: color + "22" }]}
        >
          <Ionicons name={icon as any} size={16} color={color} />
        </View>
        <Text
          style={[
            resultStyles.sectionTitle,
            { color: C.text, fontFamily: "Nunito_700Bold" },
          ]}
        >
          {title}
        </Text>
      </View>
      <View style={resultStyles.sectionBody}>{children}</View>
    </View>
  );
}

function BulletItem({
  text,
  color,
  C,
  numbered,
}: {
  text: string;
  color: string;
  C: any;
  numbered?: number;
}) {
  return (
    <View style={resultStyles.bulletRow}>
      <Text
        style={[
          resultStyles.bullet,
          { color, fontFamily: "Nunito_700Bold" },
        ]}
      >
        {numbered !== undefined ? `${numbered}.` : "•"}
      </Text>
      <Text
        style={[
          resultStyles.bulletText,
          { color: C.textSecondary, fontFamily: "Nunito_400Regular" },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  headerText: { flex: 1 },
  headerTitle: {
    fontSize: 20,
    color: "#fff",
    lineHeight: 26,
  },
  headerDate: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },
  headerBadges: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    color: "#fff",
  },
  imageCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    height: 200,
  },
  capturedImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  imageTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  imageTagText: {
    fontSize: 11,
    color: "#fff",
  },
  healthyBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
  },
  healthyTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  healthySubtitle: {
    fontSize: 13,
    lineHeight: 19,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderRadius: 12,
    padding: 14,
  },
  infoCardText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
  cropsCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  cropsTitle: { fontSize: 15 },
  cropTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  cropTag: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cropTagText: { fontSize: 13 },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
  backChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});

const resultStyles = StyleSheet.create({
  section: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: { fontSize: 15 },
  sectionBody: { gap: 8 },
  bulletRow: {
    flexDirection: "row",
    gap: 8,
  },
  bullet: {
    fontSize: 14,
    width: 22,
    marginTop: 1,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
});
