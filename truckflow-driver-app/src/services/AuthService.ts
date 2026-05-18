import MotoristaLoginDto from "../Dtos/Motorista/motoristaLoginDto";
import MotoristaLoginResponseDto from "../Dtos/Motorista/motoristaLoginResponseDto";
import MotoristaRegisterDto from "../Dtos/Motorista/motoristaRegisterDto";
import MotoristaResponseDto from "../Dtos/Motorista/motoristaResponseDto";
import motoristaUpdateDto from "../Dtos/Motorista/motoristaUpdateDto";
import VeiculoResponseDto from "../Dtos/Veiculo/veiculoResponseDto";
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
}