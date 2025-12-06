import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { HStack } from '@/components/ui/hstack';
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";


import { ChevronDownIcon, EyeIcon, EyeOffIcon } from "lucide-react-native";
import { useState } from "react";
import { Image } from "react-native";


export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [telephone, setTelephone] = useState('');
    const [placa, setPlaca] = useState('');
    const [tipoVeiculo, setTipoVeiculo] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleRoute = () => {
        router.back();
    }

    const handleState = () => {
        setShowPassword((showState) => !showState);
    };

    return (
        <Box className="flex-1 bg-white px-4">
            <Center className="flex-1">

                <Image
                    source={require("../../assets/images/logo.png")}
                    style={{ width: 180, height: 180 }}
                />

                <VStack space="xs" className="mb-8 items-center">
                    <Heading size="2xl" className="text-gray-900">
                        Cadastro
                    </Heading>
                </VStack>

                <Card size="md"
                    variant="elevated"
                    className="w-full max-w-[400px] p-6 m-2 bg-white rounded-xl"
                >
                    <VStack space="xl">
                        <VStack space="xs">
                            <Text size="sm" className="font-medium text-gray-900">Email</Text>
                            <Input variant="outline" size="md" className="rounded-lg border-gray-300 focus:border-blue-600">
                                <InputField
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </Input>
                        </VStack>

                        <VStack space="xs">
                            <Text size="sm" className="font-medium text-gray-900">Nome</Text>
                            <Input variant="outline" size="md" className="rounded-lg border-gray-300 focus:border-blue-600">
                                <InputField
                                    placeholder="Motorista"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="none"
                                />
                            </Input>
                        </VStack>

                        <VStack space="xs">
                            <Text size="sm" className="font-medium text-gray-900">Senha</Text>
                            <Input variant="outline" size="md" className="rounded-lg border-gray-300 focus:border-blue-600">
                                <InputField
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <InputSlot className="pr-3" onPress={handleState}>
                                    <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} className="text-gray-500" />
                                </InputSlot>
                            </Input>
                        </VStack>

                        <VStack space="xs">
                            <Text size="sm" className="font-medium text-gray-900">Repita a Senha</Text>
                            <Input variant="outline" size="md" className="rounded-lg border-gray-300 focus:border-blue-600">
                                <InputField
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <InputSlot className="pr-3" onPress={handleState}>
                                    <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} className="text-gray-500" />
                                </InputSlot>
                            </Input>
                        </VStack>

                        <VStack space="xs">
                            <Text size="sm" className="font-medium text-gray-900">Telefone</Text>
                            <Input variant="outline" size="md" className="rounded-lg border-gray-300 focus:border-blue-600">
                                <InputField
                                    placeholder="999999999"
                                    value={telephone}
                                    onChangeText={setTelephone}
                                    autoCapitalize="none"
                                />
                            </Input>
                        </VStack>

                        <VStack space="xs">
                            <Text size="sm" className="font-medium text-gray-900">Placa do Veículo</Text>
                            <Input variant="outline" size="md" className="rounded-lg border-gray-300 focus:border-blue-600">
                                <InputField
                                    placeholder="Placa"
                                    value={placa}
                                    onChangeText={setPlaca}
                                    autoCapitalize="none"
                                />
                            </Input>
                        </VStack>

                        <VStack space="xs">
                            <Text size="sm" className="font-medium text-gray-900">Tipo De Veículo</Text>
                            <Select>
                                <SelectTrigger variant="outline" size="md">
                                    <SelectInput placeholder="Select option" />
                                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                                </SelectTrigger>
                                <SelectPortal>
                                    <SelectBackdrop />
                                    <SelectContent>
                                        <SelectDragIndicatorWrapper>
                                            <SelectDragIndicator />
                                        </SelectDragIndicatorWrapper>
                                        <SelectItem label="UX Research" value="ux" />
                                        <SelectItem label="Web Development" value="web" />
                                        <SelectItem
                                            label="Cross Platform Development Process"
                                            value="Cross Platform Development Process"
                                        />
                                        <SelectItem label="UI Designing" value="ui" isDisabled={true} />
                                        <SelectItem label="Backend Development" value="backend" />
                                    </SelectContent>
                                </SelectPortal>
                            </Select>
                        </VStack>

                        <HStack space="md" className="w-full mt-4">
                            <Button
                                className="flex-1 bg-gray-300 rounded-lg"
                                onPress={handleRoute}
                                >
                                <ButtonText className="font-bold text-black">VOLTAR</ButtonText>
                            </Button>

                            <Button className="flex-1 bg-blue-600 rounded-lg">
                                <ButtonText className="font-bold">CADASTRAR</ButtonText>
                            </Button>
                        </HStack>
                    </VStack>
                </Card>
            </Center >
        </Box>
    )
}