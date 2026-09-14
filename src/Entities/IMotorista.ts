import type EntidadeBase from "./IEntidadeBase";
import Usuario from "./IUsuario";
import Veiculo from "./IVeiculo";

export default interface IMotorista extends EntidadeBase {
    nome: string;
    telefone: string;
    veiculos?: Veiculo[];
    usuario?: Usuario;
    usuarioId?: string; 
}