import * as DocumentPicker from 'expo-document-picker'; // Agora seguro de usar!
import { useRouter } from "expo-router";
import {
    Camera,
    FileText,
    FileUp,
    Keyboard
} from "lucide-react-native";
import React, { useState } from 'react';
import { Alert, ScrollView, View } from "react-native";

import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { OptionCard } from '@/src/components/cards/optionCard';
import { KeyInputModal } from '@/src/components/modals/keyInputModal';
import { useNotaFiscal } from '@/src/hooks/useNotaFiscal';

export default function Agendar() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const { isUploading, uploadXml, buscarNota, salvarNota, isSaving, isSearching} = useNotaFiscal();
    
    const handleUploadFile = async () => { 
        if (isUploading) {
            return;
        }

        try {
            console.log("Iniciando picker...");
            
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/xml', 'text/xml'],
                copyToCacheDirectory: true,
            });

            if (result.canceled) {
                console.log("Cancelado pelo usuário");
                return;
            }
            
            const xmlUpload =  await uploadXml(result.assets[0].uri);
            
            if (xmlUpload) {
                router.push('/(app)/agendamento/conferencia')
            }

        } catch (err) {
            console.error("Erro no picker:", err);
            Alert.alert("Erro", "Não foi possível selecionar o arquivo.");
        }
    };

    const handleTypeKey = () => {
        setIsOpen(true);
    }

    const onConfirmKey = async (chave: string) => {
        await buscarNota(chave);
        setIsOpen(false);
    }

    // 2. Ação: Ler Código de Barras
    const handleScanBarcode = () => {
        // Futuramente levaremos para a tela de câmera
        Alert.alert("Scanner", "Vamos implementar a câmera na próxima etapa!");
    };

    // 4. Ação: Manual (Fallback)
    const handleManualEntry = () => {
        // router.push("/agendamento/formulario-manual");
        router.push('/(app)/agendamento/conferencia')
     };

    return (
        <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ paddingBottom: 40 }}>
            <KeyInputModal 
                isLoading={isSearching}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={onConfirmKey}
            />            

            <View className="bg-[#195FA0] pt-12 pb-8 px-6 rounded-b-[30px]">
                <Text className="text-white font-bold text-2xl">Nova Carga</Text>
                <Text className="text-blue-100 mt-1">
                    Como deseja informar os dados da Nota Fiscal?
                </Text>
            </View>

            <VStack className="px-6 -mt-6" space="md">

                <OptionCard
                    icon={Camera}
                    title="Ler Código de Barras"
                    subtitle="Aponte a câmera para o código da DANFE"
                    onPress={handleScanBarcode}
                    isPrimary={true}
                />

                <OptionCard
                    icon={FileUp}
                    title="Carregar XML"
                    subtitle="Se você tem o arquivo no celular"
                    onPress={handleUploadFile}
                    disabled={isUploading}
                />

                <OptionCard
                    icon={Keyboard}
                    title="Digitar Chave"
                    subtitle="Insira os 44 dígitos da chave de acesso"
                    onPress={handleTypeKey}
                />

                <HStack className="items-center justify-center my-4 opacity-50">
                    <View className="h-[1px] bg-gray-300 flex-1" />
                    <Text className="mx-4 text-gray-500 text-xs font-bold uppercase">Ou</Text>
                    <View className="h-[1px] bg-gray-300 flex-1" />
                </HStack>

                <Pressable
                    onPress={handleManualEntry}
                    className="p-4 border border-dashed border-gray-400 rounded-xl active:bg-gray-100"
                >
                    <HStack className="justify-center items-center" space="sm">
                        <Icon as={FileText} size="sm" className="text-gray-600" />
                        <Text className="text-gray-600 font-bold">
                            Preencher manualmente (Sem Nota)
                        </Text>
                    </HStack>
                </Pressable>

            </VStack>
        </ScrollView>
    );
}