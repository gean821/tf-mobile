import { useQuery } from "@tanstack/react-query";
import { AuthService } from "../services/AuthService";

export const motoristaQueryKey = "motorista";

export function useMotoristaProfileQuery() {
  return useQuery({
    queryKey: [motoristaQueryKey, "profile"],
    queryFn: () => AuthService.getMe(),
  });
}

export function useMotoristaVeiculosQuery() {
  return useQuery({
    queryKey: [motoristaQueryKey, "veiculos"],
    queryFn: () => AuthService.getVeiculos(),
  });
}
