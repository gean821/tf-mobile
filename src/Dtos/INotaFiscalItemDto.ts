export type NotaFiscalItemStatus = 'Matched' | 'PendenteRevisao';

export type OrigemMatchProduto =
    | 'EanAuto'
    | 'ProdFornecAuto'
    | 'HistoricoAuto'
    | 'AdminManual';

export default interface INotaFiscalItemDto {
    codigo: string;
    descricao: string;
    ean?: string;
    produtoSistemaId?: string;
    produtoSistemaNome?: string;
    quantidade: number;
    unidade?: string;
    valorUnitario: number;
    valorTotal: number;
    status?: NotaFiscalItemStatus;
    origemMatch?: OrigemMatchProduto;
}