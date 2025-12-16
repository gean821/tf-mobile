import axios from "axios";
import INotaFiscalParsedDto from "../Dtos/INotaFiscalParsedDto";
import http from "./http/axios";

export default class NotaFiscalService {
    static async parseNotaFiscalXml(fileUri: string): Promise<INotaFiscalParsedDto> {
        const formData = new FormData();

        formData.append(
            "xmlFile",
            {
                uri: fileUri,
                name: "nota.xml",
                type: "application/xml",
            } as any
        );

        console.log({
            uri: fileUri,
            isFile: fileUri.startsWith("file://"),
        });

        for (const pair of (formData as any)._parts) {
            console.log(pair);
        }

        const { data } = await axios.post("http://192.168.1.249:56611/v1/NotaFiscal/parse",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                timeout: 30000,
            }
        );


        return data;
    }

    static async saveParsedData(parsedNota: INotaFiscalParsedDto): Promise<INotaFiscalParsedDto> {
        const { data } = await http.post('/NotaFiscal/save', parsedNota);
        return data;
    }

    static async buscarNotaPorChave(chaveAcesso: string): Promise<INotaFiscalParsedDto> {
        const { data } = await http.get(`/NotaFiscal/buscar-por-chave/${chaveAcesso}`);
        return data;
    }
}
