import { create } from "zustand";
import IProduto from "../Entities/IProduto";

export default interface ProdutoState {
    produtoSelecionado: IProduto | null;
    setProdutoSelecionado: (produto: IProduto | null) => void;
}

export const useProdutoStore = create<ProdutoState>((set) => ({
    produtoSelecionado: null,
    setProdutoSelecionado: (produto) => set({ produtoSelecionado: produto })
}));