import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  useColorScheme,
  Platform,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import translations from "@/constants/translations";
import { KNOWLEDGE_BASE, searchKnowledge, KnowledgeEntry, Category } from "@/constants/knowledgeBase";

const CATEGORIES: { key: Category | "all"; label: string; icon: string; color: string }[] = [
  { key: "all", label: "All", icon: "grid", color: "#1a7a3c" },
  { key: "crop", label: "Crops", icon: "leaf", color: "#2da653" },
  { key: "soil", label: "Soil", icon: "earth", color: "#8B5E3C" },
  { key: "machinery", label: "Machinery", icon: "construct", color: "#f5a623" },
  { key: "irrigation", label: "Irrigation", icon: "water", color: "#1a6b9e" },
];

function KnowledgeCard({ item, onPress, isDark }: { item: KnowledgeEntry; onPress: () => void; isDark: boolean }) {
  const C = isDark ? Colors.dark : Colors.light;
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const severityColor: Record<string, string> = {
    high: C.danger,
    medium: C.warning,
    low: C.success,
  };

  const catColor: Record<string, string> = {
    crop: "#2da653",
    soil: "#8B5E3C",
    machinery: "#f5a623",
    irrigation: "#1a6b9e",
  };

  const catIcon: Record<string, string> = {
    crop: "leaf",
    soil: "earth",
    machinery: "construct",
    irrigation: "water",
  };

  return (
    <Pressable
      onPressIn={() => { scale.value = withSpring(0.97); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }}
    >
      <Animated.View style={[styles.card, { backgroundColor: C.backgroundCard, borderColor: C.border }, animStyle]}>
        <View style={styles.cardTop}>
          <View style={[styles.catBadge, { backgroundColor: catColor[item.category] + "22" }]}>
            <Ionicons name={catIcon[item.category] as any} size={14} color={catColor[item.category]} />
            <Text style={[styles.catText, { color: catColor[item.category], fontFamily: "Nunito_600SemiBold" }]}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </Text>
          </View>
          <View style={[styles.severityBadge, { backgroundColor: severityColor[item.severity] + "22" }]}>
            <Text style={[styles.severityText, { color: severityColor[item.severity], fontFamily: "Nunito_700Bold" }]}>
              {item.severity.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={[styles.cardTitle, { color: C.text, fontFamily: "Nunito_700Bold" }]}>{item.title}</Text>

        <Text style={[styles.cardSymptom, { color: C.textSecondary, fontFamily: "Nunito_400Regular" }]} numberOfLines={2}>
          {item.symptoms[0]}
        </Text>

        {item.crops && (
          <Text style={[styles.cardCrops, { color: C.textMuted, fontFamily: "Nunito_400Regular" }]}>
            Affects: {item.crops.slice(0, 3).join(", ")}
          </Text>
        )}

        <View style={styles.cardArrow}>
          <Ionicons name="chevron-forward" size={16} color={C.textMuted} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default function KnowledgeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const C = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const { language } = useApp();
  const t = translations[language];

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [selectedItem, setSelectedItem] = useState<KnowledgeEntry | null>(null);

  const results = useMemo(() => {
    return searchKnowledge(query, activeCategory === "all" ? undefined : activeCategory);
  }, [query, activeCategory]);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  if (selectedItem) {
    return <DetailView item={selectedItem} onBack={() => setSelectedItem(null)} isDark={isDark} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <LinearGradient
        colors={isDark ? ["#0d2a3b", "#0a1520"] : ["#1a4a6b", "#0d3050"]}
        style={[styles.header, { paddingTop: topPadding + 12 }]}
      >
        <Text style={[styles.headerTitle, { fontFamily: "Nunito_800ExtraBold" }]}>Knowledge Base</Text>
        <Text style={[styles.headerCount, { fontFamily: "Nunito_400Regular" }]}>
          {KNOWLEDGE_BASE.length} entries — fully offline
        </Text>
        <View style={[styles.searchBar, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
          <Ionicons name="search" size={18} color="rgba(255,255,255,0.7)" />
          <TextInput
            style={[styles.searchInput, { color: "#fff", fontFamily: "Nunito_400Regular" }]}
            placeholder={t.searchKnowledge}
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={query}
            onChangeText={setQuery}
          />
          {!!query && (
            <Pressable onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.7)" />
            </Pressable>
          )}
        </View>
      </LinearGradient>

      {/* Category Filter */}
      <View style={[styles.categoryRow, { borderBottomColor: C.border }]}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={c => c.key}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingVertical: 12 }}
          renderItem={({ item: cat }) => (
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActiveCategory(cat.key); }}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: activeCategory === cat.key ? cat.color : C.backgroundCard,
                  borderColor: activeCategory === cat.key ? cat.color : C.border,
                }
              ]}
            >
              <Ionicons name={cat.icon as any} size={14} color={activeCategory === cat.key ? "#fff" : C.textSecondary} />
              <Text style={[
                styles.categoryChipText,
                {
                  color: activeCategory === cat.key ? "#fff" : C.textSecondary,
                  fontFamily: "Nunito_600SemiBold"
                }
              ]}>
                {cat.label}
              </Text>
            </Pressable>
          )}
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: Platform.OS === "web" ? 120 : 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={C.textMuted} />
            <Text style={[styles.emptyText, { color: C.textMuted, fontFamily: "Nunito_400Regular" }]}>
              {t.noResults}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <KnowledgeCard item={item} isDark={isDark} onPress={() => setSelectedItem(item)} />
        )}
      />
    </View>
  );
}

