import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Alert } from "react-native";
import { getHistory } from "../../src/api";
import { CONFIG } from "../../src/config";
import { theme } from "../../src/theme";
import { router } from "expo-router";

export default function HistoryScreen() {
  const [patientId, setPatientId] = useState(CONFIG.DEFAULT_PATIENT_ID);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  async function load() {
    setLoading(true);
    try {
      const data = await getHistory(patientId.trim());
      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch (e) {
      Alert.alert("Erreur historique", String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ color: theme.text, fontSize: 22, fontWeight: "700" }}>Historique</Text>

      <View style={{ backgroundColor: theme.card, borderRadius: 16, borderWidth: 1, borderColor: theme.border, padding: 12, gap: 10 }}>
        <Text style={{ color: theme.muted }}>Patient ID</Text>
        <TextInput
          value={patientId}
          onChangeText={setPatientId}
          placeholder="ex: p001"
          placeholderTextColor={theme.muted}
          style={{ color: theme.text, borderWidth: 1, borderColor: theme.border, borderRadius: 12, padding: 10 }}
        />

        <Pressable
          onPress={load}
          style={{ padding: 12, borderRadius: 14, backgroundColor: theme.primary, alignItems: "center" }}
        >
          <Text style={{ color: theme.text, fontWeight: "800" }}>Charger</Text>
        </Pressable>
      </View>

      {loading ? <ActivityIndicator /> : null}

      {items.map((it) => (
        <Pressable
          key={it.analysis_id}
          onPress={() => router.push({ pathname: "/result", params: { payload: JSON.stringify(it) } })}
          style={{ backgroundColor: theme.card, borderRadius: 16, borderWidth: 1, borderColor: theme.border, padding: 12, gap: 6 }}
        >
          <Text style={{ color: theme.text, fontWeight: "800" }}>{it.analysis_id}</Text>
          <Text style={{ color: theme.muted }}>modality: {it.modality}</Text>
          <Text style={{ color: theme.muted }}>created_at: {it.created_at}</Text>
        </Pressable>
      ))}

      {!loading && items.length === 0 ? (
        <Text style={{ color: theme.muted }}>Aucun élément.</Text>
      ) : null}
    </ScrollView>
  );
}
