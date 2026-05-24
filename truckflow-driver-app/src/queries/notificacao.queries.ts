import type { NotificacaoListQueryDto } from "@/src/Dtos/Notificacao/NotificacaoListQueryDto";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import NotificacaoService from "../services/NotificacaoService";

export const notificacaoQueryKey = "notificacoes";
export const notificacaoUnreadCountQueryKey = "notificacoes-unread-count";
export const notificacaoAgendamentoQueryKey = "notificacoes-agendamento";

export function useNotificacoesPagedQuery(params: NotificacaoListQueryDto) {
  return useQuery({
    queryKey: [notificacaoQueryKey, params],
    queryFn: async () => await NotificacaoService.getPaged(params),
    placeholderData: keepPreviousData,
  });
}

export function useNotificacoesUnreadCountQuery() {
  return useQuery({
    queryKey: [notificacaoUnreadCountQueryKey],
    queryFn: async () => await NotificacaoService.unreadCount(),
    refetchOnWindowFocus: true,
    staleTime: 10_000,
  });
}

export function useComunicacaoAgendamentoQuery(
  agendamentoId: string | null,
  options?: { enabled?: boolean; refetchInterval?: number | false }
) {
  const enabled = (options?.enabled ?? true) && !!agendamentoId;

  return useQuery({
    queryKey: [notificacaoAgendamentoQueryKey, agendamentoId],
    queryFn: async () => {
      if (!agendamentoId) {
        return [];
      }

      return await NotificacaoService.listarPorAgendamento(agendamentoId);
    },
    enabled,
    refetchInterval: options?.refetchInterval,
  });
}