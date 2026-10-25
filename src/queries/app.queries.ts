import { useQuery } from "@tanstack/react-query";
import AppService from "../services/AppService";

export const appQueryKey = "app";

export function useVersaoMinimaQuery(enabled: boolean) {
    return useQuery({
        queryKey: [appQueryKey, "versao-minima"],
        queryFn: async () => await AppService.getVersaoMinima(),
        enabled,
        retry: false,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });
}
