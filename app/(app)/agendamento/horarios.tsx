import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { toast } from "@/src/components/feedback/toast";
import IAgendamentoResponseDto from "@/src/Dtos/Agendamento/IAgendamentoResponseDto";
import { useAgendamento } from "@/src/hooks/useAgendamento";
import { useVagasDisponiveisQuery } from "@/src/queries/agendamento.queries";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useNotaFiscalStore } from "@/src/stores/useNotaFiscalStore";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  CalendarClock,
  CalendarX2,
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  Truck,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

type Periodo = "todos" | "manha" | "tarde" | "noite";

const PERIODOS: { key: Periodo; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "manha", label: "Manhã" },
  { key: "tarde", label: "Tarde" },
  { key: "noite", label: "Noite" },
];

const getPeriodo = (date: Date): Exclude<Periodo, "todos"> => {
  const hour = date.getHours();
  if (hour < 12) return "manha";
  if (hour < 18) return "tarde";
  return "noite";
};

export default function Horarios() {
  const router = useRouter();
  const nota = useNotaFiscalStore((state) => state.notaEmConferencia);
  const { placaVeiculo, tipoVeiculo } = useNotaFiscalStore();
  useAuthStore();

  const [agendamentoSelecionado, setAgendamentoSelecionado] =
    useState<IAgendamentoResponseDto | null>(null);
  const [filtroPeriodo, setFiltroPeriodo] = useState<Periodo>("todos");

  const hoje = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const hojeFormatado = useMemo(
    () =>
      format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR }).replace(
        /^./,
        (c) => c.toUpperCase(),
      ),
    [],
  );

  const { data: agendamentosDisponiveis = [], isLoading } =
    useVagasDisponiveisQuery({
      chaveAcesso: nota?.chaveAcesso ?? "",
      data: hoje,
    });

  const { reservar, isReserving } = useAgendamento();

  useEffect(() => {
    if (!nota) {
      router.replace("/agendamento/agendar");
      return;
    }

    if (!nota.chaveAcesso) {
      toast.error(
        "Nota inválida",
        "A nota fiscal está sem chave de acesso. Tente enviar novamente.",
      );
      router.back();
      return;
    }
  }, [nota]);

  const agendamentosFiltrados = useMemo(() => {
    if (filtroPeriodo === "todos") {
      return agendamentosDisponiveis;
    }

    return agendamentosDisponiveis.filter(
      (v) => getPeriodo(parseISO(v.horarioInicio)) === filtroPeriodo,
    );
  }, [agendamentosDisponiveis, filtroPeriodo]);

  const totalDisponivel = agendamentosDisponiveis.length;

  const handleConfirmar = async () => {
    if (!agendamentoSelecionado || !nota) {
      return;
    }

    try {
      await reservar({
        agendamentoId: agendamentoSelecionado.id,
        notaFiscalChaveAcesso: nota.chaveAcesso,
        placaVeiculo: placaVeiculo,
        tipoVeiculo: tipoVeiculo,
      });

      toast.success(
        "Agendamento confirmado!",
        "Sua reserva foi feita com sucesso.",
      );
      router.push({
        pathname: "/agendamento/ticketAgendamento",
        params: { agendamentoId: agendamentoSelecionado.id },
      });
    } catch {}
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-[#195FA0] pt-12 pb-8 px-5 rounded-b-[32px] overflow-hidden relative">
        <View
          className="absolute -top-12 -right-10 w-44 h-44 rounded-full bg-white/5"
          pointerEvents="none"
        />
        <View
          className="absolute bottom-0 -left-10 w-32 h-32 rounded-full bg-white/5"
          pointerEvents="none"
        />

        <HStack className="items-center justify-between mb-5">
          <Pressable
            onPress={() => router.back()}
            className="bg-white/15 p-2.5 rounded-xl active:opacity-70"
          >
            <Icon as={ArrowLeft} color="white" size="md" />
          </Pressable>

          <HStack
            className="items-center bg-white/15 px-3 py-1.5 rounded-full"
            space="xs"
          >
            <Icon as={CalendarClock} color="white" size="xs" />
            <Text className="text-white text-[11px] font-semibold">
              {totalDisponivel} {totalDisponivel === 1 ? "vaga" : "vagas"}
            </Text>
          </HStack>
        </HStack>

        <Text className="text-blue-100 text-xs font-medium">
          {hojeFormatado}
        </Text>
        <Text className="text-white font-bold text-2xl mt-1">
          Escolha um Horário
        </Text>
        <Text className="text-blue-100 text-xs mt-1.5 opacity-90 leading-4">
          Vagas compatíveis com os produtos da sua nota fiscal.
        </Text>

        {nota?.fornecedor && (
          <View className="bg-white/12 mt-4 px-3.5 py-2.5 rounded-2xl flex-row items-center">
            <View className="bg-white/15 p-1.5 rounded-lg mr-2.5">
              <Icon as={Truck} color="white" size="xs" />
            </View>
            <View className="flex-1">
              <Text className="text-blue-100 text-[10px] uppercase tracking-wide font-semibold">
                Fornecedor
              </Text>
              <Text
                className="text-white text-xs font-semibold mt-0.5"
                numberOfLines={1}
              >
                {nota.fornecedor}
              </Text>
            </View>
          </View>
        )}
      </View>

      <View className="px-5 mt-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 12 }}
        >
          <HStack space="sm">
            {PERIODOS.map((p) => {
              const isActive = filtroPeriodo === p.key;
              return (
                <Pressable
                  key={p.key}
                  onPress={() => setFiltroPeriodo(p.key)}
                  className={`px-4 py-2 rounded-full border ${
                    isActive
                      ? "bg-[#195FA0] border-[#195FA0]"
                      : "bg-white border-gray-200"
                  } active:opacity-80`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      isActive ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {p.label}
                  </Text>
                </Pressable>
              );
            })}
          </HStack>
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1 px-5 mt-4"
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View className="items-center mt-16">
            <ActivityIndicator size="large" color="#195FA0" />
            <Text className="text-gray-400 text-xs mt-3">
              Buscando horários disponíveis...
            </Text>
          </View>
        ) : agendamentosFiltrados.length === 0 ? (
          <View className="items-center mt-16 px-6">
            <View className="bg-blue-50 p-5 rounded-full mb-4">
              <Icon as={CalendarX2} className="text-[#195FA0]" size="xl" />
            </View>
            <Text className="text-gray-800 font-bold text-base text-center">
              Nenhum horário disponível
            </Text>
            <Text className="text-gray-500 text-xs text-center mt-1.5 leading-5">
              {filtroPeriodo === "todos"
                ? "Não encontramos vagas para hoje.\nTente novamente mais tarde."
                : "Nenhuma vaga nesse período.\nExperimente outro filtro."}
            </Text>
          </View>
        ) : (
          <VStack space="sm" className="pb-32">
            {agendamentosFiltrados.map((vaga) => {
              const isSelected = agendamentoSelecionado?.id === vaga.id;
              const horario = parseISO(vaga.horarioInicio);

              return (
                <Pressable
                  key={vaga.id}
                  onPress={() => setAgendamentoSelecionado(vaga)}
                  className={`rounded-2xl border overflow-hidden ${
                    isSelected
                      ? "bg-white border-[#195FA0] border-2"
                      : "bg-white border-gray-100"
                  } active:opacity-90`}
                  style={
                    isSelected
                      ? {
                          shadowColor: "#195FA0",
                          shadowOffset: { width: 0, height: 6 },
                          shadowOpacity: 0.18,
                          shadowRadius: 12,
                          elevation: 5,
                        }
                      : {
                          shadowColor: "#0f172a",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.04,
                          shadowRadius: 8,
                          elevation: 1,
                        }
                  }
                >
                  <HStack className="p-4 items-center">
                    <View
                      className={`w-16 h-16 rounded-2xl items-center justify-center mr-4 ${
                        isSelected ? "bg-[#195FA0]" : "bg-blue-50"
                      }`}
                    >
                      <Icon
                        as={Clock}
                        className={isSelected ? "text-white" : "text-[#195FA0]"}
                        size="xs"
                      />
                      <Text
                        className={`font-bold text-base mt-0.5 ${
                          isSelected ? "text-white" : "text-[#195FA0]"
                        }`}
                      >
                        {format(horario, "HH:mm")}
                      </Text>
                    </View>

                    <View className="flex-1">
                      <HStack className="items-center" space="xs">
                        <Icon as={MapPin} className="text-gray-400" size="xs" />
                        <Text
                          className="text-gray-500 text-[11px] uppercase tracking-wide font-semibold"
                          numberOfLines={1}
                        >
                          Unidade
                        </Text>
                      </HStack>
                      <Text
                        className="text-gray-800 font-bold text-sm mt-0.5"
                        numberOfLines={1}
                      >
                        {vaga.unidadeEntrega ?? "Não Informado"}
                      </Text>
                      <HStack className="items-center mt-1.5" space="xs">
                        <View className="w-1 h-1 rounded-full bg-emerald-500" />
                        <Text className="text-emerald-600 text-[11px] font-semibold">
                          Disponível agora
                        </Text>
                      </HStack>
                    </View>

                    {isSelected ? (
                      <View className="bg-[#195FA0] p-1.5 rounded-full">
                        <Icon as={CheckCircle2} color="white" size="sm" />
                      </View>
                    ) : (
                      <Icon
                        as={ChevronRight}
                        className="text-gray-300"
                        size="sm"
                      />
                    )}
                  </HStack>
                </Pressable>
              );
            })}
          </VStack>
        )}
      </ScrollView>

      {agendamentoSelecionado && (
        <View
          className="absolute bottom-0 left-0 right-0 bg-white pt-4 pb-8 px-5 border-t border-gray-100"
          style={{
            shadowColor: "#0f172a",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 12,
          }}
        >
          <HStack className="items-center justify-between mb-3">
            <View>
              <Text className="text-gray-400 text-[11px] uppercase tracking-wide font-semibold">
                Horário selecionado
              </Text>
              <HStack className="items-center mt-1" space="xs">
                <Icon as={Clock} className="text-[#195FA0]" size="xs" />
                <Text className="text-gray-900 font-bold text-base">
                  {format(
                    parseISO(agendamentoSelecionado.horarioInicio),
                    "HH:mm",
                  )}
                </Text>
                <Text className="text-gray-400 text-xs">•</Text>
                <Text
                  className="text-gray-600 text-xs flex-shrink"
                  numberOfLines={1}
                >
                  {agendamentoSelecionado.unidadeEntrega}
                </Text>
              </HStack>
            </View>
          </HStack>

          <Button
            className="bg-[#195FA0] h-12 rounded-2xl"
            onPress={handleConfirmar}
            isDisabled={isReserving}
            style={{
              shadowColor: "#195FA0",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 6,
            }}
          >
            {isReserving ? (
              <ButtonSpinner color="#fff" />
            ) : (
              <ButtonText className="font-bold text-white">
                Confirmar Reserva
              </ButtonText>
            )}
          </Button>
        </View>
      )}
    </View>
  );
}
