import { TipoVeiculo } from "@/src/enums/TipoVeiculo";

export default interface IReservarAgendamentoDto {
    agendamentoId: string;
    notaFiscalChaveAcesso: string;
    usuarioId: string;
    placaVeiculo?: string;
    tipoVeiculo?: TipoVeiculo;
}