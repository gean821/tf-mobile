import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { FinalidadeVerificacaoEmail } from "@/src/enums/FinalidadeVerificacaoEmail";
import { AuthService } from "@/src/services/AuthService";
import { EyeIcon, EyeOffIcon, Lock, X } from "lucide-react-native";
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

export function AlterarSenhaModal({ visible, onClose }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [codigo, setCodigo] = useState("");
  const [codigoToken, setCodigoToken] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [showNova, setShowNova] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  function reset() {
    setStep(1);
    setCodigo("");
    setCodigoToken("");
    setNovaSenha("");
    setConfirmarSenha("");
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
      await AuthService.enviarCodigo({ finalidade: FinalidadeVerificacaoEmail.AlterarSenha });
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
        finalidade: FinalidadeVerificacaoEmail.AlterarSenha,
      });
      setCodigoToken(response.codigoToken);
      setStep(3);
    } catch {
      setErro("Código inválido ou expirado.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAlterarSenha() {
    if (!novaSenha || novaSenha.length < 6) {
      setErro("A senha deve ter ao menos 6 caracteres.");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }
    setErro(null);
    setLoading(true);
    try {
      await AuthService.alterarSenha({ codigoToken, novaSenha, confirmarSenha });
      handleClose();
    } catch {
      setErro("Não foi possível alterar a senha. Tente novamente.");
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
              <Icon as={Lock} size="sm" className="text-white" />
              <Text className="text-white font-bold text-base">Alterar Senha</Text>
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
                  Enviaremos um código de verificação para o e-mail cadastrado na sua conta.
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
                <Input variant="outline" size="lg">
                  <InputField
                    placeholder="Nova senha"
                    value={novaSenha}
                    onChangeText={setNovaSenha}
                    secureTextEntry={!showNova}
                  />
                  <InputSlot className="pr-3" onPress={() => setShowNova((v) => !v)}>
                    <InputIcon as={showNova ? EyeIcon : EyeOffIcon} className="text-gray-400" />
                  </InputSlot>
                </Input>
                <Input variant="outline" size="lg">
                  <InputField
                    placeholder="Confirmar nova senha"
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                    secureTextEntry={!showConfirmar}
                  />
                  <InputSlot className="pr-3" onPress={() => setShowConfirmar((v) => !v)}>
                    <InputIcon as={showConfirmar ? EyeIcon : EyeOffIcon} className="text-gray-400" />
                  </InputSlot>
                </Input>
                {erro && <Text className="text-red-500 text-xs text-center">{erro}</Text>}
                <Pressable
                  onPress={handleAlterarSenha}
                  disabled={loading}
                  className="bg-[#195FA0] rounded-xl py-3.5 items-center active:opacity-80"
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text className="text-white font-bold">Confirmar Nova Senha</Text>
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
