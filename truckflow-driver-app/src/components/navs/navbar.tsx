import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from '@/components/ui/pressable';
import { useRouter } from "expo-router";
import { Bell, User } from "lucide-react-native";
import { Image, StatusBar, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Navbar = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        
        <View 
            className="bg-[#195FA0] z-50"
            style={{ paddingTop: insets.top }} 
        >
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            
            <HStack className="justify-between items-center px-5 py-3">
                
                <Image
                    source={require("assets/images/logo.png")}
                    style={{ width: 120, height: 50 }}
                />

                <HStack space="lg" className="items-center">
                    <Pressable 
                        className="bg-white/20 p-2 rounded-full active:bg-white/30"
                        onPress={() => router.push("/notificacoes/notificacao")}
                    >
                        <Icon as={Bell} color="white" size="md" />
                    </Pressable>

                    <Pressable 
                        onPress={() => router.push("/(app)/usuario/perfl")}
                        className="border-2 border-white rounded-full"
                    >
                        <View className="bg-white p-1 rounded-full">
                            <Icon as={User} color="#195FA0" size="md" />
                        </View>
                    </Pressable>
                </HStack>
            </HStack>
        </View>
    );
};