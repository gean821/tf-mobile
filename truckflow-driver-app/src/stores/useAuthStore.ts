import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { create } from "zustand";
import JwtPayload from "../Entities/JwtPayload";
import RefreshMobileResponseDto from "../Dtos/auth/RefreshMobileResponseDto";

export const REFRESH_TOKEN_KEY = "tf_refresh";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  tokenExpiresAt: string | null;
  user: JwtPayload | null;
  isLoading: boolean;

  signIn: (token: string, refreshToken: string, tokenExpiresAt: string) => Promise<void>;
  signOut: () => Promise<void>;
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

  signIn: async (token, refreshToken, tokenExpiresAt) => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      set({ token, refreshToken, tokenExpiresAt, user: decoded });
    } catch (error) {
      console.error("Erro ao salvar sessão", error);
    }
  },

  setAccess: (token, tokenExpiresAt) => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      set({ token, tokenExpiresAt, user: decoded });
    } catch (error) {
      console.error("Erro ao decodificar access token", error);
    }
  },

  setRefresh: async (refreshToken) => {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    set({ refreshToken });
  },

  signOut: async () => {
    const refresh =
      get().refreshToken ?? (await SecureStore.getItemAsync(REFRESH_TOKEN_KEY));

    if (refresh) {
      try {
        const { default: http } = await import("../services/http/axios");
        await http.post("/Auth/logout-mobile", { refreshToken: refresh });
      } catch {
        // logout local prossegue mesmo se servidor falhar
      }
    }

    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    set({ token: null, refreshToken: null, tokenExpiresAt: null, user: null });
  },

  loadSession: async () => {
    set({ isLoading: true });
    try {
      const refresh = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      if (!refresh) {
        set({ token: null, refreshToken: null, tokenExpiresAt: null, user: null });
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

        set({
          token: data.token,
          refreshToken: data.refreshToken,
          tokenExpiresAt: data.tokenExpiresAt,
          user: decoded,
        });
      } catch {
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        set({ token: null, refreshToken: null, tokenExpiresAt: null, user: null });
      }
    } catch (error) {
      console.error("Erro ao restaurar sessão", error);
      set({ token: null, refreshToken: null, tokenExpiresAt: null, user: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));