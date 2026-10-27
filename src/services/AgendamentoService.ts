import IAgendamentoResponseDto from '../Dtos/Agendamento/IAgendamentoResponseDto';
import IReservarAgendamentoDto from '../Dtos/Agendamento/IReservarAgendamentoDto';
import {
  RelatorioMotoristaQueryDto,
  RelatorioMotoristaResponseDto,
} from '../Dtos/Motorista/relatorioMotoristaDto';
import http from './http/axios';

export default class AgendamentoService {

  static async GetAvailableAppointments
    (
      chaveAcesso: string,
      data: string
    ): Promise<IAgendamentoResponseDto[]> {
    const { data: vagas } = await http.get('/AgendamentoMotorista/disponiveis', {
      params: {
        chaveAcesso,
        data
      }
    });

    return vagas;
  }

  static async BookApointment(dto: IReservarAgendamentoDto): Promise<IAgendamentoResponseDto> {
    const { data } = await http.post('AgendamentoMotorista/reservar', dto);
    return data;
  }

  static async getDriverAppointments(): Promise<IAgendamentoResponseDto[]> {
    const { data } = await http.get('AgendamentoMotorista/meus-agendamentos');
    return data;
  }

  static async getRelatorio(params: RelatorioMotoristaQueryDto): Promise<RelatorioMotoristaResponseDto> {
    const { data } = await http.get('AgendamentoMotorista/relatorio', { params });
    return data;
  }
}
