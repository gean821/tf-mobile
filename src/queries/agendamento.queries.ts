import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { RelatorioMotoristaQueryDto } from "../Dtos/Motorista/relatorioMotoristaDto";
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

export function useRelatorioMotoristaQuery(params: RelatorioMotoristaQueryDto) {
    return useQuery({
        queryKey: [agendamentoQueryKey, "relatorio", params],
        queryFn: async () => await AgendamentoService.getRelatorio(params),
        placeholderData: keepPreviousData,
        staleTime: 60_000,
        refetchOnWindowFocus: true,
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