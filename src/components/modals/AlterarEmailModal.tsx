import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { FinalidadeVerificacaoEmail } from "@/src/enums/FinalidadeVerificacaoEmail";
import { AuthService } from "@/src/services/AuthService";
import { Mail, X } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
}

type Step = 1 | 2 | 3;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AlterarEmailModal({ visible, onClose }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [codigo, setCodigo] = useState("");
  const [codigoToken, setCodigoToken] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function reset() {
    setStep(1);
    setCodigo("");
    setCodigoToken("");
    setNovoEmail("");
    setErro(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleEnviarCodigo() {
    setErro(null);
    setLoading(true);
    try {
      await AuthService.enviarCodigo({ finalidade: FinalidadeVerificacaoEmail.AlterarEmail });
      setStep(2);
    } catch {
      setErro("Não foi possível enviar o código. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerificarCodigo() {
    if (codigo.trim().length !== 6) {
      setErro("Digite o código de 6 dígitos.");
      return;
    }
    setErro(null);
    setLoading(true);
    try {
      const response = await AuthService.verificarCodigo({
        codigo: codigo.trim(),
        finalidade: FinalidadeVerificacaoEmail.AlterarEmail,
      });
      setCodigoToken(response.codigoToken);
      setStep(3);
    } catch {
      setErro("Código inválido ou expirado.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAlterarEmail() {
    if (!EMAIL_REGEX.test(novoEmail.trim())) {
      setErro("Digite um e-mail válido.");
      return;
    }
    setErro(null);
    setLoading(true);
    try {
      await AuthService.alterarEmail({ codigoToken, novoEmail: novoEmail.trim() });
      handleClose();
    } catch {
      setErro("Não foi possível alterar o e-mail. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, justifyContent: "flex-end" }}
      >
        <View style={{ backgroundColor: "rgba(0,0,0,0.4)", flex: 1 }} />
        <View className="bg-white rounded-t-3xl overflow-hidden">
          {/* Header */}
          <View className="bg-[#195FA0] px-5 py-4 flex-row items-center justify-between">
            <HStack space="sm" className="items-center">
              <Icon as={Mail} size="sm" className="text-white" />
              <Text className="text-white font-bold text-base">Alterar E-mail</Text>
            </HStack>
            <Pressable onPress={handleClose}>
              <Icon as={X} size="sm" className="text-white" />
            </Pressable>
          </View>

          <VStack space="md" className="px-5 py-6">
            {/* Step indicators */}
            <HStack space="sm" className="justify-center mb-2">
              {([1, 2, 3] as Step[]).map((s) => (
                <View
                  key={s}
                  className={`h-2 rounded-full ${step >= s ? "bg-[#195FA0]" : "bg-gray-200"}`}
                  style={{ width: step >= s ? 24 : 16 }}
                />
              ))}
            </HStack>

            {step === 1 && (
              <VStack space="md">
                <Text className="text-gray-700 text-sm text-center">
                  Enviaremos um código de verificação para o e-mail atual da sua conta.
                </Text>
                {erro && <Text className="text-red-500 text-xs text-center">{erro}</Text>}
                <Pressable
                  onPress={handleEnviarCodigo}
                  disabled={loading}
                  className="bg-[#195FA0] rounded-xl py-3.5 items-center active:opacity-80"
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text className="text-white font-bold">Enviar Código</Text>
                  )}
                </Pressable>
              </VStack>
            )}

            {step === 2 && (
              <VStack space="md">
                <Text className="text-gray-700 text-sm text-center">
                  Digite o código de 6 dígitos enviado ao seu e-mail.
                </Text>
                <Input variant="outline" size="lg">
                  <InputField
                    placeholder="000000"
                    value={codigo}
                    onChangeText={setCodigo}
                    keyboardType="number-pad"
                    maxLength={6}
                    textAlign="center"
                    style={{ fontSize: 24, letterSpacing: 8 }}
                  />
                </Input>
                {erro && <Text className="text-red-500 text-xs text-center">{erro}</Text>}
                <Pressable
                  onPress={handleVerificarCodigo}
                  disabled={loading}
                  className="bg-[#195FA0] rounded-xl py-3.5 items-center active:opacity-80"
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text className="text-white font-bold">Verificar Código</Text>
                  )}
                </Pressable>
              </VStack>
            )}

            {step === 3 && (
              <VStack space="md">
                <Text className="text-gray-700 text-sm text-center">
                  Digite o novo e-mail que deseja usar na sua conta.
                </Text>
                <Input variant="outline" size="lg">
                  <InputField
                    placeholder="novo@email.com"
                    value={novoEmail}
                    onChangeText={setNovoEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </Input>
                {erro && <Text className="text-red-500 text-xs text-center">{erro}</Text>}
                <Pressable
                  onPress={handleAlterarEmail}
                  disabled={loading}
                  className="bg-[#195FA0] rounded-xl py-3.5 items-center active:opacity-80"
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text className="text-white font-bold">Confirmar Novo E-mail</Text>
                  )}
                </Pressable>
              </VStack>
            )}

            <View className="h-4" />
          </VStack>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
