import { useRouter } from "expo-router";
import { Bell, CalendarPlus, CalendarRange, LogOut, Settings } from "lucide-react-native";
import { ScrollView, View } from "react-native";

import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuthStore } from "@/src/stores/useAuthStore";

const ActionCard = ({ title, icon: IconComponent, onPress, color = "blue" }: any) => (
    <Pressable 
        onPress={onPress} 
        className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 items-center justify-center h-32 active:opacity-70"
    >
        <View className={`p-3 rounded-full mb-3 ${color === 'blue' ? 'bg-blue-100' : 'bg-orange-100'}`}>
            <Icon as={IconComponent} size="xl" className={color === 'blue' ? 'text-[#195FA0]' : 'text-orange-600'} />
        </View>
        <Text className="font-bold text-gray-700 text-center text-sm">
            {title}
        </Text>
    </Pressable>
);

export default function Home() {
    const router = useRouter();
    const store = useAuthStore();
    const driverName = store.user?.unique_name;

    const handleLogOut = () => {
        store.signOut();
        router.push('/(auth)/login')
    }

    return (
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>

            <View className="bg-[#195FA0] pb-10 pt-2 px-6 rounded-b-[40px]">
                <VStack>
                    <Text className="text-blue-200 font-medium text-sm">Bem-vindo de volta,</Text>
                    <Text className="text-white text-3xl font-bold mt-1">
                        {driverName}!
                    </Text>
                    <Text className="text-blue-100 text-xs mt-2 opacity-80">
                        Motorista Parceiro
                    </Text>
                </VStack>
            </View>

            <VStack space="xl" className="px-6 -mt-8 pb-10">
                                
                <View className="bg-white p-1 rounded-3xl shadow-lg shadow-blue-900/20">
                    <Pressable 
                        onPress={() => router.push("/agendamento/agendar")}
                        className="bg-white rounded-[20px] p-5 border border-blue-50 active:bg-gray-50"
                    >
                        <HStack className="justify-between items-center mb-4">
                            <View className="bg-blue-600 p-3 rounded-xl">
                                <Icon as={CalendarPlus} color="white" size="xl" />
                            </View>
                            <View className="bg-green-100 px-3 py-1 rounded-full">
                                <Text className="text-green-700 text-xs font-bold">Disponível</Text>
                            </View>
                        </HStack>
                        
                        <Text className="text-gray-800 font-bold text-xl">Nova Carga</Text>
                        <Text className="text-gray-500 text-xs mt-1">
                            Toque para iniciar um novo agendamento de transporte.
                        </Text>
                    </Pressable>
                </View>

                {/* Grid Secundário */}
                <VStack space="md">
                    <Text className="text-gray-800 font-bold text-lg ml-1">Acesso Rápido</Text>
                    
                    <HStack space="md">
                        <ActionCard 
                            title="Agendamentos" 
                            icon={CalendarRange} 
                            onPress={() => router.push("/agendamento/meus-agendamentos")} 
                        />
                        <ActionCard 
                            title="Notificações" 
                            icon={Bell} 
                            onPress={() => router.push("/notificacoes/notificacao")} 
                            color="orange"
                        />
                    </HStack>
                     <HStack space="md">
                        <ActionCard 
                            title="Meu Perfil" 
                            icon={Settings} 
                            onPress={() => router.push("/(app)/usuario/perfl")} 
                        />
                        

                        <ActionCard 
                            title="Sair" 
                            icon={LogOut} 
                            onPress={(handleLogOut)} 
                        />
                        <View className="flex-4" />
                    </HStack>

                </VStack>

            </VStack>
        </ScrollView>
    );
}