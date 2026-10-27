export interface RelatorioMotoristaQueryDto {
  inicio: string;
  fim: string;
}

export interface RelatorioMotoristaResumoDto {
  agendamentos: number;
  concluidas: number;
  noPatio: number;
  aguardando: number;
  canceladas: number;
  naoCompareceu: number;
  pesoKg: number;
  comparecimentoPct: number | null;
}

export interface RelatorioMotoristaMesDto {
  ano: number;
  mes: number;
  rotulo: string;
  entregas: number;
  pesoKg: number;
}

export interface RelatorioMotoristaFatiaDto {
  nome: string;
  detalhe: string | null;
  entregas: number;
  pesoKg: number;
  percentual: number;
}

export interface RelatorioMotoristaProximoDto {
  id: string;
  dataInicio: string;
  unidadeEntrega: string | null;
  localDescarga: string | null;
  empresa: string | null;
}

export interface RelatorioMotoristaResponseDto {
  inicio: string;
  fim: string;
  inicioAnterior: string;
  fimAnterior: string;
  atual: RelatorioMotoristaResumoDto;
  anterior: RelatorioMotoristaResumoDto;
  variacaoEntregasPct: number | null;
  variacaoPesoPct: number | null;
  historicoMensal: RelatorioMotoristaMesDto[];
  porProduto: RelatorioMotoristaFatiaDto[];
  porLocal: RelatorioMotoristaFatiaDto[];
  proximoAgendamento: RelatorioMotoristaProximoDto | null;
}
