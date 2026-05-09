import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";
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
            Alert.alert("Erro", "Falha ao ler a nota fiscal. Verifique se o XML é válido.");
        }
    });

    const salvarNotaMutation = useMutation({
        mutationFn: NotaFiscalService.saveParsedData,
        onSuccess: (data) => {
            setNotaStore(data);
            Alert.alert("Sucesso", "Dados da nota fiscal validados com sucesso!");
        },
        onError: (error: any) => {
            const serverError = error.response?.data;
            console.error("Erro detalhado do servidor:", JSON.stringify(serverError, null, 2));

            if (serverError?.errors) {
                const mensagens = Object.values(serverError.errors).flat().join('\n');
                Alert.alert("Dados Inválidos", mensagens);
            } else {
                Alert.alert("Erro", "Falha ao salvar. Verifique o console.");
            }
        }
    });

    const buscarNotaPorChaveMutation = useMutation({
        mutationFn: NotaFiscalService.buscarNotaPorChave,
        onSuccess: (data) => {
            console.log("RETORNO DO SAVE >>>", JSON.stringify(data, null, 2));
            setNotaStore(data);
            Alert.alert("Sucesso, nota encontrada com sucesso");
        },
        onError: (error: any) => {
            if (error.response?.status === 404) {
                Alert.alert(
                    "Nota não encontrada",
                    "Esta nota não foi encontrada no sistema. Tente de outra forma.",
                    [
                        { text: "Cancelar", style: "cancel" },
                        {
                            text: "Tentar de outra forma",
                            onPress: () => {
                                router.push('/(app)/agendamento/agendar')
                            }
                        }
                    ]
                );
            } else {
                Alert.alert("Erro", "Falha ao buscar a nota. Verifique sua conexão.");
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