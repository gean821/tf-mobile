import { Navbar } from "@/src/components/navs/navbar";
import { Stack, useSegments } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export const unstable_settings = {
  initialRouteName: "home",
};

const HIDE_NAVBAR_ROUTES = new Set([
  "agendamento/agendar",
  "agendamento/horarios",
  "agendamento/meus-agendamentos",
  "agendamento/ticketAgendamento",
  "agendamento/scanner",
  "notificacoes/notificacao",
  "relatorio/meu-desempenho",
  "usuario/editar-perfil",
]);

export default function AppLayout() {
  const segments = useSegments();
  const routeKey = segments
    .filter((segment) => !(segment.startsWith("(") && segment.endsWith(")")))
    .join("/");
  const showNavbar = !HIDE_NAVBAR_ROUTES.has(routeKey);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        {showNavbar && <Navbar />}

        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
