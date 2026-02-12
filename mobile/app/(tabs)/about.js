import React, { useMemo } from "react";
import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { theme } from "../../src/theme";
import { CONFIG } from "../../src/config";

function Badge({ label }) {
  return (
    <View
      style={{
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 999,
        backgroundColor: "rgba(37,99,235,0.12)",
        borderWidth: 1,
        borderColor: "rgba(37,99,235,0.25)",
      }}
    >
      <Text style={{ color: "#93C5FD", fontWeight: "800", fontSize: 12 }}>{label}</Text>
    </View>
  );
}

function Card({ title, subtitle, children }) {
  return (
    <View
      style={{
        backgroundColor: theme.card,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: theme.border,
        padding: 14,
        gap: 10,
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 10 },
        elevation: 6,
      }}
    >
      {!!title && <Text style={{ color: theme.text, fontSize: 16, fontWeight: "900" }}>{title}</Text>}
      {!!subtitle && <Text style={{ color: theme.muted, lineHeight: 19 }}>{subtitle}</Text>}
      {children}
    </View>
  );
}

function Row({ k, v }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
      <Text style={{ color: theme.muted, fontSize: 12 }}>{k}</Text>
      <Text style={{ color: theme.text, fontSize: 12, fontWeight: "800" }} numberOfLines={1}>
        {v}
      </Text>
    </View>
  );
}

export default function AboutScreen() {
  const api = CONFIG.API_BASE;

  const rules = useMemo(
    () => [
      "Usage informatif et préventif uniquement.",
      "La qualité de l’image influence fortement le résultat (lumière, cadrage, netteté).",
      "Aucune prescription, traitement ou diagnostic n’est fourni par l’application.",
      "Ne pas prendre de décisions médicales sans avis professionnel.",
      "L’utilisateur reste responsable de l’interprétation et de l’usage des informations.",
    ],
    []
  );

  const copyApi = async () => {
    await Clipboard.setStringAsync(api);
    Alert.alert("Copié ✅", "L’URL de l’API a été copiée dans le presse-papier.");
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ padding: 16, paddingBottom: 28, gap: 14 }}
    >
      {/* Header */}
      <View style={{ gap: 8 }}>
        <Text style={{ color: theme.text, fontSize: 28, fontWeight: "900" }}>À propos</Text>
        <Text style={{ color: theme.muted, lineHeight: 20 }}>
          HealthGuard Vision — dépistage indicatif à partir d’images (œil / peau / ongles).
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
          <Badge label="Démo" />
          <Badge label="Screening only" />
          <Badge label="IA" />
        </View>
      </View>



      {/* Disclaimer */}
      <Card
        title="Disclaimer médical"
        subtitle="À lire avant utilisation (important)."
      >
        <View
          style={{
            backgroundColor: "rgba(234,240,255,0.05)",
            borderRadius: 14,
            borderWidth: 1,
            borderColor: "rgba(234,240,255,0.10)",
            padding: 12,
            gap: 8,
          }}
        >
          <Text style={{ color: theme.text, fontWeight: "900" }}>
            Ce n’est pas un diagnostic médical
          </Text>

          <Text style={{ color: theme.muted, lineHeight: 20 }}>
            HealthGuard Vision est un outil de dépistage préventif basé sur l’analyse d’images.
            Les résultats fournis sont des estimations statistiques générées par des modèles d’IA, à partir de photos
            prises par l’utilisateur.{"\n\n"}
            Ces résultats ne remplacent ni une consultation, ni un avis, ni un examen réalisé par un professionnel de
            santé qualifié.{"\n\n"}
            En cas de doute, de symptômes persistants ou de préoccupations, consultez un médecin.
          </Text>
        </View>
      </Card>

      {/* Rules */}
      <Card title="Règles d’utilisation" subtitle="En utilisant l’application, vous acceptez :">
        <View style={{ gap: 10 }}>
          {rules.map((r, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 10 }}>
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  backgroundColor: "rgba(34,197,94,0.14)",
                  borderWidth: 1,
                  borderColor: "rgba(34,197,94,0.28)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 1,
                }}
              >
                <Text style={{ color: "#86EFAC", fontWeight: "900" }}>✓</Text>
              </View>
              <Text style={{ color: theme.muted, flex: 1, lineHeight: 20 }}>{r}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Footer */}
      <Text style={{ color: theme.muted, fontSize: 12, textAlign: "center", opacity: 0.85, marginTop: 4 }}>
        © {new Date().getFullYear()} HealthGuard Vision — demo
      </Text>
    </ScrollView>
  );
}
