import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import VersaoMinimaResponseDto from "../Dtos/app/VersaoMinimaResponseDto";
import http from "../services/http/axios";

export function versaoMenorQue(atual: string, minima: string): boolean {
  const a = atual.split(".").map((p) => parseInt(p, 10) || 0);
  const m = minima.split(".").map((p) => parseInt(p, 10) || 0);

  for (let i = 0; i < Math.max(a.length, m.length); i++) {
    const diff = (a[i] ?? 0) - (m[i] ?? 0);
    if (diff !== 0) {
      return diff < 0;
    }
  }

  return false;
}

export function useVersaoMinima() {
  const [atualizacaoObrigatoria, setAtualizacaoObrigatoria] = useState(false);
  const [urlLoja, setUrlLoja] = useState<string | null>(null);

  useEffect(() => {
    const versaoAtual = Constants.expoConfig?.version;
    if (!versaoAtual || Platform.OS === "web") {
      return;
    }

    http
      .get<VersaoMinimaResponseDto>("/app/versao-minima", { timeout: 8000 })
      .then(({ data }) => {
        const minima = Platform.OS === "ios" ? data.ios : data.android;
        setUrlLoja((Platform.OS === "ios" ? data.urlLojaIos : data.urlLojaAndroid) ?? null);
        setAtualizacaoObrigatoria(versaoMenorQue(versaoAtual, minima));
      })
      .catch(() => {
        console.warn("[versao] não foi possível checar a versão mínima; seguindo sem bloquear");
      });
  }, []);

  return { atualizacaoObrigatoria, urlLoja };
}
