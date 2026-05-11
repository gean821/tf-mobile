import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useMeusAgendamentosQuery } from "@/src/queries/agendamento.queries";
import { useNotaFiscalStore } from "@/src/stores/useNotaFiscalStore";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  CheckCircle2,
  Home,
  MapPin,
  Navigation,
  QrCode,
  Truck,
} from "lucide-react-native";
import { ActivityIndicator, ScrollView, View } from "react-native";

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
      <Center className="flex-1">
        <ActivityIndicator size="large" color="#195FA0" />
      </Center>
    );
  }

  if (!agendamentoSelecionado) {
    return (
      <Center className="flex-1">
        <Text>Agendamento não encontrado.</Text>
        <Button onPress={() => router.replace("/(app)/home")}>
          <ButtonText>Voltar</ButtonText>
        </Button>
      </Center>
    );
  }

  const dataFormatada = format(
    parseISO(agendamentoSelecionado.horarioInicio),
    "EEE, d 'de' MMMM",
    { locale: ptBR },
  );
  const hora = format(parseISO(agendamentoSelecionado.horarioInicio), "HH:mm");

  return (
    <View className="flex-1 bg-[#195FA0]">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Center className="pt-16 pb-8">
          <View className="bg-white/20 p-4 rounded-full mb-4">
            <Icon as={CheckCircle2} size="xl" className="text-white" />
          </View>
          <Heading className="text-white font-bold text-2xl">
            Tudo Certo!
          </Heading>
          <Text className="text-blue-100 mt-1">
            Sua vaga foi reservada com sucesso.
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
                <Text className="text-gray-500 text-xs" numberOfLines={1}>
                  {notaEmConferencia?.fornecedor}
                </Text>
              </VStack>
            </HStack>
          </View>

          <View className="p-6">
            <VStack space="md">
              <HStack className="justify-between">
                <VStack>
                  <Text className="text-xs text-gray-400 mb-1">
                    Veículo (Placa)
                  </Text>
                  <HStack space="xs" className="items-center">
                    <Icon as={Truck} size="xs" className="text-gray-600" />
                    <Text className="font-bold text-gray-800 text-lg">
                      {placaVeiculo || "---"}
                    </Text>
                  </HStack>
                </VStack>
                <VStack className="items-end">
                  <Text className="text-xs text-gray-400 mb-1">Carga</Text>
                  <Text className="font-bold text-gray-800 text-lg">
                    {notaEmConferencia?.pesoBruto
                      ? `${notaEmConferencia.pesoBruto} kg`
                      : "N/A"}
                  </Text>
                </VStack>
              </HStack>
            </VStack>

            <Center className="mt-8 mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              {/* Aqui você usaria <QRCode value={id} /> no futuro */}
              <Icon as={QrCode} size="xl" className="text-gray-800 w-32 h-32" />
              <Text className="text-xs text-gray-400 mt-2 text-center">
                Apresente este código na portaria
              </Text>
              <Text className="text-xs font-mono text-gray-300 mt-1">
                ID: {agendamentoSelecionado.id.split("-")[0].toUpperCase()}
              </Text>
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
