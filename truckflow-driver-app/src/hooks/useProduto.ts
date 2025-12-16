import { useQuery, useQueryClient } from "@tanstack/react-query";
import ProdutoService from "../services/ProdutoService";


export const useProduto = () => {
    const queryClient = useQueryClient();

    const {
        data: produtos,
        isLoading: isLoadingProdutos,
        error: errorProdutos
    } = useQuery({
        queryKey: ['getAll'],
        staleTime: 5*60*1000,
        queryFn: ProdutoService.GetAll,
    });

    return {
        produtos: produtos || [],
        isLoadingProdutos
    }

}
