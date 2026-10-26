import { toast } from "@/src/components/feedback/toast";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

import { Box } from "@/components/ui/box";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import {
  CheckSquare,
  EyeIcon,
  EyeOffIcon,
  Fingerprint,
  Lock,
  Square,
  UserCircle,
} from "lucide-react-native";

import MotoristaLoginDto from "@/src/Dtos/Motorista/motoristaLoginDto";
import { useAuth } from "@/src/hooks/useAuth";
import LembrarLoginService from "@/src/services/LembrarLoginService";

export default function Login() {
  const [form, setForm] = useState<MotoristaLoginDto>({
    login: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [loginSalvo, setLoginSalvo] = useState<string | null>(null);
  const [temBiometria, setTemBiometria] = useState(false);
  const biometriaTentada = useRef(false);

  const { login, isLoggingIn } = useAuth();

  const handleChange = (key: keyof MotoristaLoginDto, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const entrarComBiometria = async (usuario: string) => {
    const senha = await LembrarLoginService.obterSenhaComBiometria();
    if (!senha) return;

    try {
      await login({
        login: usuario,
        password: senha,
        lembrar: true,
        viaBiometria: true,
      });
      router.replace("/(app)/home");
    } catch {
      setTemBiometria(await LembrarLoginService.temSenhaSalva());
    }
  };

  useEffect(() => {
    (async () => {
      const usuario = await LembrarLoginService.obterLogin();
      if (!usuario) {
        return;
      }

      setLoginSalvo(usuario);
      setLembrar(true);
      setForm((prev) => ({ ...prev, login: usuario }));

      const biometria = await LembrarLoginService.temSenhaSalva();
      setTemBiometria(biometria);

      if (biometria && !biometriaTentada.current) {
        biometriaTentada.current = true;
        entrarComBiometria(usuario);
      }
    })();
  }, []);

  const handleLogin = async () => {
    if (!form.login || !form.password) {
      toast.warning(
        "Campos obrigatórios",
        "Preencha usuário e senha para continuar.",
      );
      return;
    }

    try {
      await login({ ...form, login: form.login.trim(), lembrar });
      router.replace("/(app)/home");
    } catch {}
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Box className="flex-1 bg-gray-50">
        <View className="bg-primary-500 pt-16 pb-12 px-6 rounded-b-[40px] items-center shadow-lg">
          <Image
            source={require("../../assets/images/logo.png")}
            style={{ width: 120, height: 120, tintColor: "white" }}
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
          keyboardShouldPersistTaps="handled"
        >
          <Box className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <VStack space="xl">
              <VStack space="xs">
                <Text size="sm" className="font-bold text-gray-600 ml-1">
                  Usuário
                </Text>
                <Input
                  variant="outline"
                  size="xl"
                  className="rounded-xl border-gray-200 bg-gray-50 focus:border-primary-500 h-12"
                >
                  <InputSlot className="pl-3">
                    <InputIcon as={UserCircle} className="text-gray-400" />
                  </InputSlot>
                  <InputField
                    placeholder="Seu usuário"
                    value={form.login}
                    onChangeText={(val) => handleChange("login", val)}
                    autoCapitalize="none"
                  />
                </Input>
              </VStack>

              <VStack space="xs">
                <Text size="sm" className="font-bold text-gray-600 ml-1">
                  Senha
                </Text>
                <Input
                  variant="outline"
                  size="xl"
                  className="rounded-xl border-gray-200 bg-gray-50 focus:border-primary-500 h-12"
                >
                  <InputSlot className="pl-3">
                    <InputIcon as={Lock} className="text-gray-400" />
                  </InputSlot>
                  <InputField
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChangeText={(val) => handleChange("password", val)}
                  />
                  <InputSlot
                    className="pr-3"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <InputIcon
                      as={showPassword ? EyeIcon : EyeOffIcon}
                      className="text-gray-400"
                    />
                  </InputSlot>
                </Input>
              </VStack>

              <Pressable
                onPress={() => setLembrar((v) => !v)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: lembrar }}
                className="-mt-2"
              >
                <HStack space="sm" className="items-center">
                  <Icon
                    as={lembrar ? CheckSquare : Square}
                    size="md"
                    className={lembrar ? "text-primary-500" : "text-gray-400"}
                  />
                  <Text size="sm" className="text-gray-600">
                    Lembrar-me
                  </Text>
                </HStack>
              </Pressable>

              <Button
                size="xl"
                className="bg-primary-500 rounded-xl h-14 shadow-md shadow-blue-200 mt-2"
                onPress={handleLogin}
                isDisabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <ButtonSpinner color="#fff" />
                ) : (
                  <ButtonText className="font-bold text-white">
                    ACESSAR CONTA
                  </ButtonText>
                )}
              </Button>

              {temBiometria && loginSalvo && (
                <Button
                  variant="outline"
                  size="xl"
                  className="border-primary-500 rounded-xl h-14"
                  onPress={() => entrarComBiometria(loginSalvo)}
                  isDisabled={isLoggingIn}
                >
                  <Icon
                    as={Fingerprint}
                    size="md"
                    className="text-primary-500 mr-2"
                  />
                  <ButtonText className="font-bold text-primary-500">
                    ENTRAR COM BIOMETRIA
                  </ButtonText>
                </Button>
              )}

              <Button
                variant="link"
                size="sm"
                onPress={() =>
                  toast.info(
                    "Em breve",
                    "Funcionalidade de recuperação será implementada.",
                  )
                }
              >
                <ButtonText className="text-gray-400">
                  Esqueci minha senha
                </ButtonText>
              </Button>
            </VStack>
          </Box>

          <VStack className="mt-8 items-center" space="xs">
            <Text className="text-gray-500">Ainda não tem cadastro?</Text>
            <Button
              variant="outline"
              size="md"
              className="border-primary-500 rounded-full px-6"
              onPress={() => router.push("/(auth)/register")}
              isDisabled={isLoggingIn}
            >
              <ButtonText className="text-primary-500 font-bold">
                Criar conta agora
              </ButtonText>
            </Button>
          </VStack>
        </ScrollView>
      </Box>
    </KeyboardAvoidingView>
  );
}
