
import { GBTPRequest, GBTPResponse } from '../Protocolo/GBTP';

export class ProcessarTransacaoUseCase {
    private contas: Map<string, number> = new Map([
        ['1234', 1500.00],
        ['5678', 800.50],
        ['1357', 3200.75],
        ['2468', 0.00],
    ]);

    public processar(msg: string): string {
        let req: GBTPRequest;

        try {
            req = GBTPRequest.fromString(msg);
        } catch (err: any) {
            const resp = new GBTPResponse('ERROR', `Requisição inválida: ${err.message}`, 0);
            return resp.toString();
        }

        try {
            return this.executarOperacao(req).toString();
        } catch (err: any) {
            const saldo = this.contas.get(req.accountId) ?? 0;
            return new GBTPResponse('ERROR', err.message, saldo).toString();
        }
    }

    private executarOperacao(req: GBTPRequest): GBTPResponse {
        this.validarCamposComuns(req);

        switch (req.operation) {
            case 'BALANCE': return this.consultarSaldo(req);
            case 'DEPOSIT': return this.depositar(req);
            case 'WITHDRAW': return this.sacar(req);
            case 'TRANSFER': return this.transferir(req);
        }
    }
}