import { MTPRequest, MTPResponse } from "../Protocolo/MTP";

export class ProcessarMaximizacaoUseCase {


    public processar(msg: string): string {
        //parsear a mensagem para uma msgrequest
        let req: MTPRequest = MTPRequest.fromString(msg);

        //processar os dados
        let msgProcessada: string = req.mensagem.toUpperCase();

        //montar mensagem de resposta
        let resp: MTPResponse = new MTPResponse('OK', msgProcessada);

        return resp.toString();
    }
}