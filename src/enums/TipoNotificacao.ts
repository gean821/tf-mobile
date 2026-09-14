export enum TipoNotificacao {
  AgendamentoCriado = 1,
  AgendamentoConfirmado = 2,
  AgendamentoCancelado = 3,
  AgendamentoReagendado = 4,
  AgendamentoExpirado = 5,
  MotoristaAtrasoInformado = 10,
  MotoristaChegou = 11,
  MotoristaSaiu = 12,
  JanelaPropxima = 20,
  MensagemManualAdmin = 30,
  MensagemManualMotorista = 31,
}

export enum PrioridadeNotificacao {
  Normal = 0,
  Alta = 1,
  Critica = 2,
}

export enum PlataformaDispositivo {
  Ios = 1,
  Android = 2,
}