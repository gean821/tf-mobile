import { NotaFiscalStatus } from "../enums/NotaFiscalStatus";
import { TipoCarga } from "../enums/tipoCarga";
import IAgendamento from "./IAgendamento";
import type EntidadeBase from "./IEntidadeBase";
import IFornecedor from "./IFornecedor";
import INotaFiscalItem from "./INotaFiscalItem";

export default interface INotaFiscal extends EntidadeBase {
    chaveAcesso: string;
    numero: string;
    serie: string;
    dataEmissao: string;
    emitenteNome: string;
    emitenteCnpj: string;
    destinatarioNome: string;
    destinatarioCpfCnpj: string;
    valorTotal: number;
    pesoBruto: number;
    pesoLiquido: number;
    volumeQuantidade: number;
    placaVeiculo?: string;
    rawXml: string;
    notaFiscalStatus: NotaFiscalStatus;
    fornecedor: IFornecedor;
    agendamento: IAgendamento;
    itens: INotaFiscalItem;
    uploadedByUserId: string;
    uploadedAt: Date;
    validationMessages: string;
    tipoCarga: TipoCarga;
}