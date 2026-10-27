import { useRouter } from "expo-router";
import {
  AlarmClockOff,
  CalendarCheck,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Package,
  Truck,
  XCircle,
} from "lucide-react-native";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";

import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { CORES_SERIES } from "@/src/components/graficos/tema";
import { BarrasMensais } from "@/src/components/relatorio/BarrasMensais";
import { IndicadorCard } from "@/src/components/relatorio/IndicadorCard";
import { MedidorComparecimento } from "@/src/components/relatorio/MedidorComparecimento";
import { RoscaProdutos } from "@/src/components/relatorio/RoscaProdutos";
import { VariacaoBadge } from "@/src/components/relatorio/VariacaoBadge";
import { PRIMARY_500 } from "@/src/constants/colors";
import { useRelatorioMotorista } from "@/src/hooks/useRelatorioMotorista";
import {
  formatarDataHora,
  formatarPeso,
  formatarPesoTexto,
  PERIODOS_RELATORIO,
} from "@/src/utils/relatorio";

function Secao({
  titulo,
  subtitulo,
  children,
}: {
  titulo: string;
  subtitulo?: string;
  children: React.ReactNode;
}) {
  return (
    <View className="bg-white rounded-3xl p-5 border border-gray-100">
      <Text className="text-gray-900 font-bold text-base">{titulo}</Text>
      {subtitulo ? (
        <Text className="text-gray-400 text-xs mt-0.5 mb-4">{subtitulo}</Text>
      ) : (
        <View className="h-4" />
      )}
      {children}
    </View>
  );
}

