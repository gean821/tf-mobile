import type EntidadeBase from "./IEntidadeBase";
import type IFornecedor from "./IFornecedor";
import type ItemPlanejamento from './ItemPlanejamento.ts'

export default interface IPlanejamentoRecebimento extends EntidadeBase {
    fornecedor: IFornecedor;
    fornecedorId: string;
    dataInicio: string;
    statusRecebimento: 'Indefinido' | 'Planejado' | 'EmAndamento' | 'Concluido'
    itemPlanejamentos: ItemPlanejamento[]
}