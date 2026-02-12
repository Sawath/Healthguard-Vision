import React from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { router } from "expo-router";
import { BackHandler } from "react-native";

export default function RefusedScreen() {
  const quit = () => {
    if (Platform.OS === "android") BackHandler.exitApp();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0B1220", padding: 20, justifyContent: "center" }}>
      <Text style={{ color: "#EAF0FF", fontSize: 22, fontWeight: "800", textAlign: "center" }}>
        Consentement requis
      </Text>

      <Text style={{ color: "#EAF0FF", opacity: 0.85, marginTop: 12, textAlign: "center", lineHeight: 20 }}>
        Vous avez refusé le consentement.
        {"\n"}L’application ne peut pas lancer d’analyse sans accord.
      </Text>

      <View style={{ marginTop: 18, gap: 12 }}>
        <Pressable
          onPress={() => router.replace("/consent")}
          style={{
            backgroundColor: "#2563EB",
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#EAF0FF", fontWeight: "800", fontSize: 16 }}>
            Revenir au consentement
          </Text>
        </Pressable>

        {Platform.OS === "android" && (
          <Pressable
            onPress={quit}
            style={{
              backgroundColor: "transparent",
              paddingVertical: 14,
              borderRadius: 14,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(234,240,255,0.25)",
            }}
          >
            <Text style={{ color: "#EAF0FF", fontWeight: "700", fontSize: 16 }}>
              Quitter
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
