import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { ToastBridge, ToastProvider } from "@/src/components/feedback/toast";
import { PRIMARY_500 } from "@/src/constants/colors";
import { usePushRegistration } from "@/src/hooks/usePushRegistration";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

const client = new QueryClient();

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(app)",
};

SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const { token, isLoading, loadSession } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  usePushRegistration();

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = (segments[0] as string) === "(auth)";
    if (!token && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (token && inAuthGroup) {
      router.replace("/(app)/home");
    }
  }, [token, isLoading, segments]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: PRIMARY_500,
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GluestackUIProvider mode="light">
        <QueryClientProvider client={client}>
          <ToastProvider>
            <ToastBridge />
            <InitialLayout />
          </ToastProvider>
        </QueryClientProvider>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
