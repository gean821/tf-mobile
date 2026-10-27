export type PeriodoRelatorio = "mes" | "mesPassado" | "3meses" | "12meses";

export const PERIODOS_RELATORIO: { valor: PeriodoRelatorio; rotulo: string }[] = [
  { valor: "mes", rotulo: "Este mês" },
  { valor: "mesPassado", rotulo: "Mês passado" },
  { valor: "3meses", rotulo: "3 meses" },
  { valor: "12meses", rotulo: "12 meses" },
];

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const doisDigitos = (n: number) => String(n).padStart(2, "0");

export const paraDataIso = (data: Date) =>
  `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`;

const deDataIso = (iso: string) => {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return new Date(ano, mes - 1, dia);
};

export function intervaloDoPeriodo(periodo: PeriodoRelatorio, hoje = new Date()) {
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();

  switch (periodo) {
    case "mesPassado":
      return {
        inicio: paraDataIso(new Date(ano, mes - 1, 1)),
        fim: paraDataIso(new Date(ano, mes, 0)),
      };
    case "3meses":
      return { inicio: paraDataIso(new Date(ano, mes - 2, 1)), fim: paraDataIso(hoje) };
    case "12meses":
      return { inicio: paraDataIso(new Date(ano, mes - 11, 1)), fim: paraDataIso(hoje) };
    default:
      return { inicio: paraDataIso(new Date(ano, mes, 1)), fim: paraDataIso(hoje) };
  }
}

export function descreverIntervalo(inicioIso: string, fimIso: string) {
  const inicio = deDataIso(inicioIso);
  const fim = deDataIso(fimIso);

  if (inicio.getFullYear() === fim.getFullYear() && inicio.getMonth() === fim.getMonth()) {
    return `${inicio.getDate()} a ${fim.getDate()} de ${MESES[fim.getMonth()]}`;
  }

  const mesmoAno = inicio.getFullYear() === fim.getFullYear();
  const inicioTexto = `${inicio.getDate()} ${MESES[inicio.getMonth()]}${mesmoAno ? "" : ` ${inicio.getFullYear()}`}`;
  return `${inicioTexto} a ${fim.getDate()} ${MESES[fim.getMonth()]} ${fim.getFullYear()}`;
}

export function formatarPeso(kg: number) {
  if (kg < 1000) {
    return { valor: Math.round(kg).toLocaleString("pt-BR"), unidade: "kg" };
  }

  const toneladas = kg / 1000;
  return {
    valor: toneladas.toLocaleString("pt-BR", {
      minimumFractionDigits: toneladas < 100 ? 1 : 0,
      maximumFractionDigits: toneladas < 100 ? 1 : 0,
    }),
    unidade: "t",
  };
}

export const formatarPesoTexto = (kg: number) => {
  const { valor, unidade } = formatarPeso(kg);
  return `${valor} ${unidade}`;
};

export const formatarPercentual = (valor: number) =>
  `${valor.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;

export function formatarDataHora(iso: string) {
  const data = new Date(iso);
  const hoje = new Date();
  const amanha = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);
  const hora = data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  if (data.toDateString() === hoje.toDateString()) return `Hoje, ${hora}`;
  if (data.toDateString() === amanha.toDateString()) return `Amanhã, ${hora}`;

  return `${doisDigitos(data.getDate())}/${doisDigitos(data.getMonth() + 1)}, ${hora}`;
}
