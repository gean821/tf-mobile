import type { PlataformaDispositivo } from "@/src/enums/TipoNotificacao";

export interface RegistrarDispositivoDto {
  expoPushToken: string;
  plataforma: PlataformaDispositivo;
  appVersion?: string;
}