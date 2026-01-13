export default interface MotoristaResponseDto {
    id: string;
    motoristaId: string;
    username: string;
    nomeReal: string;
    email: string;
    telefone: string;
    placaVeiculo?: string;
    tipoVeiculo?: string;
}