import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { toast } from "../components/feedback/toast";
import NotaFiscalService from "../services/NotaFiscalService";
import { useNotaFiscalStore } from "../stores/useNotaFiscalStore";


export const useNotaFiscal = () => {
    const setNotaStore = useNotaFiscalStore((state) => state.setNotaEmConferencia);

    const uploadXmlMutation = useMutation({
        mutationFn: (fileUri: string) =>
            NotaFiscalService.parseNotaFiscalXml(fileUri),
        onSuccess: (data) => {
            setNotaStore(data);
        },
        onError: (error) => {
            console.error("Erro upload:", error);
            toast.error(
                "Falha ao ler a nota",
                "Verifique se o XML é válido e tente novamente.",
            );
        }
    });

    const salvarNotaMutation = useMutation({
        mutationFn: NotaFiscalService.saveParsedData,
        onSuccess: (data) => {
            setNotaStore(data);
            toast.success(
                "Nota validada",
                "Dados da nota fiscal validados com sucesso.",
            );
        },
        onError: (error: any) => {
            const serverError = error.response?.data;
            console.error("Erro detalhado do servidor:", JSON.stringify(serverError, null, 2));

            if (serverError?.errors) {
                const mensagens = Object.values(serverError.errors).flat().join('\n');
                toast.warning("Dados inválidos", mensagens);
            } else {
                toast.error("Falha ao salvar", "Tente novamente em instantes.");
            }
        }
    });

    const buscarNotaPorChaveMutation = useMutation({
        mutationFn: NotaFiscalService.buscarNotaPorChave,
        onSuccess: (data) => {
            console.log("RETORNO DO SAVE >>>", JSON.stringify(data, null, 2));
            setNotaStore(data);
            toast.success("Nota encontrada", "Seguindo para a conferência.");
        },
        onError: (error: any) => {
            if (error.response?.status === 404) {
                toast.show({
                    variant: "warning",
                    title: "Nota não encontrada",
                    description: "Esta nota não foi encontrada no sistema.",
                    duration: 6000,
                    action: {
                        label: "Tentar outra forma",
                        onPress: () => router.push('/(app)/agendamento/agendar'),
                    },
                });
            } else {
                toast.error(
                    "Falha ao buscar nota",
                    "Verifique sua conexão e tente novamente.",
                );
                console.error("Erro busca:", error);
            }
        }
    })

    return {
        uploadXml: uploadXmlMutation.mutateAsync,
        isUploading: uploadXmlMutation.isPending,

        salvarNota: salvarNotaMutation.mutateAsync,
        isSaving: salvarNotaMutation.isPending,

        buscarNota: buscarNotaPorChaveMutation.mutateAsync,
        isSearching: buscarNotaPorChaveMutation.isPending
    };
};