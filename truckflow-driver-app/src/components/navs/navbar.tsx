import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { useRouter } from "expo-router";
import { Bell, User } from "lucide-react-native";
import { Image, StatusBar, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Navbar = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{
                paddingTop: insets.top,
                backgroundColor: "#195FA0",
                shadowColor: "#0a2e52",
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 12,
                zIndex: 50,
            }}
        >
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 18,
                    paddingTop: 0,
                    paddingBottom: 4,
                }}
            >
                {/* Logo */}
                <Image
                    source={require("assets/images/logo.png")}
                    style={{ width: 180, height: 150, marginVertical: -40 }}
                    resizeMode="contain"
                />

                {/* Pill de ações */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "rgba(255,255,255,0.13)",
                        borderRadius: 999,
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.22)",
                        paddingHorizontal: 15,
                        paddingVertical: 8,
                        gap: 10,
                    }}
                >
                    {/* Notificações */}
                    <Pressable
                        onPress={() => router.push("/notificacoes/notificacao")}
                        style={({ pressed }) => ({
                            borderRadius: 999,
                            padding: 9,
                            backgroundColor: pressed ? "rgba(255,255,255,0.18)" : "transparent",
                        })}
                    >
                        <View>
                            <Icon as={Bell} color="white" size="md" />
                            <View
                                style={{
                                    position: "absolute",
                                    top: -3,
                                    right: -3,
                                    width: 11,
                                    height: 11,
                                    backgroundColor: "#FB923C",
                                    borderRadius: 6,
                                    borderWidth: 2,
                                    borderColor: "#195FA0",
                                }}
                            />
                        </View>
                    </Pressable>

                    {/* Divisor */}
                    <View
                        style={{
                            width: 1,
                            height: 22,
                            backgroundColor: "rgba(255,255,255,0.25)",
                            marginHorizontal: 2,
                        }}
                    />

                    {/* Perfil */}
                    <Pressable
                        onPress={() => router.push("/(app)/usuario/perfl")}
                        style={({ pressed }) => ({
                            borderRadius: 999,
                            padding: 9,
                            backgroundColor: pressed ? "rgba(255,255,255,0.18)" : "transparent",
                        })}
                    >
                        <Icon as={User} color="white" size="md" />
                    </Pressable>
                </View>
            </View>
        </View>
    );
};
