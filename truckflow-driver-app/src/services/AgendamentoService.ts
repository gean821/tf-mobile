import IAgendamento from '../Entities/IAgendamento';
import http from './http/axios';

export default class AgendamentoService {
  static async GetAll(): Promise<IAgendamento[]> {
    const { data } = await http.get('/Agendamento');
    return data;
  }

  static async GetById(id: string): Promise<IAgendamento> {
    const { data } = await http.get(`/Agendamento/${id}`);
    return data;
  }

  static async AddAgendamento(Agendamento: IAgendamento): Promise<IAgendamento> {
    const { data } = await http.post('/Agendamento', Agendamento);
    return data;
  }

  static async UpdateAgendamento(id: string, AgendamentoAtualizado: IAgendamento): Promise<IAgendamento> {
    const { data } = await http.put(`/Agendamento/${id}`, AgendamentoAtualizado);
    return data;
  }

  static async DeleteAgendamento(id: string): Promise<void> {
    await http.delete(`/Agendamento/${id}`);
  }
}
