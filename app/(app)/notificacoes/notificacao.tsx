import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import type { NotificacaoListItemDto } from "@/src/Dtos/Notificacao/NotificacaoListItemDto";
import {
  PrioridadeNotificacao,
  TipoNotificacao,
} from "@/src/enums/TipoNotificacao";
import { useNotificacao } from "@/src/hooks/useNotificacao";
import { useNotificacoesPagedQuery } from "@/src/queries/notificacao.queries";
import { useRouter } from "expo-router";
import {
  Bell,
  CalendarCheck,
  CalendarClock,
  CalendarOff,
  CalendarPlus,
  CalendarX,
  Clock,
  MessageSquare,
} from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, View } from "react-native";

interface PayloadComAgendamento {
  agendamentoId?: string;
}

function tentaLerAgendamentoId(payloadJson: string): string | null {
  try {
    const parsed: unknown = JSON.parse(payloadJson);

    if (typeof parsed === "object" && parsed !== null) {
      const obj = parsed as PayloadComAgendamento;
      return typeof obj.agendamentoId === "string" ? obj.agendamentoId : null;
    }
  } catch {}
  return null;
}

function iconeParaTipo(tipo: TipoNotificacao) {
  switch (tipo) {
    case TipoNotificacao.AgendamentoCancelado:
      return CalendarOff;
    case TipoNotificacao.AgendamentoConfirmado:
      return CalendarCheck;
    case TipoNotificacao.AgendamentoReagendado:
      return CalendarClock;
    case TipoNotificacao.AgendamentoExpirado:
      return CalendarX;
    case TipoNotificacao.AgendamentoCriado:
      return CalendarPlus;
    case TipoNotificacao.MensagemManualAdmin:
    case TipoNotificacao.MensagemManualMotorista:
      return MessageSquare;
    case TipoNotificacao.JanelaPropxima:
      return Clock;
    default:
      return Bell;
  }
}

function corParaPrioridade(p: PrioridadeNotificacao): string {
  if (p === PrioridadeNotificacao.Critica) {
    return "#dc2626";
  }

  if (p === PrioridadeNotificacao.Alta) {
    return "#d97706";
  }

  return "#195FA0";
}

function tempoRelativo(iso: string): string {
  const diffSec = Math.max(
    0,
    Math.floor((Date.now() - new Date(iso).getTime()) / 1000),
  );

  if (diffSec < 60) {
    return "agora";
  }

  const min = Math.floor(diffSec / 60);

  if (min < 60) {
    return `${min}m`;
  }

  const h = Math.floor(min / 60);

  if (h < 24) {
    return `${h}h`;
  }

  return `${Math.floor(h / 24)}d`;
}

export default function NotificacoesScreen() {
  const router = useRouter();
  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading, isRefetching, refetch } = useNotificacoesPagedQuery({
    pageNumber,
    pageSize: 20,
  });

  const { markAsRead } = useNotificacao();

  async function onPressItem(item: NotificacaoListItemDto) {
    if (!item.lidaEm) {
      try {
        await markAsRead(item.id);
      } catch {}
    }

    const agendamentoId = tentaLerAgendamentoId(item.payloadJson);

    if (agendamentoId) {
      router.push({
        pathname: "/(app)/agendamento/ticketAgendamento",
        params: { agendamentoId },
      });
    }
  }

  function renderItem({ item }: { item: NotificacaoListItemDto }) {
    const IconCmp = iconeParaTipo(item.tipo);
    const cor = corParaPrioridade(item.prioridade);
    const naoLida = !item.lidaEm;

    return (
      <Pressable onPress={() => onPressItem(item)}>
        <HStack
          space="sm"
          className="px-4 py-3 border-b border-gray-100"
          style={{ backgroundColor: naoLida ? "#f0f7fc" : "#ffffff" }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: `${cor}1A`,
            }}
          >
            <Icon as={IconCmp} size="sm" style={{ color: cor }} />
          </View>
          <VStack className="flex-1" space="xs">
            <HStack className="items-center justify-between">
              <Text
                className="font-semibold text-gray-900 flex-1"
                numberOfLines={1}
              >
                {item.titulo}
              </Text>
              <Text className="text-xs text-gray-500 ml-2">
                {tempoRelativo(item.criadaEm)}
              </Text>
            </HStack>
            <Text className="text-sm text-gray-600" numberOfLines={2}>
              {item.corpo}
            </Text>
          </VStack>
        </HStack>
      </Pressable>
    );
  }

  const items = data?.items ?? [];
  const hasMore = data ? pageNumber < data.totalPages : false;

  return (
    <Box className="flex-1 bg-white">
      <View
        style={{
          backgroundColor: "#195FA0",
          paddingTop: 60,
          paddingBottom: 16,
          paddingHorizontal: 16,
        }}
      >
        <Text className="text-white text-xl font-bold">Notificações</Text>
      </View>

      {isLoading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#195FA0" />
        </View>
      ) : items.length === 0 ? (
        <VStack className="flex-1 items-center justify-center px-8" space="md">
          <Icon as={Bell} size="xl" style={{ color: "#9ca3af" }} />
          <Text className="text-gray-500 text-center">
            Nenhuma notificação ainda.
          </Text>
        </VStack>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => refetch()}
              colors={["#195FA0"]}
              tintColor="#195FA0"
            />
          }
          onEndReachedThreshold={0.3}
          onEndReached={() => {
            if (hasMore && !isRefetching) {
              setPageNumber((p) => p + 1);
            }
          }}
        />
      )}
    </Box>
  );
}