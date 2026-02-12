import { Redirect } from "expo-router";

export default function Index() {
  // À CHAQUE lancement, on va au consent
  return <Redirect href="/consent" />;
}
