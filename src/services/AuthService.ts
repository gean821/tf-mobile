import MotoristaLoginDto from "../Dtos/Motorista/motoristaLoginDto";
import MotoristaLoginResponseDto from "../Dtos/Motorista/motoristaLoginResponseDto";
import MotoristaRegisterDto from "../Dtos/Motorista/motoristaRegisterDto";
import MotoristaResponseDto from "../Dtos/Motorista/motoristaResponseDto";
import motoristaUpdateDto from "../Dtos/Motorista/motoristaUpdateDto";
import VeiculoResponseDto from "../Dtos/Veiculo/veiculoResponseDto";
import EnviarCodigoEmailDto from "../Dtos/auth/EnviarCodigoEmailDto";
import VerificarCodigoEmailDto from "../Dtos/auth/VerificarCodigoEmailDto";
import VerificarCodigoEmailResponseDto from "../Dtos/auth/VerificarCodigoEmailResponseDto";
import AlterarSenhaComCodigoDto from "../Dtos/auth/AlterarSenhaComCodigoDto";
import AlterarEmailComCodigoDto from "../Dtos/auth/AlterarEmailComCodigoDto";
import http from "./http/axios";

export class AuthService {
    static async register(dto: MotoristaRegisterDto): Promise<MotoristaResponseDto> {
        const admin = await http.post('/AuthMotorista/register', dto);
        return admin.data;
    }

    static async login(dto: MotoristaLoginDto): Promise<MotoristaLoginResponseDto> {
        const { data } = await http.post<MotoristaLoginResponseDto>('/AuthMotorista/login', dto);
        return data;
    }

    static async getMe(): Promise<MotoristaResponseDto> {
        const { data } = await http.get<MotoristaResponseDto>('/Motorista');
        return data;
    }

    static async getVeiculos(): Promise<VeiculoResponseDto[]> {
        const { data } = await http.get<VeiculoResponseDto[]>('/Motorista/veiculos');
        return data;
    }

    static async update(dto: motoristaUpdateDto): Promise<MotoristaResponseDto> {
        const { data } = await http.put<MotoristaResponseDto>('/AuthMotorista/me', dto);
        return data;
    }

    static async delete(): Promise<void> {
        await http.delete('/AuthMotorista/me');
    }

    static async enviarCodigo(dto: EnviarCodigoEmailDto): Promise<void> {
        await http.post('/AuthMotorista/enviar-codigo', dto);
    }

    static async verificarCodigo(dto: VerificarCodigoEmailDto): Promise<VerificarCodigoEmailResponseDto> {
        const { data } = await http.post<VerificarCodigoEmailResponseDto>('/AuthMotorista/verificar-codigo', dto);
        return data;
    }

    static async alterarSenha(dto: AlterarSenhaComCodigoDto): Promise<void> {
        await http.post('/AuthMotorista/alterar-senha', dto);
    }

    static async alterarEmail(dto: AlterarEmailComCodigoDto): Promise<void> {
        await http.post('/AuthMotorista/alterar-email', dto);
    }
}