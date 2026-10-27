import { TrendingDown, TrendingUp } from "lucide-react-native";

import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { formatarPercentual } from "@/src/utils/relatorio";

interface VariacaoBadgeProps {
  valor: number | null;
  claro?: boolean;
}

export function VariacaoBadge({ valor, claro = false }: VariacaoBadgeProps) {
  if (valor === null) {
    return null;
  }

  const subiu = valor >= 0;
  const fundo = claro ? "bg-white/15" : subiu ? "bg-emerald-50" : "bg-rose-50";
  const texto = claro
    ? "text-white"
    : subiu
      ? "text-emerald-700"
      : "text-rose-600";

  return (
    <HStack
      className={`${fundo} self-start items-center px-2 py-1 rounded-full`}
      space="xs"
    >
      <Icon
        as={subiu ? TrendingUp : TrendingDown}
        size="xs"
        className={texto}
      />
      <Text className={`${texto} text-[11px] font-bold`}>
        {subiu ? "+" : ""}
        {formatarPercentual(valor)}
      </Text>
    </HStack>
  );
}
