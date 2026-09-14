import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

type ActionCardColor = "blue" | "orange" | "purple" | "red" | "green";

interface ActionCardProps {
  title: string;
  subtitle?: string;
  icon: any;
  onPress: () => void;
  color?: ActionCardColor;
}

const COLOR_STYLES: Record<
  ActionCardColor,
  { bg: string; iconBg: string; iconColor: string; ring: string }
> = {
  blue: {
    bg: "bg-white",
    iconBg: "bg-blue-50",
    iconColor: "text-[#195FA0]",
    ring: "border-blue-100/70",
  },
  orange: {
    bg: "bg-white",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    ring: "border-orange-100/70",
  },
  purple: {
    bg: "bg-white",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    ring: "border-violet-100/70",
  },
  red: {
    bg: "bg-white",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
    ring: "border-rose-100/70",
  },
  green: {
    bg: "bg-white",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    ring: "border-emerald-100/70",
  },
};

export const ActionCard = ({
  title,
  subtitle,
  icon: IconComponent,
  onPress,
  color = "blue",
}: ActionCardProps) => {
  const styles = COLOR_STYLES[color];

  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 ${styles.bg} p-4 rounded-2xl border ${styles.ring} h-32 active:opacity-80 active:scale-[0.98]`}
      style={{
        shadowColor: "#0f172a",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      <View
        className={`p-2.5 rounded-xl ${styles.iconBg} self-start`}
      >
        <Icon
          as={IconComponent}
          size="lg"
          className={styles.iconColor}
        />
      </View>
      <View className="mt-auto">
        <Text className="font-bold text-gray-800 text-sm">{title}</Text>
        {subtitle ? (
          <Text className="text-gray-400 text-[11px] mt-0.5" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
};
