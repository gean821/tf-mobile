import Constants from "expo-constants";
import { Platform } from "react-native";
import { useVersaoMinimaQuery } from "../queries/app.queries";

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
  const versaoAtual = Constants.expoConfig?.version;
  const { data } = useVersaoMinimaQuery(!!versaoAtual && Platform.OS !== "web");

  if (!data || !versaoAtual) {
    return { atualizacaoObrigatoria: false, urlLoja: null };
  }

  const ios = Platform.OS === "ios";

  return {
    atualizacaoObrigatoria: versaoMenorQue(versaoAtual, ios ? data.ios : data.android),
    urlLoja: (ios ? data.urlLojaIos : data.urlLojaAndroid) ?? null,
  };
}
