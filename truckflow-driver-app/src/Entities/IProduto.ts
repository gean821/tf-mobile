import type EntidadeBase from "./IEntidadeBase";

export default interface IProduto extends EntidadeBase {
    nome: string,
    localDescargaId: string | undefined
}