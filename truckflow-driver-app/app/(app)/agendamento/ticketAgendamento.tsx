import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useMeusAgendamentosQuery } from "@/src/queries/agendamento.queries";
import { useNotaFiscalStore } from "@/src/stores/useNotaFiscalStore";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Home,
  MapPin,
  Navigation,
  Package,
  QrCode,
  Truck,
} from "lucide-react-native";
import { ActivityIndicator, ScrollView, View } from "react-native";

type StatusInfo = {
  label: string;
  bg: string;
  text: string;
  title: string;
  subtitle: string;
};

const getStatusInfo = (status: string): StatusInfo => {
  const s = status?.toString().toLowerCase() || "";

  if (s === "concluido" || s === "finalizado") {
    return {
      label: "Concluído",
      bg: "bg-emerald-500/20",
      text: "text-emerald-50",
      title: "Viagem finalizada",
      subtitle: "Esta entrega já foi concluída.",
    };
  }
  if (s === "cancelado") {
    return {
      label: "Cancelado",
      bg: "bg-rose-500/20",
      text: "text-rose-50",
      title: "Agendamento cancelado",
      subtitle: "Este agendamento foi cancelado.",
    };
  }
  if (s === "expirado") {
    return {
      label: "Expirado",
      bg: "bg-amber-500/20",
      text: "text-amber-50",
      title: "Agendamento expirado",
      subtitle: "O prazo para esta vaga acabou.",
    };
  }
  if (s === "emandamento") {
    return {
      label: "Em andamento",
      bg: "bg-emerald-500/20",
      text: "text-emerald-50",
      title: "Em andamento",
      subtitle: "Sua descarga está acontecendo agora.",
    };
  }
  return {
    label: "Agendado",
    bg: "bg-white/20",
    text: "text-white",
    title: "Tudo certo!",
    subtitle: "Sua vaga foi reservada com sucesso.",
  };
};

