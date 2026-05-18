import { useFocusEffect, useRouter } from "expo-router";
import { Edit3, LogOut, Mail, Phone, Shield, User } from "lucide-react-native";
import { useCallback } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useMotoristaProfileQuery } from "@/src/queries/motorista.queries";
import { useAuthStore } from "@/src/stores/useAuthStore";

const PLACEHOLDER = "Favor informar";

function InfoRow({
  icon,
  label,
  value,
  loading,
}: {
  icon: React.ComponentType<any>;
  label: string;
  value: string | null | undefined;
  loading?: boolean;
}) {
  const isEmpty = !value;
  return (
    <HStack className="items-center px-5 py-4" space="md">
      <View className="bg-blue-50 p-2.5 rounded-xl">
        <Icon as={icon} size="sm" className="text-[#195FA0]" />
      </View>
      <VStack space="xs" className="flex-1">
        <Text className="text-gray-400 text-xs font-medium">{label}</Text>
        {loading ? (
          <ActivityIndicator size="small" color="#195FA0" />
        ) : (
          <Text
            className={`text-sm font-semibold ${isEmpty ? "text-gray-300 italic" : "text-gray-800"}`}
          >
            {isEmpty ? PLACEHOLDER : value}
          </Text>
        )}
      </VStack>
    </HStack>
  );
}

export default function Perfil() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();

  const { data: profile, isLoading, refetch: refetchProfile } = useMotoristaProfileQuery();

  useFocusEffect(
    useCallback(() => {
      refetchProfile();
    }, [refetchProfile]),
  );

  const displayName = profile?.nomeReal || user?.unique_name || "Motorista";

  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const handleLogOut = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      showsVerticalScrollIndicator={false}
    >
      <View className="bg-[#195FA0] pt-8 pb-24 px-6 rounded-b-[36px] items-center overflow-hidden relative">
        <View
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5"
          pointerEvents="none"
        />
        <View
          className="absolute top-20 -left-12 w-32 h-32 rounded-full bg-white/5"
          pointerEvents="none"
        />

        <View
          className="w-24 h-24 rounded-full bg-white items-center justify-center border-4 border-white/30"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Text className="text-[#195FA0] text-3xl font-bold">{initials}</Text>
        </View>

        <Text className="text-white text-xl font-bold mt-4">{displayName}</Text>

        {profile?.nomeReal && (
          <Text className="text-blue-100 text-sm mt-0.5 opacity-80">
            @{user?.unique_name}
          </Text>
        )}

        <View className="bg-blue-400/30 px-4 py-1.5 rounded-full mt-3 border border-white/20">
          <Text className="text-white text-xs font-semibold">Motorista</Text>
        </View>
      </View>

      <VStack space="md" className="px-5 -mt-14 pb-10">
        <View
          className="bg-white rounded-3xl border border-gray-100 overflow-hidden"
          style={{
            shadowColor: "#195FA0",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 16,
            elevation: 4,
          }}
        >
          <InfoRow
            icon={User}
            label="Nome Completo"
            value={profile?.nomeReal}
            loading={isLoading}
          />
          <View className="h-px bg-gray-100 mx-4" />
          <InfoRow
            icon={Shield}
            label="Usuário"
            value={user?.unique_name}
            loading={false}
          />
          <View className="h-px bg-gray-100 mx-4" />
          <InfoRow
            icon={Mail}
            label="Email"
            value={user?.email}
            loading={false}
          />
          <View className="h-px bg-gray-100 mx-4" />
          <InfoRow
            icon={Phone}
            label="Telefone"
            value={profile?.telefone}
            loading={isLoading}
          />
        </View>

        <Pressable
          onPress={() => router.push("/(app)/usuario/editar-perfil")}
          className="active:scale-[0.98]"
          style={{
            shadowColor: "#195FA0",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 5,
          }}
        >
          <View className="bg-[#195FA0] rounded-2xl p-4 flex-row items-center justify-center">
            <Icon as={Edit3} color="white" size="md" />
            <Text className="text-white font-bold text-base ml-2">
              Editar Informações
            </Text>
          </View>
        </Pressable>

        <Pressable onPress={handleLogOut} className="active:scale-[0.98]">
          <View className="bg-white rounded-2xl p-4 flex-row items-center justify-center border border-red-100">
            <Icon as={LogOut} color="#ef4444" size="md" />
            <Text className="text-red-500 font-semibold text-base ml-2">
              Sair da Conta
            </Text>
          </View>
        </Pressable>
      </VStack>
    </ScrollView>
  );
}
