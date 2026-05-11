import { toast } from "@/src/components/feedback/toast";
import { useState } from "react";
import { Image, ScrollView, View } from "react-native";

import { Box } from "@/components/ui/box";
import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import { EyeIcon, EyeOffIcon, Lock, User, UserCircle } from "lucide-react-native";

// Imports de Lógica
import MotoristaLoginDto from "@/src/Dtos/Motorista/motoristaLoginDto";
import { AuthService } from "@/src/services/AuthService";
import { useAuthStore } from "@/src/stores/useAuthStore";

export default function Login() {
  // 1. Estado usando o DTO diretamente
  const [form, setForm] = useState<MotoristaLoginDto>({
    login: "",
    password: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const signIn = useAuthStore(state => state.signIn);

  
  const handleChange = (key: keyof MotoristaLoginDto, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleLogin = async () => {
  
    if (!form.login || !form.password) {
      toast.warning("Campos obrigatórios", "Preencha usuário e senha para continuar.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await AuthService.login(form);

      await signIn(response.token);

      router.replace('/(app)/home');

    } catch (error: any) {
      console.error(error);
      const mensagem = error.response?.data?.message || "Usuário ou senha incorretos.";
      toast.error("Erro no login", mensagem);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="flex-1 bg-gray-50">
      
      {/* HEADER MODERNO (Igual ao Registro) */}
      <View className="bg-[#195FA0] pt-16 pb-12 px-6 rounded-b-[40px] items-center shadow-lg">
        <Image
          source={require("../../assets/images/logo.png")}
          style={{ width: 120, height: 120, tintColor: 'white' }}
          resizeMode="contain"
        />
        <Heading size="xl" className="text-white mt-4 font-bold">
          Bem-vindo Motorista
        </Heading>
        <Text className="text-blue-100 text-sm mt-1">
          Faça login para gerenciar suas cargas
        </Text>
      </View>

      <ScrollView 
        className="flex-1 px-6 -mt-8"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* CARD FLUTUANTE */}
        <Box className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <VStack space="xl">
            
            {/* Input Usuário */}
            <VStack space="xs">
              <Text size="sm" className="font-bold text-gray-600 ml-1">Usuário</Text>
              <Input variant="outline" size="xl" className="rounded-xl border-gray-200 bg-gray-50 focus:border-[#195FA0] h-12">
                <InputSlot className="pl-3">
                  <InputIcon as={UserCircle} className="text-gray-400" />
                </InputSlot>
                <InputField
                  placeholder="Seu usuário"
                  value={form.login} 
                  onChangeText={(val) => handleChange('login', val)} 
                  autoCapitalize="none"
                />
              </Input>
            </VStack>

            {/* Input Senha */}
            <VStack space="xs">
              <Text size="sm" className="font-bold text-gray-600 ml-1">Senha</Text>
              <Input variant="outline" size="xl" className="rounded-xl border-gray-200 bg-gray-50 focus:border-[#195FA0] h-12">
                <InputSlot className="pl-3">
                  <InputIcon as={Lock} className="text-gray-400" />
                </InputSlot>
                <InputField
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password} // Usando do DTO
                  onChangeText={(val) => handleChange('password', val)} // Atualizando DTO
                />
                <InputSlot className="pr-3" onPress={() => setShowPassword(!showPassword)}>
                  <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} className="text-gray-400" />
                </InputSlot>
              </Input>
            </VStack>

            {/* Botão de Entrar */}
            <Button
              size="xl"
              className="bg-[#195FA0] rounded-xl h-14 shadow-md shadow-blue-200 mt-2"
              onPress={handleLogin}
              isDisabled={isLoading}
            >
              {isLoading ? (
                <ButtonSpinner color="#fff" />
              ) : (
                <ButtonText className="font-bold text-white">ACESSAR CONTA</ButtonText>
              )}
            </Button>

            {/* Esqueci Senha */}
            <Button variant="link" size="sm" onPress={() => toast.info("Em breve", "Funcionalidade de recuperação será implementada.")}>
              <ButtonText className="text-gray-400">Esqueci minha senha</ButtonText>
            </Button>

          </VStack>
        </Box>

        {/* Botão Criar Conta (Fora do Card) */}
        <VStack className="mt-8 items-center" space="xs">
          <Text className="text-gray-500">Ainda não tem cadastro?</Text>
          <Button
            variant="outline"
            size="md"
            className="border-[#195FA0] rounded-full px-6"
            onPress={() => router.push('/(auth)/register')}
            isDisabled={isLoading}
          >
            <ButtonText className="text-[#195FA0] font-bold">Criar conta agora</ButtonText>
          </Button>
        </VStack>

      </ScrollView>
    </Box>
  );
}