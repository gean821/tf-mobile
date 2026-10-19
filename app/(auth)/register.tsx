import { Box } from "@/components/ui/box";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button"; // Adicionei Spinner
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { toast } from "@/src/components/feedback/toast";
import { AuthService } from "@/src/services/AuthService";
import { router } from "expo-router";
import {
    EyeIcon,
    EyeOffIcon,
    Lock,
    Mail,
    Phone,
    User,
    UserCircle,
} from "lucide-react-native";
import { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    View,
} from "react-native";

type CampoObrigatorio =
  | "nomeReal"
  | "username"
  | "email"
  | "telephone"
  | "password";

export default function Register() {
  const [username, setUsername] = useState("");
  const [nomeReal, setNomeReal] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telephone, setTelephone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState<
    Partial<Record<CampoObrigatorio, boolean>>
  >({});

  const markTouched = (campo: CampoObrigatorio) =>
    setTouched((prev) => ({ ...prev, [campo]: true }));

  const temErro = (campo: CampoObrigatorio, valor: string) =>
    !!touched[campo] && valor.trim().length === 0;

  const inputBorderClass = (campo: CampoObrigatorio, valor: string) =>
    temErro(campo, valor) ? "border-red-500" : "border-gray-200";

  const handleRegister = async () => {
    if (!username || !email || !nomeReal || !password || !telephone) {
      setTouched({
        nomeReal: true,
        username: true,
        email: true,
        telephone: true,
        password: true,
      });
      toast.warning(
        "Campos obrigatórios",
        "Preencha todos os campos para continuar.",
      );
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.register({
        username: username,
        email: email,
        nomeReal: nomeReal,
        password: password,
        telefone: telephone,
      });

      toast.success("Conta criada!", "Faça login para continuar.");
      router.replace("/(auth)/login");
    } catch (error: any) {
      console.error(error);
      toast.error(
        "Erro ao criar conta",
        "Verifique os dados e tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Box className="flex-1 bg-gray-50">
        <View className="bg-primary-500 pt-16 pb-10 px-6 rounded-b-[40px] items-center shadow-lg">
          <Image
            source={require("../../assets/images/logo.png")}
            style={{ width: 120, height: 120, tintColor: "white" }} // Dica: Logo branco fica top no fundo azul
            resizeMode="contain"
          />
          <Heading size="xl" className="text-white mt-4 font-bold">
            Crie sua Conta
          </Heading>
          <Text className="text-blue-100 text-sm mt-1">
            Junte-se ao TruckFlow e agilize suas viagens
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-6 -mt-6"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Box className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <VStack space="xl">
              <VStack space="xs">
                <Text size="sm" className="font-bold text-gray-600 ml-1">
                  Nome Completo <Text className="text-red-500">*</Text>
                </Text>
                <Input
                  variant="outline"
                  size="xl"
                  className={`rounded-xl bg-gray-50 focus:border-primary-500 h-12 ${inputBorderClass("nomeReal", nomeReal)}`}
                >
                  <InputSlot className="pl-3">
                    <InputIcon as={User} className="text-gray-400" />
                  </InputSlot>
                  <InputField
                    placeholder="Ex: João da Silva"
                    value={nomeReal}
                    onChangeText={setNomeReal}
                    onBlur={() => markTouched("nomeReal")}
                    autoCapitalize="words"
                  />
                </Input>
                {temErro("nomeReal", nomeReal) && (
                  <Text size="xs" className="text-red-500 ml-1">
                    Campo obrigatório
                  </Text>
                )}
              </VStack>

              <VStack space="xs">
                <Text size="sm" className="font-bold text-gray-600 ml-1">
                  Usuário (Login) <Text className="text-red-500">*</Text>
                </Text>
                <Input
                  variant="outline"
                  size="xl"
                  className={`rounded-xl bg-gray-50 focus:border-primary-500 h-12 ${inputBorderClass("username", username)}`}
                >
                  <InputSlot className="pl-3">
                    <InputIcon as={UserCircle} className="text-gray-400" />
                  </InputSlot>
                  <InputField
                    placeholder="joao.silva"
                    value={username}
                    onChangeText={setUsername}
                    onBlur={() => markTouched("username")}
                    autoCapitalize="none"
                  />
                </Input>
                {temErro("username", username) && (
                  <Text size="xs" className="text-red-500 ml-1">
                    Campo obrigatório
                  </Text>
                )}
              </VStack>

              <VStack space="xs">
                <Text size="sm" className="font-bold text-gray-600 ml-1">
                  Email <Text className="text-red-500">*</Text>
                </Text>
                <Input
                  variant="outline"
                  size="xl"
                  className={`rounded-xl bg-gray-50 focus:border-primary-500 h-12 ${inputBorderClass("email", email)}`}
                >
                  <InputSlot className="pl-3">
                    <InputIcon as={Mail} className="text-gray-400" />
                  </InputSlot>
                  <InputField
                    placeholder="joao@email.com"
                    value={email}
                    onChangeText={setEmail}
                    onBlur={() => markTouched("email")}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </Input>
                {temErro("email", email) && (
                  <Text size="xs" className="text-red-500 ml-1">
                    Campo obrigatório
                  </Text>
                )}
              </VStack>

              <VStack space="xs">
                <Text size="sm" className="font-bold text-gray-600 ml-1">
                  Celular / WhatsApp <Text className="text-red-500">*</Text>
                </Text>
                <Input
                  variant="outline"
                  size="xl"
                  className={`rounded-xl bg-gray-50 focus:border-primary-500 h-12 ${inputBorderClass("telephone", telephone)}`}
                >
                  <InputSlot className="pl-3">
                    <InputIcon as={Phone} className="text-gray-400" />
                  </InputSlot>
                  <InputField
                    placeholder="(00) 90000-0000"
                    value={telephone}
                    onChangeText={setTelephone}
                    onBlur={() => markTouched("telephone")}
                    keyboardType="phone-pad"
                  />
                </Input>
                {temErro("telephone", telephone) && (
                  <Text size="xs" className="text-red-500 ml-1">
                    Campo obrigatório
                  </Text>
                )}
              </VStack>

              <VStack space="xs">
                <Text size="sm" className="font-bold text-gray-600 ml-1">
                  Senha <Text className="text-red-500">*</Text>
                </Text>
                <Input
                  variant="outline"
                  size="xl"
                  className={`rounded-xl bg-gray-50 focus:border-primary-500 h-12 ${inputBorderClass("password", password)}`}
                >
                  <InputSlot className="pl-3">
                    <InputIcon as={Lock} className="text-gray-400" />
                  </InputSlot>
                  <InputField
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    onBlur={() => markTouched("password")}
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
                {temErro("password", password) && (
                  <Text size="xs" className="text-red-500 ml-1">
                    Campo obrigatório
                  </Text>
                )}
              </VStack>

              <VStack space="md" className="mt-4">
                <Button
                  size="xl"
                  className="bg-primary-500 rounded-xl h-14 shadow-md shadow-blue-200"
                  onPress={handleRegister}
                  isDisabled={isLoading}
                >
                  {isLoading ? (
                    <ButtonSpinner color="#fff" />
                  ) : (
                    <ButtonText className="font-bold text-white">
                      CRIAR CONTA
                    </ButtonText>
                  )}
                </Button>

                <Button
                  variant="link"
                  onPress={() => router.back()}
                  isDisabled={isLoading}
                >
                  <ButtonText className="text-gray-500 font-medium">
                    Já tenho uma conta. Fazer Login
                  </ButtonText>
                </Button>
              </VStack>
            </VStack>
          </Box>
        </ScrollView>
      </Box>
    </KeyboardAvoidingView>
  );
}
