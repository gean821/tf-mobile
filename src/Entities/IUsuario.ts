import IAdministrador from "./IAdministrador";
import IAgendamento from "./IAgendamento";
import type EntidadeBase from "./IEntidadeBase";
import IMotorista from "./IMotorista";

export default interface Usuario extends EntidadeBase {
    administrador?: IAdministrador
    motorista?: IMotorista;
    agendamentos: IAgendamento[]
}
