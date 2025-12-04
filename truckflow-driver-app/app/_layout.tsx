import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import "../global.css";

const client = new QueryClient();


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (

    <GluestackUIProvider mode="light">
      <QueryClientProvider client={client}>
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </GluestackUIProvider>

  );
}

