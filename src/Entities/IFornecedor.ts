import type EntidadeBase from "./IEntidadeBase";
import type IProduto from "../Entities/IProduto";

export default interface IFornecedor extends EntidadeBase {
    nome: string;
    produtos?: IProduto[];
}