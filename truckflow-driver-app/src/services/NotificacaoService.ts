import type { EnviarParaEmpresaDto } from "@/src/Dtos/Notificacao/EnviarParaEmpresaDto";
import type { NotificacaoListItemDto } from "@/src/Dtos/Notificacao/NotificacaoListItemDto";
import type { NotificacaoListQueryDto } from "@/src/Dtos/Notificacao/NotificacaoListQueryDto";
import type { RegistrarDispositivoDto } from "@/src/Dtos/Notificacao/RegistrarDispositivoDto";
import type { PagedResponse } from "@/src/Dtos/PagedResponse";
import http from "./http/axios";

export default class NotificacaoService {
  static async getPaged(
    query: NotificacaoListQueryDto
  ): Promise<PagedResponse<NotificacaoListItemDto>> {
    const { data } = await http.get<PagedResponse<NotificacaoListItemDto>>(
      "/notifications",
      { params: query }
    );
    return data;
  }

  static async unreadCount(): Promise<number> {
    const { data } = await http.get<{ count: number }>("/notifications/unread-count");
    return data.count;
  }

  static async markAsRead(id: string): Promise<void> {
    await http.patch(`/notifications/${id}/read`);
  }

  static async listarPorAgendamento(
    agendamentoId: string
  ): Promise<NotificacaoListItemDto[]> {
    const { data } = await http.get<NotificacaoListItemDto[]>(
      `/notifications/agendamento/${agendamentoId}`
    );
    return data;
  }

  static async enviarParaEmpresa(dto: EnviarParaEmpresaDto): Promise<void> {
    await http.post("/notifications/send-empresa", dto);
  }

  static async registrarDispositivo(dto: RegistrarDispositivoDto): Promise<void> {
    await http.post("/dispositivos/registrar", dto);
  }
}