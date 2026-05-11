import { useRouter } from "expo-router";
import {
  Bell,
  CalendarPlus,
  CalendarRange,
  ChevronRight,
  LogOut,
  UserRound,
} from "lucide-react-native";
import { useMemo } from "react";
import { ScrollView, View } from "react-native";

import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ActionCard } from "@/src/components/cards/ActionCard";
import { useAuthStore } from "@/src/stores/useAuthStore";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Bom dia";
  }

  if (hour < 18) {
    return "Boa tarde";
  }

  return "Boa noite";
};

export default function Home() {
  const router = useRouter();
  const store = useAuthStore();
  const driverName = store.user?.unique_name ?? "Motorista";

  const greeting = useMemo(() => getGreeting(), []);

  const firstName = driverName.split(" ")[0];

  const handleLogOut = () => {
    store.signOut();
    router.push("/(auth)/login");
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      showsVerticalScrollIndicator={false}
    >
      <View className="bg-[#195FA0] pt-6 pb-24 px-6 rounded-b-[36px] overflow-hidden relative">
        <View
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5"
          pointerEvents="none"
        />
        <View
          className="absolute top-20 -left-12 w-32 h-32 rounded-full bg-white/5"
          pointerEvents="none"
        />

        <VStack>
          <HStack className="items-center" space="xs">
            <Text className="text-blue-100 font-medium text-sm">
              {greeting},
            </Text>
            {/* <Icon as={Sparkles} color="#fbbf24" size="xs" /> */}
          </HStack>
          <Text className="text-white text-3xl font-bold mt-1">
            {firstName}!
          </Text>
          <Text className="text-blue-100 text-xs mt-2 opacity-80">
            Pronto para a próxima viagem?
          </Text>
        </VStack>
      </View>

      <VStack space="xl" className="px-5 -mt-16 pb-10">
        <Pressable
          onPress={() => router.push("/agendamento/agendar")}
          className="active:scale-[0.98]"
          style={{
            shadowColor: "#195FA0",
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.18,
            shadowRadius: 20,
            elevation: 8,
          }}
        >
          <View className="bg-white rounded-3xl p-5 border border-blue-100 overflow-hidden relative">
            <View
              className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-blue-50"
              pointerEvents="none"
            />
            <View
              className="absolute -right-2 -top-2 w-20 h-20 rounded-full bg-blue-100/60"
              pointerEvents="none"
            />

            <HStack className="justify-between items-start mb-5">
              <View
                className="bg-[#195FA0] p-3.5 rounded-2xl"
                style={{
                  shadowColor: "#195FA0",
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                }}
              >
                <Icon as={CalendarPlus} color="white" size="xl" />
              </View>
              <HStack
                className="items-center bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100"
                space="xs"
              >
                <View className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <Text className="text-emerald-700 text-[11px] font-bold">
                  Disponível
                </Text>
              </HStack>
            </HStack>

            <Text className="text-gray-900 font-bold text-2xl">Nova Carga</Text>
            <Text className="text-gray-500 text-sm mt-1.5 leading-5">
              Inicie um novo agendamento de transporte em poucos passos.
            </Text>

            <HStack className="mt-5 items-center justify-between pt-4 border-t border-gray-100">
              <Text className="text-[#195FA0] font-semibold text-sm">
                Começar agora
              </Text>
              <View className="bg-[#195FA0] p-1.5 rounded-full">
                <Icon as={ChevronRight} color="white" size="sm" />
              </View>
            </HStack>
          </View>
        </Pressable>

        <VStack space="md">
          <HStack className="justify-between items-end px-1">
            <View>
              <Text className="text-gray-900 font-bold text-lg">
                Acesso Rápido
              </Text>
              <Text className="text-gray-400 text-xs mt-0.5">
                Suas ferramentas em um toque
              </Text>
            </View>
          </HStack>

          <HStack space="md">
            <ActionCard
              title="Agendamentos"
              subtitle="Suas reservas"
              icon={CalendarRange}
              onPress={() => router.push("/agendamento/meus-agendamentos")}
              color="blue"
            />
            <ActionCard
              title="Notificações"
              subtitle="Avisos e alertas"
              icon={Bell}
              onPress={() => router.push("/notificacoes/notificacao")}
              color="orange"
            />
          </HStack>
          <HStack space="md">
            <ActionCard
              title="Meu Perfil"
              subtitle="Dados pessoais"
              icon={UserRound}
              onPress={() => router.push("/(app)/usuario/perfl")}
              color="purple"
            />
            <ActionCard
              title="Sair"
              subtitle="Encerrar sessão"
              icon={LogOut}
              onPress={handleLogOut}
              color="red"
            />
          </HStack>
        </VStack>

        <View className="items-center mt-2">
          <Text className="text-gray-400 text-[11px]">
            TruckFlow Driver • v1.0
          </Text>
        </View>
      </VStack>
    </ScrollView>
  );
}
