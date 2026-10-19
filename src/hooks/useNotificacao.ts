import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "../components/feedback/toast";
import type { EnviarParaEmpresaDto } from "../Dtos/Notificacao/EnviarParaEmpresaDto";
import {
  notificacaoAgendamentoQueryKey,
  notificacaoQueryKey,
  notificacaoUnreadCountQueryKey,
} from "../queries/notificacao.queries";
import NotificacaoService from "../services/NotificacaoService";

export const useNotificacao = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [notificacaoQueryKey] });
    queryClient.invalidateQueries({ queryKey: [notificacaoUnreadCountQueryKey] });
    queryClient.invalidateQueries({ queryKey: [notificacaoAgendamentoQueryKey] });
  };

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => await NotificacaoService.markAsRead(id),
    onSuccess: () => invalidate(),
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Falha ao marcar notificação como lida.";
      toast.error("Erro", msg);
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => await NotificacaoService.markAllAsRead(),
    onSuccess: () => invalidate(),
    onError: (error: AxiosError<{ message?: string }>) => {
      const msg =
        error.response?.data?.message ||
        "Falha ao marcar notificações como lidas.";
      toast.error("Erro", msg);
    },
  });

  const enviarParaEmpresaMutation = useMutation({
    mutationFn: async (dto: EnviarParaEmpresaDto) => await NotificacaoService.enviarParaEmpresa(dto),
    onSuccess: () => {
      invalidate();
      toast.success("Enviado", "Sua mensagem foi entregue à fábrica.");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Falha ao enviar mensagem.";
      toast.error("Erro", msg);
    },
  });

  return {
    markAsRead: markAsReadMutation.mutateAsync,
    isMarkingAsRead: markAsReadMutation.isPending,
    markAllAsRead: markAllAsReadMutation.mutateAsync,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    enviarParaEmpresa: enviarParaEmpresaMutation.mutateAsync,
    isEnviando: enviarParaEmpresaMutation.isPending,
  };
};