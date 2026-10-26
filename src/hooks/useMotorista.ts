import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "../components/feedback/toast";
import motoristaUpdateDto from "../Dtos/Motorista/motoristaUpdateDto";
import { motoristaQueryKey } from "../queries/motorista.queries";
import { AuthService } from "../services/AuthService";
import LembrarLoginService from "../services/LembrarLoginService";
import { useAuthStore } from "../stores/useAuthStore";

export const useMotorista = () => {
    const queryClient = useQueryClient();
    const signOut = useAuthStore((s) => s.signOut);

    const atualizarPerfilMutation = useMutation({
        mutationFn: async (dto: motoristaUpdateDto) => await AuthService.update(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [motoristaQueryKey] });
            toast.success("Perfil atualizado!", "Suas informações foram salvas.");
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message || "Verifique os dados e tente novamente.";
            toast.error("Erro ao atualizar", msg);
        },
    });

    const excluirContaMutation = useMutation({
        mutationFn: async () => await AuthService.delete(),
        onSuccess: async () => {
            await LembrarLoginService.limpar();
            await signOut();
            toast.success("Conta excluída", "Seus dados pessoais foram removidos do TruckFlow.");
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message || "Verifique sua conexão e tente novamente.";
            toast.error("Não foi possível excluir", msg);
        },
    });

    return {
        atualizarPerfil: atualizarPerfilMutation.mutateAsync,
        isAtualizando: atualizarPerfilMutation.isPending,
        excluirConta: excluirContaMutation.mutateAsync,
        isExcluindo: excluirContaMutation.isPending,
    };
};
