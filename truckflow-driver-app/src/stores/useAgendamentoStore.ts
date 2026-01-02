import { create } from "zustand";
import IAgendamentoResponseDto from "../Dtos/Agendamento/IAgendamentoResponseDto";
import IReservarAgendamentoDto from "../Dtos/Agendamento/IReservarAgendamentoDto";
import AgendamentoService from "../services/AgendamentoService";

interface AgendamentoState {
    // Estado
    agendamentosDisponiveis: IAgendamentoResponseDto[];
    agendamentoSelecionado: IAgendamentoResponseDto | null;
    isLoading: boolean;
    
    carregarVagas: (fornecedorId: string, data: string) => Promise<void>;
    selecionarVaga: (vaga: IAgendamentoResponseDto | null) => void;
    reservarVaga: (dto: IReservarAgendamentoDto) => Promise<boolean>;
}

export const useAgendamentoStore = create<AgendamentoState>((set, get) => ({
    agendamentosDisponiveis: [],
    agendamentoSelecionado: null,
    isLoading: false,

    carregarVagas: async (fornecedorId, data) => {
        set({ isLoading: true });
        try {
            const vagas = await AgendamentoService.GetAvailableAppointments(fornecedorId, data);
            
            set({ agendamentosDisponiveis: vagas });
        } catch (error) {
            console.error("Erro ao carregar vagas", error);
            set({ agendamentosDisponiveis: [] });
        } finally {
            set({ isLoading: false });
        }
    },

    selecionarVaga: (vaga) => set({ agendamentoSelecionado: vaga }),

    reservarVaga: async (dto) => {
        set({ isLoading: true });
        try {
            await AgendamentoService.BookApointment(dto);
            return true;
        } catch (error) {
            console.error("Erro ao reservar", error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    }
}));