import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "../components/feedback/toast";
import IReservarAgendamentoDto from "../Dtos/Agendamento/IReservarAgendamentoDto";
import { agendamentoQueryKey } from "../queries/agendamento.queries";
import AgendamentoService from "../services/AgendamentoService";

export const useAgendamento = () => {
    const queryClient = useQueryClient();

    const reservarMutation = useMutation({
        mutationFn: async (dto: IReservarAgendamentoDto) => await AgendamentoService.BookApointment(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [agendamentoQueryKey] });
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message || "Falha ao reservar.";
            toast.error("Erro ao reservar", msg);
        },
    });

    return {
        reservar: reservarMutation.mutateAsync,
        isReserving: reservarMutation.isPending,
    };
};
