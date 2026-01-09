import { create } from "zustand";
import INotaFiscalParsedDto from "../Dtos/INotaFiscalParsedDto";
import { TipoVeiculo } from "../enums/TipoVeiculo";

export default interface NotaFiscalState {
    notaEmConferencia: INotaFiscalParsedDto | null,
    setNotaEmConferencia: (nota: INotaFiscalParsedDto) => void;
    vincularProdutoItem: (index: number, produtoId: string, nome: string) => void;
    placaVeiculo?: string;
    tipoVeiculo?: TipoVeiculo; limparNota: () => void;
    setDadosVeiculo: (placa: string, tipo: TipoVeiculo) => void;
}

export const useNotaFiscalStore = create<NotaFiscalState>((set) => ({
    notaEmConferencia: null,
    setNotaEmConferencia: (nota) => set({ notaEmConferencia: nota }),
    limparNota: () => set({ notaEmConferencia: null }),
    vincularProdutoItem: (index, produtoId, nome) => set((state) => {

        if (!state.notaEmConferencia) {
            return {};
        }

        // Cria uma cópia imutável dos itens
        const novosItens = [...state.notaEmConferencia.itens];

        // Atualiza o item específico com o ID e Nome escolhidos
        novosItens[index] = {
            ...novosItens[index],
            produtoSistemaId: produtoId,
            produtoSistemaNome: nome
        };
        return {
            notaEmConferencia: {
                ...state.notaEmConferencia,
                itens: novosItens
            }
        };

    }),
    
    setDadosVeiculo: (placa, tipo) => set({
        placaVeiculo: placa,
        tipoVeiculo: tipo
    }),
}));