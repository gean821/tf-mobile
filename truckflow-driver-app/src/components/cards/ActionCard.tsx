import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

export const ActionCard = ({
  title,
  icon: IconComponent,
  onPress,
  color = "blue",
}: any) => (
  <Pressable
    onPress={onPress}
    className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 items-center justify-center h-32 active:opacity-70"
  >
    <View
      className={`p-3 rounded-full mb-3 ${color === "blue" ? "bg-blue-100" : "bg-orange-100"}`}
    >
      <Icon
        as={IconComponent}
        size="xl"
        className={color === "blue" ? "text-[#195FA0]" : "text-orange-600"}
      />
    </View>
    <Text className="font-bold text-gray-700 text-center text-sm">{title}</Text>
  </Pressable>
);
