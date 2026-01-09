export default interface motoristaUpdateDto {
    username: string;
    nomeReal: string;
    email: string;
    password: string;
    telefone: string;
    placaVeiculo?: string;
    tipoVeiculo?: string;
}