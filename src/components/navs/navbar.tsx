import { Icon } from "@/components/ui/icon";
import { PRIMARY_500 } from "@/src/constants/colors";
import { useNotificacoesUnreadCountQuery } from "@/src/queries/notificacao.queries";
import { useRouter } from "expo-router";
import { Bell, User } from "lucide-react-native";
import { Image, Pressable, StatusBar, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Navbar = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: unreadCount = 0 } = useNotificacoesUnreadCountQuery();

  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: PRIMARY_500,
        shadowColor: "#0a2e52",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 12,
        zIndex: 50,
      }}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

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
          <Pressable
            onPress={() => router.push("/notificacoes/notificacao")}
            accessibilityLabel="Notificações"
            accessibilityRole="button"
            hitSlop={8}
            android_ripple={{ color: "rgba(255,255,255,0.25)", borderless: true, radius: 22 }}
            style={({ pressed }) => ({
              borderRadius: 999,
              padding: 9,
              backgroundColor: pressed ? "rgba(255,255,255,0.28)" : "transparent",
              transform: [{ scale: pressed ? 0.9 : 1 }],
            })}
          >
            <View>
              <Icon as={Bell} color="white" size="md" />
              {unreadCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -6,
                    minWidth: 16,
                    height: 16,
                    paddingHorizontal: 3,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#FB923C",
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: PRIMARY_500,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 9,
                      lineHeight: 11,
                      fontWeight: "700",
                    }}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Text>
                </View>
              )}
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
            accessibilityLabel="Meu perfil"
            accessibilityRole="button"
            hitSlop={8}
            android_ripple={{ color: "rgba(255,255,255,0.25)", borderless: true, radius: 22 }}
            style={({ pressed }) => ({
              borderRadius: 999,
              padding: 9,
              backgroundColor: pressed ? "rgba(255,255,255,0.28)" : "transparent",
              transform: [{ scale: pressed ? 0.9 : 1 }],
            })}
          >
            <Icon as={User} color="white" size="md" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};
