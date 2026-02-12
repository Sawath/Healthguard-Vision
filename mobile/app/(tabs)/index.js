import React, { useMemo, useState } from "react";
import { View, Text, Pressable, TextInput, ActivityIndicator, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { analyzeImage } from "../../src/api";
import { CONFIG } from "../../src/config";
import { theme } from "../../src/theme";

export default function ScanScreen() {
  const [patientId, setPatientId] = useState(CONFIG.DEFAULT_PATIENT_ID);
  const [modality, setModality] = useState("eye"); // eye|skin|nail
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => !!imageUri && !!patientId.trim() && !loading, [imageUri, patientId, loading]);

  async function pickFromCamera() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission caméra", "Autorise la caméra pour prendre une photo.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });



    if (!result.canceled) setImageUri(result.assets[0].uri);


  }

  async function pickFromGallery() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission photos", "Autorise l’accès aux photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });


    console.log(result);
    console.log(result.assets[0]);
    console.log(result.assets[0].uri);
    if (!result.canceled) setImageUri(result.assets[0].uri);
  }

  async function onAnalyze() {
    setLoading(true);
    try {
      const data = await analyzeImage({ uri: imageUri, patientId: patientId.trim(), modality });
      router.push({
        pathname: "/result",
        params: {
          payload: JSON.stringify(data),
        },
      });
      setImageUri(null);
    } catch (e) {
      Alert.alert("Erreur analyse", String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, padding: 16, gap: 12 }}>
      <Text style={{ color: theme.text, fontSize: 22, fontWeight: "700" }}>Healthguard</Text>
      <Text style={{ color: theme.muted }}>
        Envoie une photo (œil / peau / ongle) → API → résultats + recommandations.
      </Text>

      <View style={{ flexDirection: "row", gap: 8 }}>
        {["eye", "skin", "nail"].map((m) => (
          <Pressable
            key={m}
            onPress={() => setModality(m)}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 12,
              backgroundColor: modality === m ? theme.primary : theme.card,
              borderWidth: 1,
              borderColor: theme.border,
              alignItems: "center",
            }}
          >
            <Text style={{ color: theme.text, fontWeight: "600" }}>
              {m === "eye" ? "Œil" : m === "skin" ? "Peau" : "Ongle"}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={{ backgroundColor: theme.card, borderRadius: 16, borderWidth: 1, borderColor: theme.border, padding: 12 }}>
        <Text style={{ color: theme.muted, marginBottom: 6 }}>Patient ID</Text>
        <TextInput
          value={patientId}
          onChangeText={setPatientId}
          placeholder="ex: p001"
          placeholderTextColor={theme.muted}
          style={{
            color: theme.text,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 12,
            padding: 10,
          }}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 8 }}>
        <Pressable
          onPress={pickFromCamera}
          style={{ flex: 1, padding: 12, borderRadius: 14, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, alignItems: "center" }}
        >
          <Text style={{ color: theme.text, fontWeight: "600" }}>Prendre photo</Text>
        </Pressable>

        <Pressable
          onPress={pickFromGallery}
          style={{ flex: 1, padding: 12, borderRadius: 14, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border, alignItems: "center" }}
        >
          <Text style={{ color: theme.text, fontWeight: "600" }}>Galerie</Text>
        </Pressable>
      </View>

      {imageUri ? (
        <View style={{ backgroundColor: theme.card, borderRadius: 16, borderWidth: 1, borderColor: theme.border, padding: 12, gap: 10 }}>
          <Text style={{ color: theme.muted }}>Aperçu</Text>
          <Image source={{ uri: imageUri }} style={{ width: "100%", height: 240, borderRadius: 14 }} />
        </View>
      ) : (
        <View style={{ backgroundColor: theme.card, borderRadius: 16, borderWidth: 1, borderColor: theme.border, padding: 12 }}>
          <Text style={{ color: theme.muted }}>Aucune image sélectionnée</Text>
        </View>
      )}

      <Pressable
        disabled={!canSubmit}
        onPress={onAnalyze}
        style={{
          padding: 14,
          borderRadius: 16,
          backgroundColor: canSubmit ? theme.primary : "rgba(91,140,255,0.35)",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          gap: 10,
        }}
      >
        {loading ? <ActivityIndicator /> : null}
        <Text style={{ color: theme.text, fontWeight: "700" }}>Analyser</Text>
      </Pressable>
    </View>
  );
}
