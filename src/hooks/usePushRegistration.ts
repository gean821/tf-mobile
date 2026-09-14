import { useRouter } from "expo-router";
import { useEffect } from "react";
import { isPushPayloadData } from "../Dtos/Notificacao/PushPayloadData";
import PushRegistrationService from "../services/PushRegistrationService";
import { useAuthStore } from "../stores/useAuthStore";

// Carrega expo-notifications condicionalmente — módulo nativo não existe no Expo Go
let Notifications: typeof import("expo-notifications") | null = null;
try {
  Notifications = require("expo-notifications");
} catch {
  // Expo Go: sem suporte a push notifications nativas
}

export function usePushRegistration() {
  const token = useAuthStore((s) => s.token);
  const router = useRouter();

  useEffect(() => {
    if (!Notifications) return;

    try {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    } catch {
      // Expo Go: ignora
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    try {
      PushRegistrationService.ensureRegistered();
    } catch {
      // Expo Go: ignora
    }
  }, [token]);

  useEffect(() => {
    if (!Notifications) return;

    let sub: ReturnType<typeof Notifications.addNotificationResponseReceivedListener> | null = null;
    try {
      sub = Notifications.addNotificationResponseReceivedListener((response) => {
        const rawData: unknown = response.notification.request.content.data;
        const data = isPushPayloadData(rawData) ? rawData : null;

        if (data?.agendamentoId) {
          router.push({
            pathname: "/(app)/agendamento/ticketAgendamento",
            params: { id: data.agendamentoId },
          });
          return;
        }

        router.push("/(app)/notificacoes/notificacao");
      });
    } catch {
      // Expo Go: ignora
    }

    return () => {
      try {
        sub?.remove();
      } catch {
        // Expo Go: ignora
      }
    };
  }, [router]);
}
