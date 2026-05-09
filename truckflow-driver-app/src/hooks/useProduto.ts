import { useProdutosQuery } from "../queries/produto.queries";

export const useProduto = () => {
    const { data: produtos = [], isLoading: isLoadingProdutos } = useProdutosQuery();

    return {
        produtos,
        isLoadingProdutos,
    };
};
