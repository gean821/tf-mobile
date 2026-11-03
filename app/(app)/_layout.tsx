import { IdleWarningModal } from "@/src/components/modals/IdleWarningModal";
import { Navbar } from "@/src/components/navs/navbar";
import { useIdleLogout } from "@/src/hooks/useIdleLogout";
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
  const { avisoVisivel, segundosRestantes, registrarAtividade, continuar, sair } = useIdleLogout();

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1 }}
        onStartShouldSetResponderCapture={() => {
          registrarAtividade();
          return false; // só observa o toque, não rouba o responder
        }}
      >
        {showNavbar && <Navbar />}

        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />

        <IdleWarningModal
          visible={avisoVisivel}
          segundos={segundosRestantes}
          onContinuar={continuar}
          onSair={sair}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
