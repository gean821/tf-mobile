
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
    ChevronRight,
} from "lucide-react-native";
import { View } from "react-native";

export const OptionCard = ({ icon: IconComp, title, subtitle, onPress, isPrimary = false }: any) => (
    <Pressable
        onPress={onPress}
        className={`w-full p-5 rounded-2xl mb-4 border ${isPrimary ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'} shadow-sm active:opacity-70`}
    >
        <HStack className="items-center justify-between">
            <HStack space="md" className="items-center flex-1">
                <View className={`p-3 rounded-full ${isPrimary ? 'bg-[#195FA0]' : 'bg-gray-100'}`}>
                    <Icon as={IconComp} size="xl" className={isPrimary ? 'text-white' : 'text-gray-600'} />
                </View>
                <VStack>
                    <Text className={`font-bold text-lg ${isPrimary ? 'text-[#195FA0]' : 'text-gray-800'}`}>
                        {title}
                    </Text>
                    <Text className="text-gray-500 text-xs flex-wrap">
                        {subtitle}
                    </Text>
                </VStack>
            </HStack>
            <Icon as={ChevronRight} size="md" className="text-gray-400" />
        </HStack>
    </Pressable>
);

