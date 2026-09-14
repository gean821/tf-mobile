
import ILocalDescarga from "../Entities/ILocalDescarga";
import http from "./http/axios";

export default class LocalDescargaService {
    static async GetAll(): Promise<ILocalDescarga[]> {
        const locais = await http.get('/LocalDescarga');
        return locais.data;
    }

    static async GetById(id: string): Promise<ILocalDescarga> {
        const local = await http.get(`/LocalDescarga/${id}`);
        return local.data;
    }

    static async AddLocalDescarga(localDescarga: ILocalDescarga): Promise<ILocalDescarga> {
        const local = await http.post('/LocalDescarga', localDescarga);
        return local.data;
    }

    static async UpdateLocalDescarga(id: string, localAtualizado: ILocalDescarga): Promise<ILocalDescarga> {
        const local = await http.put(`/LocalDescarga/${id}`, localAtualizado);
        return local.data;
    }

    static async DeleteLocalDescarga(id: string): Promise<void> {
        await http.delete(`/LocalDescarga/${id}`);
    }
}


