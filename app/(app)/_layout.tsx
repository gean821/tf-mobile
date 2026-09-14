import { Navbar } from "@/src/components/navs/navbar";
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export const unstable_settings = {
  initialRouteName: 'home',
};

export default function AppLayout() {
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>

        <Navbar />

        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />

      </SafeAreaView>
    </SafeAreaProvider>
  );
}
