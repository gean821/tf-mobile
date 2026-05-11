import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@/components/ui/modal";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { toast } from "@/src/components/feedback/toast";
import * as Clipboard from 'expo-clipboard';
import { Clipboard as IconClipboard, X } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";

export default interface KeyInputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (key: string) => void;
    isLoading: boolean;
}

export const KeyInputModal = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading }: KeyInputModalProps) => {

    const [key, setKey] = useState('');

    const handleConfirm = () => {
        const cleanKey = key.replace(/\D/g, '');

        if (cleanKey.length !== 44) {
            toast.warning(
                "Chave inválida",
                `A chave deve ter 44 dígitos. Você digitou ${cleanKey.length}.`,
            );
            return;
        }

        onConfirm(cleanKey);
    }

    const handlePaste = async () => {
        const text = await Clipboard.getStringAsync();

        if (text) {
            setKey(text.replace(/\D/g, ''));
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            // Evita fechar clicando fora se estiver carregando
            closeOnOverlayClick={!isLoading}
        >
            <ModalBackdrop />

            {/* O KeyboardAvoidingView garante que o modal suba */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ width: '100%', alignItems: 'center' }}
            >
                <ModalContent className="bg-white rounded-2xl w-[90%] max-w-[400px]">
                    <ModalHeader className="flex-row justify-between items-center p-4 border-b border-gray-100">
                        <Heading size="md" className="text-gray-800">Digitar Chave</Heading>
                        <Pressable onPress={onClose} disabled={isLoading}>
                            <Icon as={X} className="text-gray-400" />
                        </Pressable>
                    </ModalHeader>

                    <ModalBody className="p-4">
                        <Text className="text-gray-500 mb-2 text-sm">
                            Insira os 44 dígitos da DANFE:
                        </Text>

                        <Input className="h-12 border-gray-300 rounded-lg mb-2 bg-gray-50">
                            <InputField
                                placeholder="0000 0000 0000..."
                                keyboardType="numeric"
                                value={key}
                                onChangeText={setKey}
                                maxLength={44}
                                className="text-sm font-medium"
                                autoFocus={true} // Foco automático ao abrir
                            />
                        </Input>

                        <Pressable onPress={handlePaste} className="self-end py-2">
                            <HStack space="xs" className="items-center">
                                <Icon as={IconClipboard} size="xs" className="text-[#195FA0]" />
                                <Text className="text-[#195FA0] font-bold text-xs">Colar da área de transferência</Text>
                            </HStack>
                        </Pressable>
                    </ModalBody>

                    <ModalFooter className="p-4 border-t border-gray-100 flex-row justify-end">
                        <Button
                            size="md"
                            variant="outline"
                            action="secondary"
                            className="mr-3 border-gray-300"
                            onPress={onClose}
                            isDisabled={isLoading}
                        >
                            <ButtonText className="text-gray-600">Cancelar</ButtonText>
                        </Button>

                        <Button
                            size="md"
                            className="bg-[#195FA0]"
                            onPress={handleConfirm}
                            isDisabled={isLoading}
                        >
                            {isLoading ? (
                                <ButtonSpinner color="#fff" />
                            ) : (
                                <ButtonText>Buscar Nota</ButtonText>
                            )}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </KeyboardAvoidingView>
        </Modal>
    );
}

