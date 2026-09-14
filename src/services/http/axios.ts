import { useAuthStore, REFRESH_TOKEN_KEY } from "@/src/stores/useAuthStore";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import RefreshMobileResponseDto from "../../Dtos/auth/RefreshMobileResponseDto";

const REFRESH_URL = "/Auth/refresh-mobile";
const SKIP_URLS = [
  REFRESH_URL,
  "/Auth/logout-mobile",
  "/AuthMotorista/login",
  "/AuthMotorista/register",
];

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const baseURL = process.env.EXPO_PUBLIC_API_URL;

if (!baseURL) {
  console.warn(
    "[http] EXPO_PUBLIC_API_URL não definido. Confira o arquivo .env e reinicie o Metro com `npx expo start -c`."
  );
}

const http = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export async function httpGet<T>(url: string) {
  const response = await http.get<T>(url);
  return response.data;
}

http.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let refreshPromise: Promise<RefreshMobileResponseDto> | null = null;

async function performRefresh(): Promise<RefreshMobileResponseDto> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const currentRefresh =
        useAuthStore.getState().refreshToken ??
        (await SecureStore.getItemAsync(REFRESH_TOKEN_KEY));

      if (!currentRefresh) {
        throw new Error("no_refresh_token");
      }

      const response = await http.post<RefreshMobileResponseDto>(REFRESH_URL, {
        refreshToken: currentRefresh,
      });

      const data = response.data;
      const store = useAuthStore.getState();
      store.setAccess(data.token, data.tokenExpiresAt);
      await store.setRefresh(data.refreshToken);

      return data;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;
    const url = original?.url ?? "";

    const skipRefresh =
      status !== 401 ||
      !original ||
      original._retry ||
      SKIP_URLS.some((u) => url.includes(u));

    if (skipRefresh) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      const refreshed = await performRefresh();
      original.headers["Authorization"] = `Bearer ${refreshed.token}`;
      return http(original);
    } catch (refreshError) {
      await useAuthStore.getState().signOut();
      router.replace("/(auth)/login");
      return Promise.reject(refreshError);
    }
  },
);

export default http;