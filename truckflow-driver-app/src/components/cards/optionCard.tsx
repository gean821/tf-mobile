import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ChevronRight } from "lucide-react-native";
import { ActivityIndicator, View } from "react-native";

interface OptionCardProps {
  icon: any;
  title: string;
  subtitle?: string;
  badge?: string;
  onPress: () => void;
  isPrimary?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export const OptionCard = ({
  icon: IconComp,
  title,
  subtitle,
  badge,
  onPress,
  isPrimary = false,
  disabled = false,
  loading = false,
}: OptionCardProps) => {
  const isInactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isInactive}
      className={`w-full rounded-2xl overflow-hidden active:opacity-90 ${
        isInactive ? "opacity-60" : ""
      }`}
      style={{
        shadowColor: isPrimary ? "#195FA0" : "#0f172a",
        shadowOffset: { width: 0, height: isPrimary ? 10 : 3 },
        shadowOpacity: isPrimary ? 0.18 : 0.06,
        shadowRadius: isPrimary ? 16 : 8,
        elevation: isPrimary ? 8 : 2,
      }}
    >
      <View
        className={`p-5 border ${
          isPrimary
            ? "bg-[#195FA0] border-[#195FA0]"
            : "bg-white border-gray-100"
        }`}
      >
        <HStack className="items-center" space="md">
          <View
            className={`p-3.5 rounded-2xl ${
              isPrimary ? "bg-white/15" : "bg-blue-50"
            }`}
          >
            <Icon
              as={IconComp}
              size="lg"
              className={isPrimary ? "text-white" : "text-[#195FA0]"}
            />
          </View>

          <VStack className="flex-1">
            <HStack className="items-center" space="xs">
              <Text
                className={`font-bold text-base ${
                  isPrimary ? "text-white" : "text-gray-900"
                }`}
              >
                {title}
              </Text>
              {badge ? (
                <View
                  className={`px-2 py-0.5 rounded-full ${
                    isPrimary ? "bg-white/20" : "bg-blue-100"
                  }`}
                >
                  <Text
                    className={`text-[10px] font-bold ${
                      isPrimary ? "text-white" : "text-[#195FA0]"
                    }`}
                  >
                    {badge}
                  </Text>
                </View>
              ) : null}
            </HStack>
            {subtitle ? (
              <Text
                className={`text-xs mt-0.5 leading-4 ${
                  isPrimary ? "text-blue-100" : "text-gray-500"
                }`}
                numberOfLines={2}
              >
                {subtitle}
              </Text>
            ) : null}
          </VStack>

          {loading ? (
            <ActivityIndicator color={isPrimary ? "#fff" : "#195FA0"} />
          ) : (
            <View
              className={`p-1.5 rounded-full ${
                isPrimary ? "bg-white/20" : "bg-gray-50"
              }`}
            >
              <Icon
                as={ChevronRight}
                size="sm"
                className={isPrimary ? "text-white" : "text-gray-400"}
              />
            </View>
          )}
        </HStack>
      </View>
    </Pressable>
  );
};