import { useQuery } from "@tanstack/react-query";
import ProdutoService from "../services/ProdutoService";

export const produtoQueryKey = "produtos";

export function useProdutosQuery() {
    return useQuery({
        queryKey: [produtoQueryKey],
        queryFn: async () => await ProdutoService.GetAll(),
        staleTime: 5 * 60 * 1000,
    });
}
