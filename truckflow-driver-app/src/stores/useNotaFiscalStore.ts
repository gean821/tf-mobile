import { create } from "zustand";
import INotaFiscalParsedDto from "../Dtos/INotaFiscalParsedDto";
import { TipoVeiculo } from "../enums/TipoVeiculo";

export default interface NotaFiscalState {
    notaEmConferencia: INotaFiscalParsedDto | null,
    setNotaEmConferencia: (nota: INotaFiscalParsedDto) => void;
    placaVeiculo?: string;
    tipoVeiculo?: TipoVeiculo;
    limparNota: () => void;
    setDadosVeiculo: (placa: string, tipo: TipoVeiculo) => void;
}

export const useNotaFiscalStore = create<NotaFiscalState>((set) => ({
    notaEmConferencia: null,
    setNotaEmConferencia: (nota) => set({ notaEmConferencia: nota }),
    limparNota: () => set({ notaEmConferencia: null }),

    setDadosVeiculo: (placa, tipo) => set({
        placaVeiculo: placa,
        tipoVeiculo: tipo
    }),
}));