import type { TipoNotificacao, PrioridadeNotificacao } from "@/src/enums/TipoNotificacao";

export interface NotificacaoListQueryDto {
  pageNumber: number;
  pageSize: number;
  unreadOnly?: boolean | null;
  tipo?: TipoNotificacao | null;
  prioridade?: PrioridadeNotificacao | null;
}