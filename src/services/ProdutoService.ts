import IProduto from "../Entities/IProduto";
import http from "./http/axios";


export default class ProdutoService {
    static async GetAll(): Promise<IProduto[]> {
        const produtos = await http.get('/Produto');
        return produtos.data;
    }

    static async GetById(id: string): Promise<IProduto> {
        const local = await http.get<IProduto>(`/Produto/${id}`);
        return local.data;
    }

    static async AddProduto(Produto: IProduto): Promise<IProduto> {
        const produto = await http.post<IProduto>('/Produto', Produto);
        return produto.data;
    }

    static async UpdateProduto(id: string, produtoAtualizado: IProduto): Promise<IProduto> {
        const produto = await http.put(`/Produto/${id}`, produtoAtualizado);
        return produto.data;
    }

    static async DeleteProduto(id: string): Promise<void> {
        await http.delete(`/Produto/${id}`);
    }
}
