import { TipoVeiculo } from "@/src/enums/TipoVeiculo";

export default interface IAgendamentoResponseDto {
    id: string;
    unidadeDescarga: string;
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
