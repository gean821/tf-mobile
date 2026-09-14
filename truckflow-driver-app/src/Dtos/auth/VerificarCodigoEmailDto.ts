import { FinalidadeVerificacaoEmail } from "../../enums/FinalidadeVerificacaoEmail";

export default interface VerificarCodigoEmailDto {
  codigo: string;
  finalidade: FinalidadeVerificacaoEmail;
}