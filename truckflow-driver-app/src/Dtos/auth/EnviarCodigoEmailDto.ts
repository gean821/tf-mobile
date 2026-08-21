import { FinalidadeVerificacaoEmail } from "../../enums/FinalidadeVerificacaoEmail";

export default interface EnviarCodigoEmailDto {
  finalidade: FinalidadeVerificacaoEmail;
}