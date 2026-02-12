import React, { useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { theme } from "../src/theme";

function badgeColor(level) {
  if (level === "high") return theme.danger;
  if (level === "medium") return theme.warn;
  return theme.ok;
}

export default function ResultScreen() {
  const { payload } = useLocalSearchParams();
  const data = useMemo(() => {
    try {
      return JSON.parse(payload || "{}");
    } catch {
      return {};
    }
  }, [payload]);

  const results = Array.isArray(data?.results) ? data.results : [];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <View style={{ backgroundColor: theme.card, borderRadius: 16, borderWidth: 1, borderColor: theme.border, padding: 12 }}>
        <Text style={{ color: theme.text, fontSize: 18, fontWeight: "700" }}>Résumé</Text>
        <Text style={{ color: theme.muted, marginTop: 6 }}>patient_id: {data?.patient_id}</Text>
        <Text style={{ color: theme.muted }}>analysis_id: {data?.analysis_id}</Text>
        <Text style={{ color: theme.muted }}>created_at: {data?.created_at}</Text>
      </View>

      {results.map((r, idx) => (
        <View key={idx} style={{ backgroundColor: theme.card, borderRadius: 16, borderWidth: 1, borderColor: theme.border, padding: 12, gap: 8 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: "700" }}>{r.condition}</Text>
            <View style={{ backgroundColor: badgeColor(r.level), paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 }}>
              <Text style={{ color: "#0B1220", fontWeight: "800" }}>{String(r.level).toUpperCase()}</Text>
            </View>
          </View>

          <Text style={{ color: theme.muted }}>score: {Number(r.score).toFixed(2)}</Text>

          <Text style={{ color: theme.text, fontWeight: "700", marginTop: 6 }}>Recommandations</Text>
          {(r.recommendations || []).map((t, i) => (
            <Text key={i} style={{ color: theme.muted }}>
              • {t}
            </Text>
          ))}
        </View>
      ))}

      <View style={{ backgroundColor: theme.card, borderRadius: 16, borderWidth: 1, borderColor: theme.border, padding: 12 }}>
        <Text style={{ color: theme.muted, fontSize: 12 }}>
          {data?.disclaimer || "Screening only. Not a medical diagnosis."}
        </Text>
      </View>
    </ScrollView>
  );
}