function DetailView({ item, onBack, isDark }: { item: KnowledgeEntry; onBack: () => void; isDark: boolean }) {
  const C = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const severityColor: Record<string, string> = {
    high: C.danger,
    medium: C.warning,
    low: C.success,
  };

  const catGradient: Record<string, [string, string]> = {
    crop: ["#2da653", "#1a7a3c"],
    soil: ["#8B5E3C", "#5a3a20"],
    machinery: ["#f5a623", "#d48a0d"],
    irrigation: ["#1a6b9e", "#0d4f7a"],
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <LinearGradient
        colors={catGradient[item.category] || ["#1a7a3c", "#0d5c2d"]}
        style={[styles.detailHeader, { paddingTop: topPadding + 8 }]}
      >
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>
        <Text style={[styles.detailTitle, { fontFamily: "Nunito_800ExtraBold" }]}>{item.title}</Text>
        <View style={[styles.severityBadge, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
          <Text style={[styles.severityText, { color: "#fff", fontFamily: "Nunito_700Bold" }]}>
            {item.severity.toUpperCase()} RISK
          </Text>
        </View>
      </LinearGradient>

      <FlatList
        data={[item]}
        keyExtractor={() => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: Platform.OS === "web" ? 120 : 80 }}
        renderItem={() => (
          <>
            <Section title="Symptoms" icon="warning" color={C.danger} items={item.symptoms} C={C} />
            <Section title="Causes" icon="bug" color={C.warning} items={item.causes} C={C} />
            <Section title="Step-by-Step Solution" icon="medkit" color={C.tint} items={item.solution} C={C} numbered />
            <Section title="Prevention Tips" icon="shield-checkmark" color={C.success} items={item.prevention} C={C} />
          </>
        )}
      />
    </View>
  );
}

function Section({ title, icon, color, items, C, numbered }: {
  title: string; icon: string; color: string; items: string[]; C: any; numbered?: boolean;
}) {
  return (
    <View style={[styles.section, { backgroundColor: C.backgroundCard, borderColor: C.border }]}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon as any} size={16} color={color} />
        <Text style={[styles.sectionTitle, { color: C.text, fontFamily: "Nunito_700Bold" }]}>{title}</Text>
      </View>
      {items.map((item, i) => (
        <View key={i} style={styles.sectionItem}>
          <Text style={[styles.sectionBullet, { color: color, fontFamily: "Nunito_700Bold" }]}>
            {numbered ? `${i + 1}.` : "•"}
          </Text>
          <Text style={[styles.sectionText, { color: C.textSecondary, fontFamily: "Nunito_400Regular" }]}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 4,
  },
  headerTitle: {
    fontSize: 24,
    color: "#fff",
  },
  headerCount: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  categoryRow: {
    borderBottomWidth: 1,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: { fontSize: 13 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  catBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  catText: { fontSize: 12 },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  severityText: { fontSize: 10 },
  cardTitle: { fontSize: 16 },
  cardSymptom: { fontSize: 13, lineHeight: 18 },
  cardCrops: { fontSize: 12 },
  cardArrow: { position: "absolute", right: 16, bottom: 16 },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
  detailHeader: {
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
  detailTitle: {
    fontSize: 22,
    color: "#fff",
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: { fontSize: 15 },
  sectionItem: {
    flexDirection: "row",
    gap: 8,
  },
  sectionBullet: {
    fontSize: 14,
    width: 20,
    marginTop: 1,
  },
  sectionText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
});
