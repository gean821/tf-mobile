import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import JwtPayload from "../Entities/JwtPayload";
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  token: string | null;
  user: JwtPayload | null;
  isLoading: boolean;

  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: true,

  signIn: async (token: string) => {
    try {

      const decoded = jwtDecode<JwtPayload>(token);

      await SecureStore.setItemAsync("user_session_token", token);


      set({ token, user: decoded });
    } catch (error) {
      console.error("Erro ao salvar sessão", error);
    }
  },

  signOut: async () => {
    await SecureStore.deleteItemAsync("user_session_token");
    set({ token: null, user: null });
  },

  loadSession: async () => {
    set({ isLoading: true });
    try {
      const token = await SecureStore.getItemAsync("user_session_token");

      if (token) {
        const decoded = jwtDecode<JwtPayload>(token);

        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          await SecureStore.deleteItemAsync("user_session_token");
          set({ token: null, user: null });
        } else {
          set({ token, user: decoded });
        }
      }
    } catch (error) {
      console.error("Erro ao restaurar sessão", error);
      set({ token: null, user: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));