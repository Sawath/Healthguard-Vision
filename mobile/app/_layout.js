import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerStyle: { backgroundColor: "#0B1220" },
          headerTintColor: "#EAF0FF",
          headerShadowVisible: false,
          headerTitle: "HealthGuard",
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="consent" options={{ title: "Consentement" }} />
        <Stack.Screen name="refused" options={{ title: "Accès bloqué" }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="result" options={{ title: "Résultat" }} />
      </Stack>
    </>
  );
}
