import React from "react";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#0B1220" },
        headerTintColor: "#EAF0FF",
        tabBarStyle: { backgroundColor: "#0B1220", borderTopColor: "rgba(255,255,255,0.1)" },
        tabBarActiveTintColor: "#5B8CFF",
        tabBarInactiveTintColor: "#A8B4D4",
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Scan" }} />
      <Tabs.Screen name="history" options={{ title: "Historique" }} />
      <Tabs.Screen name="about" options={{ title: "À propos" }} />
    </Tabs>
  );
}
