import { useRouter } from "expo-router";
import { ArrowLeft, Phone, User, UserCircle } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import { Box } from "@/components/ui/box";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useMotorista } from "@/src/hooks/useMotorista";
import { useMotoristaProfileQuery } from "@/src/queries/motorista.queries";
import { formatarTelefone, somenteDigitos } from "@/src/utils/telefone";

export default function EditarPerfil() {
  const router = useRouter();
  const { data: profile } = useMotoristaProfileQuery();
  const { atualizarPerfil, isAtualizando: isLoading } = useMotorista();

  const [nomeReal, setNomeReal] = useState("");
  const [username, setUsername] = useState("");
  const [telefone, setTelefone] = useState("");

  useEffect(() => {
    if (!profile) return;
    setNomeReal(profile.nomeReal ?? "");
    setUsername(profile.username ?? "");
    setTelefone(formatarTelefone(profile.telefone ?? ""));
  }, [profile]);

  const handleSave = async () => {
    const digitos = somenteDigitos(telefone);
    try {
      await atualizarPerfil({
        ...(nomeReal && { nomeReal }),
        ...(username && { username }),
        ...(digitos && { telefone: digitos }),
      });
      router.back();
    } catch {}
  };

  return (
    <Box className="flex-1 bg-gray-50">
      <View className="bg-primary-500 pt-6 pb-10 px-6 rounded-b-[40px] relative overflow-hidden">
        <View
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5"
          pointerEvents="none"
        />
        <View
          className="absolute top-20 -left-12 w-32 h-32 rounded-full bg-white/5"
          pointerEvents="none"
        />

        <HStack className="items-center mb-4" space="sm">
          <Pressable
            onPress={() => router.back()}
            className="bg-white/20 p-2 rounded-full active:bg-white/30"
          >
            <Icon as={ArrowLeft} color="white" size="md" />
          </Pressable>
          <Text className="text-white text-lg font-semibold">
            Editar Perfil
          </Text>
        </HStack>

        <Heading size="xl" className="text-white font-bold">
          Suas Informações
        </Heading>
        <Text className="text-blue-100 text-sm mt-1">
          Atualize seus dados cadastrais
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6 -mt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Box className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <VStack space="xl">
            <VStack space="xs">
              <Text size="sm" className="font-bold text-gray-600 ml-1">
                Nome Completo
              </Text>
              <Input
                variant="outline"
                size="xl"
                className="rounded-xl border-gray-200 bg-gray-50 h-12"
              >
                <InputSlot className="pl-3">
                  <InputIcon as={User} className="text-gray-400" />
                </InputSlot>
                <InputField
                  placeholder="Seu nome completo"
                  value={nomeReal}
                  onChangeText={setNomeReal}
                  autoCapitalize="words"
                />
              </Input>
            </VStack>

            <VStack space="xs">
              <Text size="sm" className="font-bold text-gray-600 ml-1">
                Usuário (Login)
              </Text>
              <Input
                variant="outline"
                size="xl"
                className="rounded-xl border-gray-200 bg-gray-50 h-12"
              >
                <InputSlot className="pl-3">
                  <InputIcon as={UserCircle} className="text-gray-400" />
                </InputSlot>
                <InputField
                  placeholder="seu.usuario"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </Input>
            </VStack>

            <VStack space="xs">
              <Text size="sm" className="font-bold text-gray-600 ml-1">
                Celular / WhatsApp
              </Text>
              <Input
                variant="outline"
                size="xl"
                className="rounded-xl border-gray-200 bg-gray-50 h-12"
              >
                <InputSlot className="pl-3">
                  <InputIcon as={Phone} className="text-gray-400" />
                </InputSlot>
                <InputField
                  placeholder="(00) 90000-0000"
                  value={telefone}
                  onChangeText={(valor) => setTelefone(formatarTelefone(valor))}
                  keyboardType="phone-pad"
                  maxLength={15}
                />
              </Input>
            </VStack>

            <VStack space="md" className="mt-2">
              <Button
                size="xl"
                className="bg-primary-500 rounded-xl h-14 shadow-md shadow-blue-200"
                onPress={handleSave}
                isDisabled={isLoading}
              >
                {isLoading ? (
                  <ButtonSpinner color="#fff" />
                ) : (
                  <ButtonText className="font-bold text-white">
                    SALVAR ALTERAÇÕES
                  </ButtonText>
                )}
              </Button>

              <Button
                variant="link"
                onPress={() => router.back()}
                isDisabled={isLoading}
              >
                <ButtonText className="text-gray-500 font-medium">
                  Cancelar
                </ButtonText>
              </Button>
            </VStack>
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  );
}
