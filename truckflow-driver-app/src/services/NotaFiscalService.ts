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
                type: "text/xml",
            } as any
        );

        console.log({
            uri: fileUri,
            isFile: fileUri.startsWith("file://"),
        });

        for (const pair of (formData as any)._parts) {
            console.log(pair);
        }

        const { data } = await http.post("/NotaFiscal/parse", formData, {
            timeout: 30000,
            headers: { "Content-Type": "multipart/form-data" },
            transformRequest: (body) => body,
        });

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
