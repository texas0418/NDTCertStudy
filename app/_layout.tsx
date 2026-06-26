import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { theme } from "../lib/theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.bg },
          headerTintColor: theme.amber,
          headerTitleStyle: { fontWeight: "600", color: theme.ink },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: theme.bg },
        }}
      >
        <Stack.Screen name="index" options={{ title: "NDT Cert Study" }} />
        <Stack.Screen name="module/[id]" options={{ title: "" }} />
        <Stack.Screen name="session" options={{ title: "", headerBackTitle: "Exit" }} />
        <Stack.Screen name="results" options={{ title: "Results" }} />
        <Stack.Screen name="review" options={{ title: "", headerBackTitle: "Results" }} />
        <Stack.Screen name="bookmarks" options={{ title: "Saved" }} />
        <Stack.Screen name="history" options={{ title: "Exam History" }} />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
