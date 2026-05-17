import MotoristaLoginDto from "../Dtos/Motorista/motoristaLoginDto";
import MotoristaLoginResponseDto from "../Dtos/Motorista/motoristaLoginResponseDto";
import MotoristaRegisterDto from "../Dtos/Motorista/motoristaRegisterDto";
import MotoristaResponseDto from "../Dtos/Motorista/motoristaResponseDto";
import motoristaUpdateDto from "../Dtos/Motorista/motoristaUpdateDto";
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

    static async update(id: string, dto: motoristaUpdateDto): Promise<MotoristaResponseDto> {
        const adminAtualizado = await http.put(`/AuthMotorista/update/me/${id}`, dto);
        return adminAtualizado.data;
    }

    static async delete(id: string): Promise<void> {
        await http.delete(`/AuthMotorista/delete/me/${id}`);
    }
}