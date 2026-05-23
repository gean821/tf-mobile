export interface PushPayloadData {
  notificacaoId?: string;
  tipo?: number;
  agendamentoId?: string;
}

export function isPushPayloadData(value: unknown): value is PushPayloadData {
  if (value === null || typeof value !== "object") {
    return false;
  } 

  const obj = value as Record<string, unknown>;
  
  const allowedString = (k: string) =>
    obj[k] === undefined || typeof obj[k] === "string";
  
  const allowedNumber = (k: string) =>
    obj[k] === undefined || typeof obj[k] === "number";

  return (
    allowedString("notificacaoId") &&
    allowedNumber("tipo") &&
    allowedString("agendamentoId")
  );
}