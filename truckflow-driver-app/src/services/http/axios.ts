import { useAuthStore } from "@/src/stores/useAuthStore";
import axios from "axios";
import { router } from "expo-router";

const http = axios.create(
  {
    baseURL: 'http://192.168.1.249:56611/v1/',
    headers: { 'X-Custom-Header': 'foobar' }
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
  (error) => {
    return Promise.reject(error);
  }
);

// --- INTERCEPTOR DE RESPOSTA (Trata Erros Globais) ---
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;

    if (response && response.status === 401) {
      console.warn("Sessão expirada. Deslogando...");
      await useAuthStore.getState().signOut();
      router.push('/(auth)/login');
    }

    return Promise.reject(error);
  }
);


export default http;




