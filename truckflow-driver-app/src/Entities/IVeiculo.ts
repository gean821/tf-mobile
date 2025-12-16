import { TipoVeiculo } from "../enums/TipoVeiculo";
import type EntidadeBase from "./IEntidadeBase";
import IMotorista from "./IMotorista";

export default interface Veiculo extends EntidadeBase {
    nome: string
    placa: string | undefined; 
    tipoVeiculo: TipoVeiculo;
    motorista: IMotorista;
}