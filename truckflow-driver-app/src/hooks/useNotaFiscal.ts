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
        onSuccess: () => {
            Alert.alert("Sucesso", "Nota fiscal agendada com sucesso!");
        },
        onError: (error) => {
            console.error("Erro salvar:", error);
            Alert.alert("Erro", "Falha ao salvar os dados da nota.");
        }
    });

    const buscarNotaPorChaveMutation = useMutation({
        mutationFn: NotaFiscalService.buscarNotaPorChave,
        onSuccess: (data) => {
            Alert.alert("Sucesso, nota salva com sucesso");
            setNotaStore(data);
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