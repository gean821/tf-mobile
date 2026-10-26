import { useMutation } from "@tanstack/react-query";
import { toast } from "../components/feedback/toast";
import MotoristaLoginDto from "../Dtos/Motorista/motoristaLoginDto";
import MotoristaRegisterDto from "../Dtos/Motorista/motoristaRegisterDto";
import { AuthService } from "../services/AuthService";
import LembrarLoginService from "../services/LembrarLoginService";
import { useAuthStore } from "../stores/useAuthStore";

type LoginParams = MotoristaLoginDto & {
    lembrar: boolean;
    viaBiometria?: boolean;
};

const mensagemDaApi = (error: any, fallback: string): string => {
    const msg: string | undefined = error?.response?.data?.message;
    return msg ? msg.split(" | ").join("\n") : fallback;
};

export const useAuth = () => {
    const signIn = useAuthStore((s) => s.signIn);

    const loginMutation = useMutation({
        mutationFn: async ({ lembrar, viaBiometria, ...dto }: LoginParams) => {
            const response = await AuthService.login(dto);
            await signIn(response.token, response.refreshToken, response.tokenExpiresAt);

            if (lembrar && !viaBiometria) {
                await LembrarLoginService.salvar(dto.login, dto.password);
            } else if (!lembrar) {
                await LembrarLoginService.limpar();
            }

            return response;
        },
        onError: async (error: any, params) => {
            if (params.viaBiometria && error?.response?.status === 401) {
                await LembrarLoginService.limparSenha();
                toast.error("Senha salva desatualizada", "Entre com sua senha atual para salvar de novo.");
                return;
            }
            toast.error("Erro no login", mensagemDaApi(error, "Usuário ou senha incorretos."));
        },
    });

    const registerMutation = useMutation({
        mutationFn: async (dto: MotoristaRegisterDto) => await AuthService.register(dto),
        onSuccess: () => {
            toast.success("Conta criada!", "Faça login para continuar.");
        },
        onError: (error: any) => {
            toast.error("Não foi possível criar a conta", mensagemDaApi(error, "Verifique os dados e tente novamente."));
        },
    });

    return {
        login: loginMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        register: registerMutation.mutateAsync,
        isRegistering: registerMutation.isPending,
    };
};
