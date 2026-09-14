import Constants from "expo-constants";
import { Platform } from "react-native";

let Notifications: typeof import("expo-notifications") | null = null;
try {
  Notifications = require("expo-notifications");
} catch {
  // Expo Go: módulo nativo não disponível
}

let Device: typeof import("expo-device") | null = null;
try {
  Device = require("expo-device");
} catch {
  // Expo Go: módulo nativo não disponível
}
import { PlataformaDispositivo } from "../enums/TipoNotificacao";
import NotificacaoService from "./NotificacaoService";

/**
 * Fluxo Expo Push pra motoristas:
 * 1. Pede permissão (idempotente — não pede de novo se já tem).
 * 2. Obtém ExpoPushToken via Notifications.getExpoPushTokenAsync.
 * 3. Registra o token no backend (POST /v1/dispositivos/registrar).
 * Chamado no _layout após login OK e em cold start (renovação preventiva).
 */
export default class PushRegistrationService {
  static async ensureRegistered(): Promise<void> {
    if (!Notifications || !Device?.isDevice) {
      console.info("[push] Push não disponível (Expo Go ou não é device físico), skip registro.");
      return;
    }

    const granted = await this.requestPermission();
    if (!granted) {
      console.warn("[push] Permissão negada pelo usuário; sem push.");
      return;
    }

    try {
      const token = await this.fetchExpoToken();
      if (!token) {
        return;
      }   

      await NotificacaoService.registrarDispositivo({
        expoPushToken: token,
        plataforma: Platform.OS === "ios" ? PlataformaDispositivo.Ios : PlataformaDispositivo.Android,
        appVersion: Constants.expoConfig?.version ?? undefined,
      });

      console.info("[push] Dispositivo registrado.");
    } catch (err) {
      console.warn("[push] Falha ao registrar dispositivo:", err);
    }
  }

  private static async requestPermission(): Promise<boolean> {
    if (!Notifications) return false;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    if (existingStatus === "granted") {
      return true;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  }

  private static async fetchExpoToken(): Promise<string | null> {
    if (!Notifications) return null;
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    const tokenResponse = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined
    );

    return tokenResponse?.data ?? null;
  }
}