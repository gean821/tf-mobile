import type EntidadeBase from "./IEntidadeBase";

export interface ProdutoFornecedor extends EntidadeBase {
    fornecedorId: string;
    produtoId: string;
}