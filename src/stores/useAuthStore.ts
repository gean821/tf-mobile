import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { create } from "zustand";
import RefreshMobileResponseDto from "../Dtos/auth/RefreshMobileResponseDto";
import JwtPayload from "../Entities/JwtPayload";
import { IDLE_TIMEOUT_MS, LAST_ACTIVITY_KEY } from "../constants/session";

export const REFRESH_TOKEN_KEY = "tf_refresh";
export const ACCESS_TOKEN_KEY = "tf_access";

export function isSessaoRecusada(error: unknown): boolean {
  if (error instanceof Error && error.message === "no_refresh_token") {
    return true;
  }

  return axios.isAxiosError(error) && error.response?.status === 401;
}

function salvarAccessToken(token: string) {
  SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token).catch((error) =>
    console.error("Erro ao salvar access token", error)
  );
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  tokenExpiresAt: string | null;
  user: JwtPayload | null;
  isLoading: boolean;
  motivoLogout: string | null;

  signIn: (token: string, refreshToken: string, tokenExpiresAt: string) => Promise<void>;
  signOut: (motivo?: string) => Promise<void>;
  limparMotivoLogout: () => void;
  loadSession: () => Promise<void>;

  setAccess: (token: string, tokenExpiresAt: string) => void;
  setRefresh: (refreshToken: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  refreshToken: null,
  tokenExpiresAt: null,
  user: null,
  isLoading: true,
  motivoLogout: null,

  signIn: async (token, refreshToken, tokenExpiresAt) => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      await AsyncStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));

      if (refreshToken) {
        await SecureStore.setItemAsync(
          REFRESH_TOKEN_KEY,
          String(refreshToken)
        );
      }

      salvarAccessToken(token);

      set({
        token,
        refreshToken: refreshToken ?? null,
        tokenExpiresAt,
        user: decoded,
        motivoLogout: null,
      });
    } catch (error) {
      console.error("Erro ao salvar sessão", error);
    }
  },

  setAccess: (token, tokenExpiresAt) => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      salvarAccessToken(token);
      set({ token, tokenExpiresAt, user: decoded });
    } catch (error) {
      console.error("Erro ao decodificar access token", error);
    }
  },

  setRefresh: async (refreshToken) => {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    set({ refreshToken });
  },

  signOut: async (motivo) => {
    const refresh =
      get().refreshToken ?? (await SecureStore.getItemAsync(REFRESH_TOKEN_KEY));

    if (refresh) {
      try {
        const { default: http } = await import("../services/http/axios");
        await http.post("/Auth/logout-mobile", { refreshToken: refresh });
      } catch { }
    }

    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await AsyncStorage.removeItem(LAST_ACTIVITY_KEY);
    set({ token: null, refreshToken: null, tokenExpiresAt: null, user: null, motivoLogout: motivo ?? null });
  },

  limparMotivoLogout: () => set({ motivoLogout: null }),

  loadSession: async () => {
    set({ isLoading: true });
    try {
      const refresh = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      if (!refresh) {
        set({ token: null, refreshToken: null, tokenExpiresAt: null, user: null });
        return;
      }

      const ultimaAtividade = Number(await AsyncStorage.getItem(LAST_ACTIVITY_KEY));
      if (ultimaAtividade && Date.now() - ultimaAtividade > IDLE_TIMEOUT_MS) {
        await get().signOut("inatividade");
        return;
      }

      set({ refreshToken: refresh });

      try {
        const { default: http } = await import("../services/http/axios");
        const { data } = await http.post<RefreshMobileResponseDto>(
          "/Auth/refresh-mobile",
          { refreshToken: refresh },
        );

        const decoded = jwtDecode<JwtPayload>(data.token);
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, data.refreshToken);
        salvarAccessToken(data.token);

        set({
          token: data.token,
          refreshToken: data.refreshToken,
          tokenExpiresAt: data.tokenExpiresAt,
          user: decoded,
        });
        await AsyncStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
      } catch (error) {
        if (isSessaoRecusada(error)) {
          await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
          await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
          set({ token: null, refreshToken: null, tokenExpiresAt: null, user: null });
          return;
        }

        console.warn("[auth] refresh indisponível (sem rede?); mantendo a sessão salva", error);

        const ultimoAccess = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        if (ultimoAccess) {
          set({ token: ultimoAccess, user: jwtDecode<JwtPayload>(ultimoAccess) });
        }
      }
    } catch (error) {
      console.error("Erro ao restaurar sessão", error);
      set({ token: null, refreshToken: null, tokenExpiresAt: null, user: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
