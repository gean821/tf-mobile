import IAgendamentoResponseDto from '../Dtos/Agendamento/IAgendamentoResponseDto';
import IReservarAgendamentoDto from '../Dtos/Agendamento/IReservarAgendamentoDto';
import http from './http/axios';

export default class AgendamentoService {

  static async GetAvailableAppointments
    (
      fornecedorId: string,
      data: string
    ): Promise<IAgendamentoResponseDto[]> {
    const { data: vagas } = await http.get('/AgendamentoMotorista/disponiveis', {
      params: {
        fornecedorId,
        data
      }
    });

    return vagas;
  }

  static async BookApointment(dto: IReservarAgendamentoDto): Promise<IAgendamentoResponseDto> {
    const {data}  = await http.post('AgendamentoMotorista/reservar', dto);
    return data;
  }

  static async getDriverAppointments(motoristaId: string): Promise<IAgendamentoResponseDto[]> {
    const { data } = await http.get(`AgendamentoMotorista/meus-agendamentos/${motoristaId}`);
    return data;
  }
}
