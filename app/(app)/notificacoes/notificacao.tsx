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
import { PRIMARY_500 } from "@/src/constants/colors";
import {
  format,
  differenceInCalendarDays,
  isToday,
  isTomorrow,
  isValid,
  isYesterday,
  parseISO,
} from "date-fns";
import { ptBR } from "date-fns/locale";
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
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  View,
} from "react-native";

interface NotificacaoPayloadExtra {
  agendamentoId?: string;
  unidadeEntregaNome?: string;
  localDescargaNome?: string;
  dataAgendamentoIso?: string;
  empresaNome?: string;
}

interface NotificacaoSecao {
  title: string;
  data: NotificacaoListItemDto[];
}

type FiltroChave = "todas" | "naoLidas" | "mensagens" | "agendamentos";

const CHIPS: { chave: FiltroChave; label: string }[] = [
  { chave: "todas", label: "Todas" },
  { chave: "naoLidas", label: "Não lidas" },
  { chave: "mensagens", label: "Mensagens" },
  { chave: "agendamentos", label: "Agendamentos" },
];

const TIPOS_MENSAGEM = new Set<TipoNotificacao>([
  TipoNotificacao.MensagemManualAdmin,
  TipoNotificacao.MensagemManualMotorista,
]);

const TIPOS_AGENDAMENTO = new Set<TipoNotificacao>([
  TipoNotificacao.AgendamentoCriado,
  TipoNotificacao.AgendamentoConfirmado,
  TipoNotificacao.AgendamentoCancelado,
  TipoNotificacao.AgendamentoReagendado,
  TipoNotificacao.AgendamentoExpirado,
  TipoNotificacao.MotoristaChegou,
  TipoNotificacao.JanelaPropxima,
]);

function parsePayload(payloadJson: string): NotificacaoPayloadExtra {
  try {
    const parsed: unknown = JSON.parse(payloadJson);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as NotificacaoPayloadExtra;
    }
  } catch {}
  return {};
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

  return PRIMARY_500;
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

function formatarDataAgendamento(iso: string): string | null {
  try {
    const data = parseISO(iso);

    if (!isValid(data)) {
      return null;
    }

    const hora = format(data, "HH:mm");

    if (isToday(data)) {
      return `hoje às ${hora}`;
    }

    if (isYesterday(data)) {
      return `ontem às ${hora}`;
    }

    if (isTomorrow(data)) {
      return `amanhã às ${hora}`;
    }

    return `${format(data, "dd/MM", { locale: ptBR })} às ${hora}`;
  } catch {
    return null;
  }
}

function montarSubtitulo(payload: NotificacaoPayloadExtra): string | null {
  const partes: string[] = [];

  if (
    typeof payload.empresaNome === "string" &&
    payload.empresaNome.trim() !== ""
  ) {
    partes.push(payload.empresaNome.trim());
  }

  if (
    typeof payload.unidadeEntregaNome === "string" &&
    payload.unidadeEntregaNome.trim() !== ""
  ) {
    partes.push(`Unidade ${payload.unidadeEntregaNome.trim()}`);
  }

  if (
    typeof payload.localDescargaNome === "string" &&
    payload.localDescargaNome.trim() !== ""
  ) {
    partes.push(payload.localDescargaNome.trim());
  }

  if (typeof payload.dataAgendamentoIso === "string") {
    const dataFormatada = formatarDataAgendamento(payload.dataAgendamentoIso);
    if (dataFormatada) {
      partes.push(dataFormatada);
    }
  }

  return partes.length > 0 ? partes.join(" · ") : null;
}

function aplicaFiltro(
  items: NotificacaoListItemDto[],
  filtro: FiltroChave,
): NotificacaoListItemDto[] {
  switch (filtro) {
    case "naoLidas":
      return items.filter((i) => !i.lidaEm);
    case "mensagens":
      return items.filter((i) => TIPOS_MENSAGEM.has(i.tipo));
    case "agendamentos":
      return items.filter((i) => TIPOS_AGENDAMENTO.has(i.tipo));
    default:
      return items;
  }
}

function agruparPorPeriodo(
  items: NotificacaoListItemDto[],
): NotificacaoSecao[] {
  const grupos: Record<string, NotificacaoListItemDto[]> = {
    Hoje: [],
    Ontem: [],
    "Esta semana": [],
    "Mais antigas": [],
  };

  const agora = new Date();

  for (const item of items) {
    const data = parseISO(item.criadaEm);

    if (!isValid(data)) {
      grupos["Mais antigas"].push(item);
      continue;
    }

    if (isToday(data)) {
      grupos["Hoje"].push(item);
    } else if (isYesterday(data)) {
      grupos["Ontem"].push(item);
    } else if (differenceInCalendarDays(agora, data) < 7) {
      grupos["Esta semana"].push(item);
    } else {
      grupos["Mais antigas"].push(item);
    }
  }

  return Object.entries(grupos)
    .filter(([, data]) => data.length > 0)
    .map(([title, data]) => ({ title, data }));
}