export default function TicketAgendamento() {
  const router = useRouter();

  const { agendamentoId } = useLocalSearchParams<{ agendamentoId?: string }>();
  const { placaVeiculo, notaEmConferencia } = useNotaFiscalStore();

  const { data: meusAgendamentos = [], isLoading } = useMeusAgendamentosQuery();

  const agendamentoSelecionado = meusAgendamentos.find(
    (a) => a.id === agendamentoId,
  );

  if (isLoading) {
    return (
      <Center className="flex-1 bg-[#195FA0]">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-blue-100 text-xs mt-3">Carregando ticket...</Text>
      </Center>
    );
  }

  if (!agendamentoSelecionado) {
    return (
      <Center className="flex-1 bg-[#195FA0] px-8">
        <View className="bg-white/15 p-5 rounded-full mb-4">
          <Icon as={FileText} className="text-white" size="xl" />
        </View>
        <Text className="text-white font-bold text-lg">
          Agendamento não encontrado
        </Text>
        <Text className="text-blue-100 text-xs text-center mt-2 mb-6">
          Não foi possível localizar este agendamento.
        </Text>
        <Button
          onPress={() => router.replace("/(app)/home")}
          className="bg-white rounded-xl"
        >
          <ButtonText className="text-[#195FA0] font-bold">
            Voltar ao início
          </ButtonText>
        </Button>
      </Center>
    );
  }

  const horarioInicio = parseISO(agendamentoSelecionado.horarioInicio);
  const dataFormatada = format(horarioInicio, "EEE, d 'de' MMMM", {
    locale: ptBR,
  });
  const hora = format(horarioInicio, "HH:mm");

  const statusInfo = getStatusInfo(agendamentoSelecionado.status);

  const placaExibida =
    agendamentoSelecionado.placaVeiculo ||
    notaEmConferencia?.placaVeiculo ||
    placaVeiculo ||
    "---";

  const pesoExibido = agendamentoSelecionado.pesoCarga
    ? `${agendamentoSelecionado.pesoCarga} kg`
    : notaEmConferencia?.pesoBruto
      ? `${notaEmConferencia.pesoBruto} kg`
      : "N/A";

  const fornecedorExibido =
    agendamentoSelecionado.fornecedor || notaEmConferencia?.fornecedor || "";

  const ticketId = agendamentoSelecionado.id.split("-")[0].toUpperCase();

  return (
    <View className="flex-1 bg-[#195FA0]">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between px-5 pt-4">
          <Pressable
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace("/(app)/home")
            }
            className="bg-white/15 p-2.5 rounded-xl active:opacity-70"
          >
            <Icon as={ArrowLeft} color="white" size="md" />
          </Pressable>

          <View className={`px-3 py-1.5 rounded-full ${statusInfo.bg}`}>
            <Text className={`text-[11px] font-bold ${statusInfo.text}`}>
              {statusInfo.label}
            </Text>
          </View>
        </View>

        <Center className="pt-6 pb-8 px-6">
          <View className="bg-white/20 p-4 rounded-full mb-4">
            <Icon as={CheckCircle2} size="xl" className="text-white" />
          </View>
          <Heading className="text-white font-bold text-2xl text-center">
            {statusInfo.title}
          </Heading>
          <Text className="text-blue-100 mt-1 text-center text-sm">
            {statusInfo.subtitle}
          </Text>
        </Center>

        <View className="mx-6 bg-white rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
          <View className="p-6 bg-gray-50 border-b border-dashed border-gray-300">
            <HStack className="justify-between items-center mb-6">
              <VStack>
                <Text className="text-xs text-gray-400 font-bold uppercase">
                  Data
                </Text>
                <Text className="text-gray-800 font-bold text-lg capitalize">
                  {dataFormatada}
                </Text>
              </VStack>
              <VStack className="items-end">
                <Text className="text-xs text-gray-400 font-bold uppercase">
                  Horário
                </Text>
                <Text className="text-[#195FA0] font-black text-3xl">
                  {hora}
                </Text>
              </VStack>
            </HStack>

            <HStack
              space="md"
              className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm items-center"
            >
              <View className="bg-blue-50 p-3 rounded-lg">
                <Icon as={MapPin} className="text-[#195FA0]" />
              </View>
              <VStack className="flex-1">
                <Text className="text-xs text-gray-400 font-bold">
                  Local de Descarga
                </Text>
                <Text
                  className="text-gray-800 font-bold text-md"
                  numberOfLines={1}
                >
                  {agendamentoSelecionado.unidadeDescarga}
                </Text>
                {fornecedorExibido ? (
                  <Text className="text-gray-500 text-xs" numberOfLines={1}>
                    {fornecedorExibido}
                  </Text>
                ) : null}
              </VStack>
            </HStack>
          </View>

          <View className="p-6">
            <VStack space="md">
              <HStack className="justify-between">
                <VStack className="flex-1">
                  <Text className="text-xs text-gray-400 mb-1">
                    Veículo (Placa)
                  </Text>
                  <HStack space="xs" className="items-center">
                    <Icon as={Truck} size="xs" className="text-gray-600" />
                    <Text className="font-bold text-gray-800 text-lg">
                      {placaExibida}
                    </Text>
                  </HStack>
                </VStack>
                <VStack className="items-end flex-1">
                  <Text className="text-xs text-gray-400 mb-1">Carga</Text>
                  <Text className="font-bold text-gray-800 text-lg">
                    {pesoExibido}
                  </Text>
                </VStack>
              </HStack>

              <View className="h-[1px] bg-gray-100" />

              <HStack className="justify-between">
                <VStack className="flex-1">
                  <Text className="text-xs text-gray-400 mb-1">Produto</Text>
                  <HStack space="xs" className="items-center">
                    <Icon as={Package} size="xs" className="text-gray-600" />
                    <Text
                      className="font-bold text-gray-800 text-sm flex-1"
                      numberOfLines={1}
                    >
                      {agendamentoSelecionado.produto || "—"}
                    </Text>
                  </HStack>
                </VStack>
                <VStack className="items-end flex-1">
                  <Text className="text-xs text-gray-400 mb-1">
                    Nota Fiscal
                  </Text>
                  <HStack space="xs" className="items-center">
                    <Icon as={FileText} size="xs" className="text-gray-600" />
                    <Text className="font-bold text-gray-800 text-sm">
                      {agendamentoSelecionado.notaFiscal || "—"}
                    </Text>
                  </HStack>
                </VStack>
              </HStack>
            </VStack>

            <Center className="mt-8 mb-2 p-5 bg-gray-50 rounded-2xl border border-gray-200">
              <Icon as={QrCode} size="xl" className="text-gray-800 w-32 h-32" />
              <Text className="text-xs text-gray-500 mt-3 text-center font-semibold">
                Apresente este código na portaria
              </Text>
              <View className="bg-white px-3 py-1 rounded-full mt-2 border border-gray-200">
                <Text className="text-[11px] font-mono text-gray-500">
                  ID: {ticketId}
                </Text>
              </View>
            </Center>
          </View>
        </View>

        <VStack space="md" className="px-6 mt-8">
          <Button
            size="xl"
            className="bg-white rounded-xl shadow-lg"
            onPress={() => router.replace("/(app)/home")}
          >
            <ButtonText className="text-[#195FA0] font-bold">
              Voltar ao Início
            </ButtonText>
            <Icon as={Home} className="text-[#195FA0] ml-2" />
          </Button>

          <Button
            variant="link"
            onPress={() => {
              /* Lógica do Waze/Maps aqui FUTURAMENTE*/
            }}
            className="mt-2"
          >
            <Icon as={Navigation} size="sm" className="text-blue-200 mr-2" />
            <ButtonText className="text-blue-200">Abrir no GPS</ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    </View>
  );
}
