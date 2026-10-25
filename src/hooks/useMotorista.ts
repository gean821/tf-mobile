import { useMutation } from "@tanstack/react-query";
import { toast } from "../components/feedback/toast";
import { AuthService } from "../services/AuthService";
import { useAuthStore } from "../stores/useAuthStore";

export const useMotorista = () => {
    const signOut = useAuthStore((s) => s.signOut);

    const excluirContaMutation = useMutation({
        mutationFn: async () => await AuthService.delete(),
        onSuccess: async () => {
            await signOut();
            toast.success("Conta excluída", "Seus dados pessoais foram removidos do TruckFlow.");
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message || "Verifique sua conexão e tente novamente.";
            toast.error("Não foi possível excluir", msg);
        },
    });

    return {
        excluirConta: excluirContaMutation.mutateAsync,
        isExcluindo: excluirContaMutation.isPending,
    };
};
