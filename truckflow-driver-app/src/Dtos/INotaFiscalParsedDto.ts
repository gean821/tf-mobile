import { TipoCarga } from "../enums/tipoCarga";
import INotaFiscalItemDto from "./INotaFiscalItemDto";

export default interface INotaFiscalParsedDto {
    chaveAcesso: string;
    numero: number;
    fornecedor: string;
    serie: string;
    dataEmissao: string;
    emitenteNome: string;
    emitenteCnpj: string;
    destinatarioNome: string;
    valorTotal: number;
    pesoBruto: number;
    volumeQuantidae: number;
    placaVeiculo: string;
    itens: INotaFiscalItemDto[];
    tipoCarga: TipoCarga;
    validationWarnings: string[];
}