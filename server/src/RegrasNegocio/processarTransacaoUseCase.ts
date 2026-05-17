
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
    private validarCamposComuns(req: GBTPRequest): void {
    if (!req.accountId || req.accountId.trim() === '') {
        throw new Error('ACCOUNT_ID não pode ser vazio');
    }
    if (!this.contas.has(req.accountId)) {
        throw new Error(`Conta de origem não encontrada: ${req.accountId}`);
    }
    if (req.value < 0) {
        throw new Error('VALUE não pode ser negativo');
    }
}
private consultarSaldo(req: GBTPRequest): GBTPResponse {
    const saldo = this.contas.get(req.accountId)!;
    return new GBTPResponse('OK', 'Saldo consultado com sucesso', saldo);
}
private depositar(req: GBTPRequest): GBTPResponse {
    if (req.value === 0) throw new Error('Valor do depósito deve ser maior que zero');

    const saldoAtual = this.contas.get(req.accountId)!;
    const novoSaldo = saldoAtual + req.value;
    this.contas.set(req.accountId, novoSaldo);

    return new GBTPResponse('OK', 'Depósito realizado com sucesso', novoSaldo);
}
private sacar(req: GBTPRequest): GBTPResponse {
    if (req.value === 0) throw new Error('Valor do saque deve ser maior que zero');

    const saldoAtual = this.contas.get(req.accountId)!;
    if (req.value > saldoAtual) {
        return new GBTPResponse('ERROR', 'Saldo insuficiente', saldoAtual);
    }

    const novoSaldo = saldoAtual - req.value;
    this.contas.set(req.accountId, novoSaldo);

    return new GBTPResponse('OK', 'Saque efetuado com sucesso', novoSaldo);
}
private transferir(req: GBTPRequest): GBTPResponse {
    if (!req.toAccountId || req.toAccountId.trim() === '') {
        throw new Error('TO_ACCOUNT_ID é obrigatório para transferências');
    }
    if (req.accountId === req.toAccountId) {
        throw new Error('Conta de origem e destino não podem ser iguais');
    }
    if (!this.contas.has(req.toAccountId)) {
        const saldo = this.contas.get(req.accountId)!;
        return new GBTPResponse('ERROR', 'Conta de destino inexistente', saldo);
    }
    if (req.value === 0) throw new Error('Valor da transferência deve ser maior que zero');

    const saldoOrigem = this.contas.get(req.accountId)!;
    if (req.value > saldoOrigem) {
        return new GBTPResponse('ERROR', 'Saldo insuficiente para transferência', saldoOrigem);
    }

    const saldoDestino = this.contas.get(req.toAccountId)!;
    this.contas.set(req.accountId, saldoOrigem - req.value);
    this.contas.set(req.toAccountId, saldoDestino + req.value);

    return new GBTPResponse('OK', 'Transferência concluída com sucesso', saldoOrigem - req.value);
}
}