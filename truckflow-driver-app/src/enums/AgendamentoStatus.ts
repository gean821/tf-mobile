export enum StatusAgendamento {
    Disponivel = "Disponivel", //VAGA ABERTA
    Pendente = "Pendente", //OPCIONAL
    Agendado = "Agendado", // MOTORISTA RESERVOU HORÁRIO
    EmAndamento = "EmAndamento", //CHECK-IN REALIZADO NA DOCA.
    Finalizado = "Finalizado", // CHECK-OUT REALIZADO
    Cancelado = "Cancelado" 
}