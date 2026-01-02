import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import NotaFiscalService from "../services/NotaFiscalService";
import { useNotaFiscalStore } from "../stores/useNotaFiscalStore";


export const useNotaFiscal = () => {
    const setNotaStore = useNotaFiscalStore((state) => state.setNotaEmConferencia);

    const uploadXmlMutation = useMutation({
        mutationFn: (fileUri: string) => NotaFiscalService.parseNotaFiscalXml(fileUri),
        onSuccess: (data) => {
            // Guarda no Zustand para uso em outras telas.
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
            Alert.alert("Sucesso", "Nota fiscal agendada com sucesso!");
        },
        onError: (error: any) => {
            const serverError = error.response?.data;
            console.error("Erro detalhado do servidor:", JSON.stringify(serverError, null, 2));

            // Se for erro de validação do FluentValidation, ele retorna um array de erros
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
            Alert.alert("Sucesso, nota salva com sucesso");
        },
        onError: (error) => {
            console.error("erro:", error);
            Alert.alert("Erro ao buscar a nota por digito, verifique se está correto.");
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