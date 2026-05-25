import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
} from "@/components/ui/modal";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import type { NotificacaoListItemDto } from "@/src/Dtos/Notificacao/NotificacaoListItemDto";
import { TipoNotificacao } from "@/src/enums/TipoNotificacao";
import { useNotificacao } from "@/src/hooks/useNotificacao";
import { useComunicacaoAgendamentoQuery } from "@/src/queries/notificacao.queries";
import { format, parseISO } from "date-fns";
import { MessageSquare, Send, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  FlatList,
  Keyboard,
  Platform,
  View,
} from "react-native";

interface AvisarFabricaModalProps {
  isOpen: boolean;
  agendamentoId: string;
  onClose: () => void;
}

const CORPO_MAX = 2000;
const POLL_INTERVAL_MS = 30000;

export function AvisarFabricaModal({
  isOpen,
  agendamentoId,
  onClose,
}: AvisarFabricaModalProps) {
  const { enviarParaEmpresa, isEnviando } = useNotificacao();

  const {
    data: items = [],
    isLoading,
    refetch,
  } = useComunicacaoAgendamentoQuery(isOpen ? agendamentoId : null, {
    enabled: isOpen,
    refetchInterval: isOpen ? POLL_INTERVAL_MS : false,
  });

  const [corpo, setCorpo] = useState("");
  const [kbHeight, setKbHeight] = useState(0);
  const listRef = useRef<FlatList<NotificacaoListItemDto>>(null);

  useEffect(() => {
    if (isOpen) {
      setCorpo("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        refetch();
      }
    });
    return () => sub.remove();
  }, [isOpen, refetch]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const showEvt =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvt =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvt, (e) => {
      setKbHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvt, () => setKbHeight(0));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || items.length === 0) {
      return;
    }
    const t = setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 80);
    return () => clearTimeout(t);
  }, [isOpen, items.length]);

  const canSubmit = !!corpo.trim() && !isEnviando && !!agendamentoId;

  const adminMaisRecente = (() => {
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i].tipo === TipoNotificacao.MensagemManualAdmin) {
        const nome = extrairAutorNome(items[i].payloadJson);
        if (nome) {
          return nome;
        }
      }
    }
    return null;
  })();

  async function handleSubmit() {
    if (!canSubmit) {
      return;
    }
    try {
      await enviarParaEmpresa({ agendamentoId, corpo: corpo.trim() });
      setCorpo("");
      Keyboard.dismiss();
      await refetch();
    } catch {}
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalBackdrop />
      <ModalContent className="bg-white h-[80%] w-[95%] rounded-2xl">
        <ModalHeader className="border-b border-gray-100 p-4 flex-row justify-between items-center">
          <HStack space="sm" className="items-center">
            <Icon as={MessageSquare} className="text-blue-700" />
            <VStack>
              <Heading size="sm">{adminMaisRecente ?? "Comunicação"}</Heading>
              <Text className="text-[10px] text-gray-500">
                {adminMaisRecente ? "Fábrica" : "Conversa deste agendamento"}
              </Text>
            </VStack>
          </HStack>
          <Pressable onPress={onClose}>
            <Icon as={X} className="text-gray-400" />
          </Pressable>
        </ModalHeader>

        <View style={{ flex: 1, marginBottom: kbHeight }}>
          <View className="flex-1 bg-[#fafbfc]">
            {isLoading && items.length === 0 ? (
              <View className="flex-1 items-center justify-center py-10">
                <ActivityIndicator size="small" color="#195FA0" />
              </View>
            ) : items.length === 0 ? (
              <VStack className="flex-1 items-center justify-center py-10 px-6">
                <Icon as={MessageSquare} size="xl" className="text-gray-300" />
                <Text className="text-sm text-gray-500 mt-3 text-center">
                  Nenhuma mensagem ainda.
                </Text>
                <Text className="text-xs text-gray-400 mt-1 text-center">
                  Envie a primeira para a fábrica abaixo.
                </Text>
              </VStack>
            ) : (
              <FlatList
                ref={listRef}
                data={items}
                keyExtractor={(it) => it.id}
                contentContainerStyle={{ padding: 12, gap: 8 }}
                renderItem={({ item }) => <Bubble item={item} />}
                onContentSizeChange={() =>
                  listRef.current?.scrollToEnd({ animated: false })
                }
                keyboardShouldPersistTaps="handled"
              />
            )}
          </View>

          <HStack
            space="sm"
            className="items-end p-3 border-t border-gray-100 bg-white"
          >
            <Input
              variant="outline"
              size="sm"
              className="flex-1 min-h-[42px] max-h-[110px]"
            >
              <InputField
                placeholder="Mensagem..."
                value={corpo}
                onChangeText={setCorpo}
                maxLength={CORPO_MAX}
                multiline
                textAlignVertical="top"
                onSubmitEditing={handleSubmit}
                blurOnSubmit={false}
              />
            </Input>

            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit}
              className={`h-11 w-11 rounded-full items-center justify-center ${
                canSubmit ? "bg-[#195FA0]" : "bg-gray-300"
              }`}
            >
              {isEnviando ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Icon as={Send} size="sm" className="text-white" />
              )}
            </Pressable>
          </HStack>
        </View>
      </ModalContent>
    </Modal>
  );
}

