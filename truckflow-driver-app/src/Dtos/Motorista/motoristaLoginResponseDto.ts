import MotoristaResponseDto from "./motoristaResponseDto";

export default interface MotoristaLoginResponseDto {
    token: string;
    tokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
    usuario: MotoristaResponseDto;
}