export default function MeuDesempenho() {
  const router = useRouter();
  const {
    periodo,
    setPeriodo,
    relatorio,
    descricaoPeriodo,
    descricaoAnterior,
    carregando,
    atualizando,
    erro,
    recarregar,
  } = useRelatorioMotorista();

  const atual = relatorio?.atual;
  const peso = formatarPeso(atual?.pesoKg ?? 0);
  const compareceu = (atual?.concluidas ?? 0) + (atual?.noPatio ?? 0);
  const comparecimentoBase = compareceu + (atual?.naoCompareceu ?? 0);
  const semDados = !!relatorio && relatorio.atual.agendamentos === 0;
  const maiorLocal = Math.max(
    1,
    ...(relatorio?.porLocal.map((l) => l.pesoKg) ?? [1]),
  );

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={atualizando}
          onRefresh={recarregar}
          colors={[PRIMARY_500]}
        />
      }
    >
      <View className="bg-primary-500 pt-12 pb-24 px-5 rounded-b-[36px] overflow-hidden relative">
        <View
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5"
          pointerEvents="none"
        />
        <View
          className="absolute top-24 -left-12 w-32 h-32 rounded-full bg-white/5"
          pointerEvents="none"
        />

        <HStack className="items-center mb-5" space="sm">
          <Pressable
            onPress={() => router.back()}
            className="bg-white/15 p-2 rounded-full"
            accessibilityLabel="Voltar"
          >
            <Icon as={ChevronLeft} color="white" size="md" />
          </Pressable>
          <VStack>
            <Text className="text-white font-bold text-2xl">
              Meu desempenho
            </Text>
            <Text className="text-blue-100 text-xs">{descricaoPeriodo}</Text>
          </VStack>
        </HStack>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {PERIODOS_RELATORIO.map((p) => {
            const ativo = p.valor === periodo;
            return (
              <Pressable
                key={p.valor}
                onPress={() => setPeriodo(p.valor)}
                className={`px-4 py-2 rounded-full ${ativo ? "bg-white" : "bg-white/15"}`}
                accessibilityState={{ selected: ativo }}
              >
                <Text
                  className={`text-sm font-semibold ${ativo ? "text-primary-500" : "text-white"}`}
                >
                  {p.rotulo}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <VStack space="lg" className="px-5 -mt-16 pb-12">
        {carregando ? (
          <View className="bg-white rounded-3xl p-10 items-center border border-gray-100">
            <ActivityIndicator size="large" color={PRIMARY_500} />
            <Text className="text-gray-400 text-sm mt-3">
              Calculando suas entregas...
            </Text>
          </View>
        ) : erro || !relatorio || !atual ? (
          <View className="bg-white rounded-3xl p-8 items-center border border-gray-100">
            <Text className="text-gray-800 font-bold text-base">
              Não foi possível carregar
            </Text>
            <Text className="text-gray-400 text-sm mt-1 text-center">
              Verifique sua conexão e tente de novo.
            </Text>
            <Pressable
              onPress={() => recarregar()}
              className="mt-4 bg-primary-500 px-5 py-2.5 rounded-full"
            >
              <Text className="text-white font-semibold">Tentar novamente</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View
              className="bg-white rounded-3xl p-5 border border-blue-100"
              style={{
                shadowColor: PRIMARY_500,
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.15,
                shadowRadius: 20,
                elevation: 8,
              }}
            >
              <HStack>
                <VStack className="flex-1 pr-3 border-r border-gray-100">
                  <HStack className="items-center mb-2" space="xs">
                    <Icon as={Truck} size="sm" className="text-primary-500" />
                    <Text className="text-gray-500 text-xs font-semibold">
                      Entregas concluídas
                    </Text>
                  </HStack>
                  <Text className="text-gray-900 font-bold text-4xl">
                    {atual.concluidas}
                  </Text>
                  <View className="mt-2">
                    <VariacaoBadge valor={relatorio.variacaoEntregasPct} />
                  </View>
                </VStack>
                <VStack className="flex-1 pl-4">
                  <HStack className="items-center mb-2" space="xs">
                    <Icon as={Package} size="sm" className="text-emerald-600" />
                    <Text className="text-gray-500 text-xs font-semibold">
                      Carga descarregada
                    </Text>
                  </HStack>
                  <HStack className="items-end" space="xs">
                    <Text className="text-gray-900 font-bold text-4xl">
                      {peso.valor}
                    </Text>
                    <Text className="text-gray-400 font-semibold text-base mb-1">
                      {peso.unidade}
                    </Text>
                  </HStack>
                  <View className="mt-2">
                    <VariacaoBadge valor={relatorio.variacaoPesoPct} />
                  </View>
                </VStack>
              </HStack>
              {descricaoAnterior &&
              (relatorio.variacaoEntregasPct !== null ||
                relatorio.variacaoPesoPct !== null) ? (
                <Text className="text-gray-400 text-[11px] mt-4">
                  Comparado com {descricaoAnterior}
                </Text>
              ) : null}
            </View>

            {semDados ? (
              <View className="bg-white rounded-3xl p-8 items-center border border-gray-100">
                <View className="bg-blue-50 p-4 rounded-full mb-3">
                  <Icon
                    as={CalendarPlus}
                    size="xl"
                    className="text-primary-500"
                  />
                </View>
                <Text className="text-gray-800 font-bold text-base">
                  Nenhuma viagem neste período
                </Text>
                <Text className="text-gray-400 text-sm mt-1 text-center">
                  Assim que você agendar e descarregar, seus números aparecem
                  aqui.
                </Text>
                <Pressable
                  onPress={() => router.push("/agendamento/agendar")}
                  className="mt-4 bg-primary-500 px-5 py-2.5 rounded-full"
                >
                  <Text className="text-white font-semibold">
                    Agendar carga
                  </Text>
                </Pressable>
              </View>
            ) : (
              <>
                <MedidorComparecimento
                  percentual={atual.comparecimentoPct}
                  compareceu={compareceu}
                  total={comparecimentoBase}
                />
                <HStack space="sm">
                  <IndicadorCard
                    icone={CalendarCheck}
                    rotulo="Agendamentos"
                    valor={String(atual.agendamentos)}
                    detalhe={
                      atual.aguardando > 0
                        ? `${atual.aguardando} por vir`
                        : undefined
                    }
                    cor="blue"
                  />
                  <IndicadorCard
                    icone={XCircle}
                    rotulo="Cancelados"
                    valor={String(atual.canceladas)}
                    cor="orange"
                  />
                  <IndicadorCard
                    icone={AlarmClockOff}
                    rotulo="Não veio"
                    valor={String(atual.naoCompareceu)}
                    cor="red"
                  />
                </HStack>
              </>
            )}

            {relatorio.proximoAgendamento ? (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/agendamento/ticketAgendamento",
                    params: { agendamentoId: relatorio.proximoAgendamento!.id },
                  })
                }
                className="active:scale-[0.98]"
              >
                <HStack
                  className="bg-primary-500 rounded-3xl p-5 items-center"
                  space="md"
                >
                  <View className="bg-white/15 p-3 rounded-2xl">
                    <Icon as={Clock} color="white" size="lg" />
                  </View>
                  <VStack className="flex-1">
                    <Text className="text-blue-100 text-xs font-semibold">
                      Próximo agendamento
                    </Text>
                    <Text className="text-white font-bold text-lg">
                      {formatarDataHora(
                        relatorio.proximoAgendamento.dataInicio,
                      )}
                    </Text>
                    <Text className="text-blue-100 text-xs" numberOfLines={1}>
                      {[
                        relatorio.proximoAgendamento.localDescarga,
                        relatorio.proximoAgendamento.unidadeEntrega,
                      ]
                        .filter(Boolean)
                        .join(" • ")}
                    </Text>
                  </VStack>
                  <Icon as={ChevronRight} color="white" size="md" />
                </HStack>
              </Pressable>
            ) : null}

            <Secao titulo="Entregas por mês" subtitulo="Últimos 6 meses">
              <BarrasMensais meses={relatorio.historicoMensal} />
            </Secao>

            {relatorio.porProduto.length > 0 ? (
              <Secao
                titulo="O que você transportou"
                subtitulo="Carga descarregada por produto"
              >
                <RoscaProdutos fatias={relatorio.porProduto} />
              </Secao>
            ) : null}

            {relatorio.porLocal.length > 0 ? (
              <Secao
                titulo="Onde você descarregou"
                subtitulo="Fábricas com mais entregas"
              >
                <VStack space="md">
                  {relatorio.porLocal.map((local, i) => (
                    <VStack
                      key={`${local.nome}-${local.detalhe ?? ""}`}
                      space="xs"
                    >
                      <HStack className="items-center" space="sm">
                        <View className="bg-slate-100 w-8 h-8 rounded-xl items-center justify-center">
                          <Icon
                            as={MapPin}
                            size="xs"
                            className="text-gray-500"
                          />
                        </View>
                        <VStack className="flex-1">
                          <Text
                            className="text-gray-800 text-sm font-semibold"
                            numberOfLines={1}
                          >
                            {local.nome}
                          </Text>
                          {local.detalhe ? (
                            <Text
                              className="text-gray-400 text-[11px]"
                              numberOfLines={1}
                            >
                              {local.detalhe}
                            </Text>
                          ) : null}
                        </VStack>
                        <VStack className="items-end">
                          <Text className="text-gray-800 text-sm font-bold">
                            {formatarPesoTexto(local.pesoKg)}
                          </Text>
                          <Text className="text-gray-400 text-[11px]">
                            {local.entregas}{" "}
                            {local.entregas === 1 ? "entrega" : "entregas"}
                          </Text>
                        </VStack>
                      </HStack>
                      <View className="h-1.5 bg-slate-100 rounded-full overflow-hidden ml-10">
                        <View
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.max(4, (local.pesoKg / maiorLocal) * 100)}%`,
                            backgroundColor:
                              CORES_SERIES[i % CORES_SERIES.length],
                          }}
                        />
                      </View>
                    </VStack>
                  ))}
                </VStack>
              </Secao>
            ) : null}

            <Text className="text-gray-400 text-[11px] text-center px-6">
              Números calculados a partir dos seus agendamentos no TruckFlow.
            </Text>
          </>
        )}
      </VStack>
    </ScrollView>
  );
}
