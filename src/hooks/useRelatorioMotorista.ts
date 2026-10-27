import { useMemo, useState } from "react";

import { useRelatorioMotoristaQuery } from "../queries/agendamento.queries";
import {
  descreverIntervalo,
  intervaloDoPeriodo,
  PeriodoRelatorio,
} from "../utils/relatorio";

export function useRelatorioMotorista(periodoInicial: PeriodoRelatorio = "mes") {
  const [periodo, setPeriodo] = useState<PeriodoRelatorio>(periodoInicial);
  const intervalo = useMemo(() => intervaloDoPeriodo(periodo), [periodo]);

  const query = useRelatorioMotoristaQuery(intervalo);
  const relatorio = query.data;

  const descricaoPeriodo = descreverIntervalo(intervalo.inicio, intervalo.fim);
  const descricaoAnterior = relatorio
    ? descreverIntervalo(relatorio.inicioAnterior, relatorio.fimAnterior)
    : null;

  return {
    periodo,
    setPeriodo,
    relatorio,
    descricaoPeriodo,
    descricaoAnterior,
    carregando: query.isLoading,
    atualizando: query.isFetching && !query.isLoading,
    erro: query.isError,
    recarregar: query.refetch,
  };
}
