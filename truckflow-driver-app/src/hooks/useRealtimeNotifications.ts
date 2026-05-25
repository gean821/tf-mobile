import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import EventSource from "react-native-sse";
import { toast } from "../components/feedback/toast";
import { PrioridadeNotificacao } from "../enums/TipoNotificacao";
import {
  notificacaoAgendamentoQueryKey,
  notificacaoQueryKey,
  notificacaoUnreadCountQueryKey,
} from "../queries/notificacao.queries";
import { useAuthStore } from "../stores/useAuthStore";

interface NotificacaoEventDto {
  empresaId: string;
  usuarioId: string;
  notificacaoId: string;
  tipo: number;
  prioridade: number;
  titulo: string;
  corpo: string;
  criadaEm: string;
}

type CustomEventType = "notification";

export function useRealtimeNotifications() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  const esRef = useRef<EventSource<CustomEventType> | null>(null);
  const seenIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!token) {
      closeConnection(esRef);
      return;
    }

    const baseUrl = process.env.EXPO_PUBLIC_API_URL;
    if (!baseUrl) {
      console.warn("[realtime] EXPO_PUBLIC_API_URL ausente; SSE desativado.");
      return;
    }

    const url = `${baseUrl}notifications/stream`;

    let es: EventSource<CustomEventType>;
    try {
      es = new EventSource<CustomEventType>(url, {
        headers: { Authorization: `Bearer ${token}` },
        pollingInterval: 5000,
      });
    } catch (err) {
      console.warn("[realtime] falha criando EventSource:", err);
      return;
    }

    es.addEventListener("open", () => {
      seenIdsRef.current.clear();
    });

    es.addEventListener("notification", (event) => {
      if (!event.data) {
        return;
      }
      try {
        const evt: NotificacaoEventDto = JSON.parse(event.data);

        // Dedup por notificacaoId — protege contra listener disparando 2x
        // por causa de quirks de lib/proxy.
        if (seenIdsRef.current.has(evt.notificacaoId)) {
          return;
        }
        seenIdsRef.current.add(evt.notificacaoId);

        if (seenIdsRef.current.size > 200) {
          const first = seenIdsRef.current.values().next().value;
          if (first) seenIdsRef.current.delete(first);
        }

        invalidateAll(queryClient);
        toast[toastTipoFor(evt.prioridade)]("Notificação", evt.titulo);
      } catch (err) {
        console.warn("[realtime] falha parseando evento", err);
      }
    });

    es.addEventListener("error", (event) => {
      console.warn("[realtime] erro SSE", event);
    });

    esRef.current = es;

    return () => closeConnection(esRef);
  }, [token, queryClient]);
}

function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({
    queryKey: [notificacaoQueryKey],
    refetchType: "all",
  });
  queryClient.invalidateQueries({
    queryKey: [notificacaoUnreadCountQueryKey],
    refetchType: "all",
  });
  queryClient.invalidateQueries({
    queryKey: [notificacaoAgendamentoQueryKey],
    refetchType: "all",
  });
}

function toastTipoFor(
  prioridade: number,
): "error" | "warning" | "info" {
  if (prioridade === PrioridadeNotificacao.Critica) {
    return "error";
  }
  if (prioridade === PrioridadeNotificacao.Alta) {
    return "warning";
  }
  return "info";
}

function closeConnection(
  ref: React.MutableRefObject<EventSource<CustomEventType> | null>,
) {
  if (ref.current) {
    ref.current.removeAllEventListeners();
    ref.current.close();
    ref.current = null;
  }
}
