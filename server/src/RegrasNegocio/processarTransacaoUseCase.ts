// processarTransacaoUseCase.ts

import { GBTPRequest, GBTPResponse } from '../Protocolo/GBTP';

export class ProcessarTransacaoUseCase {

    // Contas fictícias armazenadas em memória
    private contas: Map<string, number> = new Map([
        ['1234', 1500.00],
        ['5678', 800.50],
        ['1357', 3200.75],
        ['2468', 0.00],
    ]);

    // Processa mensagem recebida
    public processar(msg: string): string {
        let req: GBTPRequest;

        // Tenta converter a mensagem em objeto
        try {
            req = GBTPRequest.fromString(msg);
        } catch (err: any) {
            return new GBTPResponse(
                'ERROR',
                `Requisição inválida: ${err.message}`,
                0
            ).toString();
        }

        // Executa operação solicitada
        try {
            return this.executarOperacao(req).toString();
        } catch (err: any) {

            // Mantém saldo atual mesmo em erro
            const saldo = this.contas.get(req.accountId) ?? 0;

            return new GBTPResponse(
                'ERROR',
                err.message,
                saldo
            ).toString();
        }
    }

    // Direciona para a operação correta
    private executarOperacao(req: GBTPRequest): GBTPResponse {

        this.validarContaOrigem(req.accountId);

        switch (req.operation) {
            case 'BALANCE':
                return this.consultarSaldo(req);

            case 'DEPOSIT':
                return this.depositar(req);

            case 'WITHDRAW':
                return this.sacar(req);

            case 'TRANSFER':
                return this.transferir(req);

            default: {
                const neverValue: never = req.operation;

                throw new Error(
                    `Operação não suportada: ${neverValue}`
                );
            }
        }
    }

    // Verifica se a conta de origem existe
    private validarContaOrigem(accountId: string): void {

        if (!accountId || accountId.trim() === '') {
            throw new Error('ACCOUNT_ID não pode ser vazio');
        }

        if (!this.contas.has(accountId)) {
            throw new Error(
                `Conta de origem não encontrada: ${accountId}`
            );
        }
    }

    // Consulta saldo da conta
    private consultarSaldo(req: GBTPRequest): GBTPResponse {

        const saldo = this.contas.get(req.accountId)!;

        return new GBTPResponse(
            'OK',
            'Saldo consultado com sucesso',
            saldo
        );
    }

    // Realiza depósito
    private depositar(req: GBTPRequest): GBTPResponse {

        if (req.value <= 0) {
            throw new Error(
                'Valor do depósito deve ser maior que zero'
            );
        }

        const saldoAtual = this.contas.get(req.accountId)!;
        const novoSaldo = saldoAtual + req.value;

        this.contas.set(req.accountId, novoSaldo);

        return new GBTPResponse(
            'OK',
            'Depósito realizado com sucesso',
            novoSaldo
        );
    }

    // Realiza saque
    private sacar(req: GBTPRequest): GBTPResponse {

        if (req.value <= 0) {
            throw new Error(
                'Valor do saque deve ser maior que zero'
            );
        }

        const saldoAtual = this.contas.get(req.accountId)!;

        // Verifica saldo suficiente
        if (req.value > saldoAtual) {
            return new GBTPResponse(
                'ERROR',
                'Saldo insuficiente',
                saldoAtual
            );
        }

        const novoSaldo = saldoAtual - req.value;

        this.contas.set(req.accountId, novoSaldo);

        return new GBTPResponse(
            'OK',
            'Saque efetuado',
            novoSaldo
        );
    }

    // Realiza transferência entre contas
    private transferir(req: GBTPRequest): GBTPResponse {

        if (!req.toAccountId || req.toAccountId.trim() === '') {
            throw new Error(
                'TO_ACCOUNT_ID é obrigatório para transferências'
            );
        }

        if (req.accountId === req.toAccountId) {
            throw new Error(
                'Conta de origem e destino não podem ser iguais'
            );
        }

        // Conta destino precisa existir
        if (!this.contas.has(req.toAccountId)) {

            const saldoOrigem =
                this.contas.get(req.accountId)!;

            return new GBTPResponse(
                'ERROR',
                'Conta de destino inexistente',
                saldoOrigem
            );
        }

        if (req.value <= 0) {
            throw new Error(
                'Valor da transferência deve ser maior que zero'
            );
        }

        const saldoOrigem =
            this.contas.get(req.accountId)!;

        // Verifica saldo suficiente
        if (req.value > saldoOrigem) {
            return new GBTPResponse(
                'ERROR',
                'Saldo insuficiente',
                saldoOrigem
            );
        }

        const saldoDestino =
            this.contas.get(req.toAccountId)!;

        // Atualiza saldos
        this.contas.set(
            req.accountId,
            saldoOrigem - req.value
        );

        this.contas.set(
            req.toAccountId,
            saldoDestino + req.value
        );

        return new GBTPResponse(
            'OK',
            'Transferência concluída',
            saldoOrigem - req.value
        );
    }
}