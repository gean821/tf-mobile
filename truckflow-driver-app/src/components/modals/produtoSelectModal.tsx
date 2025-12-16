import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalHeader } from "@/components/ui/modal";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useProduto } from "@/src/hooks/useProduto";
import { Package, Search, X } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, FlatList, View } from 'react-native';
import IProduto from '../../Entities/IProduto';


export default interface ProdutoSelectModalProps {
    isOpen: boolean,
    onClose: () => void;
    onSelect: (produtoId: string, nome: string) => void;
}

export const ProdutoSelectModal = ({
    isOpen,
    onClose,
    onSelect
}: ProdutoSelectModalProps) => {
    const { produtos, isLoadingProdutos } = useProduto();
    const [search, setSearch] = useState('');

    const filteredProducts = produtos ? produtos.filter(x =>
        x.nome.toLowerCase().includes(search.toLowerCase())
    ) : [];

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalBackdrop />
            <ModalContent className="bg-white h-[80%] w-[95%] rounded-2xl">
                <ModalHeader className="border-b border-gray-100 p-4 flex-row justify-between items-center">
                    <Heading size="md">Selecionar Produto</Heading>
                    <Pressable onPress={onClose}>
                        <Icon as={X} className="text-gray-400" />
                    </Pressable>
                </ModalHeader>

                <ModalBody className="p-0 flex-1">
                    <VStack className="p-4 border-b border-gray-100 bg-gray-50">
                        <Input className="bg-white border-gray-300 rounded-lg">
                            <InputField
                                placeholder="Buscar produto..."
                                value={search}
                                onChangeText={setSearch}
                                autoFocus
                            />
                            <Icon as={Search} className="mr-3 text-gray-400" />
                        </Input>
                    </VStack>

                    {isLoadingProdutos ? (
                        <ActivityIndicator className="mt-10" color="#195FA0" />
                    ) : (
                        <FlatList<IProduto>
                            data={filteredProducts}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ padding: 16 }}
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() => onSelect(item.id, item.nome)}
                                    className="p-4 border-b border-gray-100 active:bg-blue-50 flex-row items-center"
                                >
                                    <View className="bg-blue-100 p-2 rounded-full mr-3">
                                        <Icon as={Package} size="sm" className="text-blue-600" />
                                    </View>
                                    <Text className="text-gray-800 font-medium text-md">{item.nome}</Text>
                                </Pressable>
                            )}
                            ListEmptyComponent={
                                <Text className="text-center text-gray-400 mt-10">Nenhum produto encontrado</Text>
                            }
                        />
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );

}



