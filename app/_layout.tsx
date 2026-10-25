import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { AtualizacaoObrigatoria } from "@/src/components/feedback/AtualizacaoObrigatoria";
import { ToastBridge, ToastProvider } from "@/src/components/feedback/toast";
import { PRIMARY_500 } from "@/src/constants/colors";
import { usePushRegistration } from "@/src/hooks/usePushRegistration";
import { useVersaoMinima } from "@/src/hooks/useVersaoMinima";
import { useAuthStore } from "@/src/stores/useAuthStore";
import * as Sentry from "@sentry/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

const client = new QueryClient();

const sentryDsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
const CHAVE_NFE = /\d{44}/g;

Sentry.init({
  dsn: sentryDsn,
  enabled: !!sentryDsn && !__DEV__,
  environment: process.env.EXPO_PUBLIC_APP_ENV ?? "production",
  sendDefaultPii: false,
  tracesSampleRate: 0,
  beforeBreadcrumb(breadcrumb) {
    if (typeof breadcrumb.data?.url === "string") {
      breadcrumb.data.url = breadcrumb.data.url.replace(CHAVE_NFE, "[chave-nfe]");
    }
    if (breadcrumb.message) {
      breadcrumb.message = breadcrumb.message.replace(CHAVE_NFE, "[chave-nfe]");
    }
    return breadcrumb;
  },
});

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
  const { atualizacaoObrigatoria, urlLoja } = useVersaoMinima();

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (isLoading || atualizacaoObrigatoria) return;

    const inAuthGroup = (segments[0] as string) === "(auth)";
    if (!token && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (token && inAuthGroup) {
      router.replace("/(app)/home");
    }
  }, [token, isLoading, segments, atualizacaoObrigatoria]);

  if (atualizacaoObrigatoria) {
    return <AtualizacaoObrigatoria urlLoja={urlLoja} />;
  }

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

function RootLayout() {
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

export default Sentry.wrap(RootLayout);
