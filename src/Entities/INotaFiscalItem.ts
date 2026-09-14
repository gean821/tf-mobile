import NotaFiscal from "./INotaFiscal";

export default interface INotaFiscalItem {
    notaFiscal: NotaFiscal;
    codigo: string;
    descricao: string;
    quantidade: number;
    unidade: string;
    valorUnitario: number;
    valorTotal: number;
}