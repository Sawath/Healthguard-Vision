import React from "react";
import { View, Text, Pressable, Platform, Linking, Alert } from "react-native";
import { router } from "expo-router";
import { BackHandler } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CONSENT_KEY = "hg_consent_v1"; // on garde pour log

export default function ConsentScreen() {
  const accept = async () => {
    await AsyncStorage.setItem(CONSENT_KEY, JSON.stringify({ status: "accepted", at: Date.now() }));
    router.replace("/(tabs)");
  };

  const refuse = async () => {
    await AsyncStorage.setItem(CONSENT_KEY, JSON.stringify({ status: "refused", at: Date.now() }));

    if (Platform.OS === "android") {
      BackHandler.exitApp();
      return;
    }

    // iOS: on bloque l’app sur un écran refus
    router.replace("/refused");
  };

  const openPrivacy = () => {
    // mets ton vrai lien plus tard
    Linking.openURL("https://example.com/privacy").catch(() => {
      Alert.alert("Erreur", "Impossible d’ouvrir le lien.");
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0B1220", padding: 20 }}>
      <Text style={{ color: "#EAF0FF", fontSize: 28, fontWeight: "900", marginTop: 10 }}>
        HealthGuard
      </Text>

      <Text style={{ color: "#EAF0FF", fontSize: 22, fontWeight: "800", marginTop: 18 }}>
        Consentement patient
      </Text>

      <Text style={{ color: "#EAF0FF", opacity: 0.9, marginTop: 14, lineHeight: 21 }}>
        Cette application effectue une analyse indicative à partir d’images (œil, peau, ongles).
        {"\n\n"}
        • Ce n’est pas un diagnostic médical.
        {"\n"}
        • Les résultats sont des estimations et peuvent être faux.
        {"\n"}
        • En cas de symptômes, consulte un professionnel de santé.
        {"\n\n"}
        En continuant, vous confirmez avoir l’autorisation de fournir l’image et acceptez le traitement
        de ces données à des fins de démonstration.
      </Text>

      <View style={{ marginTop: 22, gap: 12 }}>
        <Pressable
          onPress={accept}
          style={{
            backgroundColor: "#2563EB",
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#EAF0FF", fontWeight: "900", fontSize: 16 }}>
            J’accepte et je continue
          </Text>
        </Pressable>

        <Pressable
          onPress={refuse}
          style={{
            backgroundColor: "transparent",
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "rgba(234,240,255,0.25)",
          }}
        >
          <Text style={{ color: "#EAF0FF", fontWeight: "800", fontSize: 16, opacity: 0.9 }}>
            Je refuse
          </Text>
        </Pressable>

        <Pressable onPress={openPrivacy} style={{ paddingVertical: 10, alignItems: "center" }}>
          <Text style={{ color: "#93C5FD", textDecorationLine: "underline" }}>
            Politique de confidentialité
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