export default function NotificacoesScreen() {
  const router = useRouter();
  const [pageNumber, setPageNumber] = useState(1);
  const [filtro, setFiltro] = useState<FiltroChave>("todas");

  const { data, isLoading, isRefetching, refetch } = useNotificacoesPagedQuery({
    pageNumber,
    pageSize: 20,
  });

  const { markAsRead, markAllAsRead, isMarkingAllAsRead } = useNotificacao();

  const items = data?.items ?? [];
  const hasMore = data ? pageNumber < data.totalPages : false;

  const itemsFiltrados = useMemo(
    () => aplicaFiltro(items, filtro),
    [items, filtro],
  );

  const secoes = useMemo(
    () => agruparPorPeriodo(itemsFiltrados),
    [itemsFiltrados],
  );

  async function onPressItem(item: NotificacaoListItemDto) {
    if (!item.lidaEm) {
      try {
        await markAsRead(item.id);
      } catch {}
    }

    const payload = parsePayload(item.payloadJson);
    const agendamentoId =
      typeof payload.agendamentoId === "string" ? payload.agendamentoId : null;

    if (agendamentoId) {
      router.push({
        pathname: "/(app)/agendamento/ticketAgendamento",
        params: { agendamentoId },
      });
    }
  }

  async function onPressMarcarTodasComoLidas() {
    try {
      await markAllAsRead();
    } catch {}
  }

  function renderItem({ item }: { item: NotificacaoListItemDto }) {
    const IconCmp = iconeParaTipo(item.tipo);
    const cor = corParaPrioridade(item.prioridade);
    const naoLida = !item.lidaEm;
    const payload = parsePayload(item.payloadJson);
    const subtitulo = montarSubtitulo(payload);

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
            {subtitulo && (
              <Text className="text-xs text-gray-500" numberOfLines={1}>
                {subtitulo}
              </Text>
            )}
          </VStack>
        </HStack>
      </Pressable>
    );
  }

  function renderSectionHeader({ section }: { section: NotificacaoSecao }) {
    return (
      <View
        style={{
          backgroundColor: "#f9fafb",
          paddingHorizontal: 16,
          paddingVertical: 6,
          borderBottomWidth: 1,
          borderBottomColor: "#f3f4f6",
        }}
      >
        <Text className="text-xs font-bold text-gray-500 uppercase">
          {section.title}
        </Text>
      </View>
    );
  }

  return (
    <Box className="flex-1 bg-white">
      <View
        style={{
          backgroundColor: PRIMARY_500,
          paddingTop: 60,
          paddingBottom: 16,
          paddingHorizontal: 16,
        }}
      >
        <HStack className="items-center justify-between">
          <Text className="text-white text-xl font-bold">Notificações</Text>
          <Pressable
            onPress={onPressMarcarTodasComoLidas}
            disabled={isMarkingAllAsRead}
            accessibilityRole="button"
            accessibilityLabel="Marcar todas como lidas"
          >
            <Text className="text-white text-xs font-semibold underline">
              {isMarkingAllAsRead ? "Marcando..." : "Marcar todas como lidas"}
            </Text>
          </Pressable>
        </HStack>
      </View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          paddingHorizontal: 12,
          paddingVertical: 12,
          gap: 8,
        }}
      >
        {CHIPS.map((chip) => {
          const ativo = filtro === chip.chave;
          return (
            <Pressable
              key={chip.chave}
              onPress={() => setFiltro(chip.chave)}
              className={`px-4 py-2 rounded-full ${
                ativo ? "bg-primary-500" : "bg-white border border-gray-300"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  ativo ? "text-white" : "text-gray-600"
                }`}
              >
                {chip.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {isLoading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color={PRIMARY_500} />
        </View>
      ) : items.length === 0 ? (
        <VStack className="flex-1 items-center justify-center px-8" space="md">
          <Icon as={Bell} size="xl" style={{ color: "#9ca3af" }} />
          <Text className="text-gray-500 text-center">
            Nenhuma notificação ainda.
          </Text>
        </VStack>
      ) : itemsFiltrados.length === 0 ? (
        <VStack className="flex-1 items-center justify-center px-8" space="md">
          <Icon as={Bell} size="xl" style={{ color: "#9ca3af" }} />
          <Text className="text-gray-500 text-center">
            Nenhuma notificação neste filtro.
          </Text>
        </VStack>
      ) : (
        <SectionList
          sections={secoes}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => refetch()}
              colors={[PRIMARY_500]}
              tintColor={PRIMARY_500}
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
