import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { IDLE_TIMEOUT_MS, LAST_ACTIVITY_KEY } from "../constants/session";
import { useAuthStore } from "../stores/useAuthStore";

const AVISO_MS = 60_000;
const THROTTLE_MS = 5_000;

export function useIdleLogout() {
  // !!token e não token: cada refresh troca o token e resetaria o efeito
  const logado = useAuthStore((s) => !!s.token);
  const signOut = useAuthStore((s) => s.signOut);

  const [avisoVisivel, setAvisoVisivel] = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(0);

  const ultimaAtividade = useRef(Date.now());
  const ultimaGravacao = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contagem = useRef<ReturnType<typeof setInterval> | null>(null);

  const limparTimers = () => {
    if (timer.current) clearTimeout(timer.current);
    if (contagem.current) clearInterval(contagem.current);
    timer.current = null;
    contagem.current = null;
  };

  const gravar = (instante: number) => {
    ultimaGravacao.current = instante;
    AsyncStorage.setItem(LAST_ACTIVITY_KEY, String(instante)).catch(() => {});
  };

  const registrarAtividade = useCallback((forcar = false) => {
    const agora = Date.now();
    ultimaAtividade.current = agora;
    if (forcar || agora - ultimaGravacao.current > THROTTLE_MS) gravar(agora);
  }, []);

  // UM timeout até o deadline; ao disparar, relê a última atividade (não reseta a cada toque)
  const verificar = useCallback(() => {
    limparTimers();
    const restante = ultimaAtividade.current + IDLE_TIMEOUT_MS - Date.now();

    if (restante <= 0) {
      setAvisoVisivel(false);
      signOut("inatividade");
      return;
    }

    if (restante > AVISO_MS) {
      setAvisoVisivel(false);
      timer.current = setTimeout(verificar, restante - AVISO_MS);
      return;
    }

    setAvisoVisivel(true);
    setSegundosRestantes(Math.ceil(restante / 1000));
    contagem.current = setInterval(() => {
      setSegundosRestantes((s) => Math.max(s - 1, 0));
    }, 1000);
    timer.current = setTimeout(verificar, restante);
  }, [signOut]);

  const continuar = useCallback(() => {
    registrarAtividade(true);
    verificar();
  }, [registrarAtividade, verificar]);

  const sair = useCallback(() => {
    limparTimers();
    setAvisoVisivel(false);
    signOut();
  }, [signOut]);

  useEffect(() => {
    if (!logado) {
      limparTimers();
      setAvisoVisivel(false);
      return;
    }

    ultimaAtividade.current = Date.now();
    verificar();

    // timers JS param em background; ao voltar, recalcula pelo relógio (background conta)
    const sub = AppState.addEventListener("change", (estado) => {
      if (estado === "active") verificar();
      else if (estado === "background") gravar(ultimaAtividade.current);
    });

    return () => {
      sub.remove();
      limparTimers();
    };
  }, [logado, verificar]);

  return { avisoVisivel, segundosRestantes, registrarAtividade, continuar, sair };
}
