import { keepPreviousData, useQuery } from "@tanstack/react-query";
import AgendamentoService from "../services/AgendamentoService";

export const agendamentoQueryKey = "agendamentos";

export function useVagasDisponiveisQuery(
    params: {
        chaveAcesso: string;
        data: string
    }) {
    return useQuery({
        queryKey: [agendamentoQueryKey, "disponiveis", params],
        queryFn: async () => await AgendamentoService.GetAvailableAppointments(params.chaveAcesso, params.data),
        enabled: !!params.chaveAcesso && !!params.data,
        placeholderData: keepPreviousData,
        refetchInterval: 15_000,
        refetchOnWindowFocus: true,
        staleTime: 0,
    });
}

export function useMeusAgendamentosQuery(enabled: boolean = true) {
    return useQuery({
        queryKey: [agendamentoQueryKey, "meus"],
        queryFn: async () => await AgendamentoService.getDriverAppointments(),
        enabled,
        refetchInterval: 30_000,
        refetchOnWindowFocus: true,
    });
}