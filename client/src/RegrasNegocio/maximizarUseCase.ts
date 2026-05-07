import { ComunicadorClient } from "../Comunicacao/comunicacao";
import { MTPRequest, MTPResponse } from "../Protocolo/MTP";

export class MaximizarUseCase {
    public async maximizar(texto: string): Promise<String> {
        //montar a mensagem de requisição
        let req: MTPRequest = new MTPRequest(texto);
        let msgReq = req.toString();
        let comunicador: ComunicadorClient = new ComunicadorClient();

        //enviar a mensagem de reuisição
        let msgResp: string = await comunicador.enviarMsg(msgReq);

        //decodificar a resposta e retornar a string
        let resp: MTPResponse = MTPResponse.fromString(msgResp);

        return resp.mensagem;
    }

}