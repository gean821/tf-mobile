import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { ToastBridge, ToastProvider } from '@/src/components/feedback/toast';
import { useAuthStore } from '@/src/stores/useAuthStore';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import "../global.css";

const client = new QueryClient();


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(app)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const { token, isLoading, loadSession } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // 1. Carrega a sessão ao iniciar
  useEffect(() => {
    loadSession();
  }, []);

  // 2. Proteção de Rotas (O "Guarda")
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = (segments[0] as string) === "(auth)";    
    // Se NÃO tem token e NÃO está na área de auth -> Manda pro Login
    if (!token && !inAuthGroup) {
      router.replace('/(auth)/login'); 
    } 
    // Se TEM token e está na área de auth (tentando logar de novo) -> Manda pra Home
    else if (token && inAuthGroup) {
      router.replace("/(app)/home"); // Manda para a pasta (app)
    }
  }, [token, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#195FA0' }}>
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

