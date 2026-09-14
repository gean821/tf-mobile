import type { TipoNotificacao, PrioridadeNotificacao } from "@/src/enums/TipoNotificacao";

export interface NotificacaoListItemDto {
  id: string;
  tipo: TipoNotificacao;
  prioridade: PrioridadeNotificacao;
  titulo: string;
  corpo: string;
  criadaEm: string;
  lidaEm: string | null;
  payloadJson: string;
}