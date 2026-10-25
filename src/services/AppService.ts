import VersaoMinimaResponseDto from '../Dtos/app/VersaoMinimaResponseDto';
import http from './http/axios';

export default class AppService {

  static async getVersaoMinima(): Promise<VersaoMinimaResponseDto> {
    const { data } = await http.get<VersaoMinimaResponseDto>('/app/versao-minima', { timeout: 8000 });
    return data;
  }
}
