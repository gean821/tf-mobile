import { TipoVeiculo } from "@/src/enums/TipoVeiculo";

export default interface IAgendamentoResponseDto {
    id: string;
    unidadeEntrega: string;
    localDescarga: string;
    latitude?: number;
    longitude?: number;
    fornecedor: string;
    produto: string;
    pesoCarga: number;
    notaFiscal: string;
    placaVeiculo: string;
    horarioInicio: string;
    tipoVeiculo: TipoVeiculo;
    createdAt: string;
    updatedAt: string;
    status: string;
}
