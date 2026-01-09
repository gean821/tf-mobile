import MotoristaResponseDto from "./motoristaResponseDto";

export default interface MotoristaLoginResponseDto {
    token: string;
    usuario: MotoristaResponseDto;
}