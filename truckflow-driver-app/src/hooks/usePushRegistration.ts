import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { isPushPayloadData } from "../Dtos/Notificacao/PushPayloadData";
import PushRegistrationService from "../services/PushRegistrationService";
import { useAuthStore } from "../stores/useAuthStore";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function usePushRegistration() {
  const token = useAuthStore((s) => s.token);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      return;
    }

    PushRegistrationService.ensureRegistered();
  }, [token]);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
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

    return () => sub.remove();
  }, [router]);
}