interface BubbleProps {
  item: NotificacaoListItemDto;
}

function Bubble({ item }: BubbleProps) {
  const isMine = item.tipo === TipoNotificacao.MensagemManualMotorista;
  const bg = bgPorTipo(item.tipo);
  const autor = headerDaBubble(item);
  const corNome = corDoNome(item.tipo);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: isMine ? "flex-end" : "flex-start",
      }}
    >
      <View
        style={{
          maxWidth: "82%",
          backgroundColor: bg,
          borderRadius: 12,
          paddingVertical: 8,
          paddingHorizontal: 12,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 1,
          shadowOffset: { width: 0, height: 1 },
          elevation: 1,
        }}
      >
        {!isMine && (
          <Text
            style={{ color: corNome }}
            className="text-[13px] font-semibold mb-0.5"
            numberOfLines={1}
          >
            {autor}
          </Text>
        )}
        <Text className="text-[14px] text-gray-800" selectable>
          {item.corpo}
        </Text>
        <Text className="text-[10px] text-gray-400 text-right mt-1">
          {formatHora(item.criadaEm)}
        </Text>
      </View>
    </View>
  );
}

function corDoNome(tipo: TipoNotificacao): string {
  if (tipo === TipoNotificacao.MensagemManualAdmin) {
    return "#1976d2";
  }
  if (
    tipo === TipoNotificacao.AgendamentoCancelado ||
    tipo === TipoNotificacao.AgendamentoExpirado
  ) {
    return "#d32f2f";
  }
  if (tipo === TipoNotificacao.AgendamentoConfirmado) {
    return "#2e7d32";
  }
  return "#374151";
}

function headerDaBubble(item: NotificacaoListItemDto): string {
  const ehMensagemManual =
    item.tipo === TipoNotificacao.MensagemManualAdmin ||
    item.tipo === TipoNotificacao.MensagemManualMotorista;

  if (ehMensagemManual) {
    const autorNome = extrairAutorNome(item.payloadJson);
    if (autorNome) {
      return autorNome;
    }
  }
  return item.titulo;
}

function extrairAutorNome(
  payloadJson: string | null | undefined,
): string | null {
  if (!payloadJson) {
    return null;
  }
  try {
    const obj = JSON.parse(payloadJson);
    const nome = obj?.autorNome;
    return typeof nome === "string" && nome.trim() !== "" ? nome : null;
  } catch {
    return null;
  }
}

function bgPorTipo(tipo: TipoNotificacao): string {
  switch (tipo) {
    case TipoNotificacao.MensagemManualMotorista:
      return "#dcf8c6";
    case TipoNotificacao.MensagemManualAdmin:
      return "#ffffff";
    case TipoNotificacao.AgendamentoCancelado:
    case TipoNotificacao.AgendamentoExpirado:
      return "#ffebee";
    case TipoNotificacao.AgendamentoConfirmado:
    case TipoNotificacao.MotoristaChegou:
      return "#e8f5e9";
    default:
      return "#f5f5f5";
  }
}

function formatHora(iso: string): string {
  try {
    return format(parseISO(iso), "dd/MM HH:mm");
  } catch {
    return "";
  }
}
