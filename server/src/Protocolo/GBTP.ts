export type OperationType = 'BALANCE' | 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';
export type ResponseStatus = 'OK' | 'ERROR';

// Valida números de forma rigorosa
function parseStrictNumber(raw: string, fieldName: string): number {
    const text = raw.trim();

    // Aceita apenas números válidos
    if (!/^-?\d+(?:\.\d+)?$/.test(text)) {
        throw new Error(`${fieldName} deve ser um número válido`);
    }

    const value = Number(text);

    if (!Number.isFinite(value)) {
        throw new Error(`${fieldName} deve ser um número válido`);
    }

    return value;
}

export class GBTPRequest {
    constructor(
        public operation: OperationType,
        public accountId: string,
        public toAccountId: string,
        public value: number
    ) { }

    // Converte objeto para mensagem GBTP
    toString(): string {
        const valueText =
            this.operation === 'BALANCE'
                ? '0'
                : this.value.toFixed(2);

        return [
            `OPERATION:${this.operation}`,
            `ACCOUNT_ID:${this.accountId}`,
            `TO_ACCOUNT_ID:${this.toAccountId}`,
            `VALUE:${valueText}`
        ].join('\n');
    }

    // Converte mensagem GBTP em objeto
    static fromString(msg: string): GBTPRequest {
        if (!msg || msg.trim() === '') {
            throw new Error('Mensagem vazia');
        }

        const lines = msg.trim().split(/\r?\n/);
        const fields: Record<string, string> = {};

        // Extrai os campos da mensagem
        for (const line of lines) {
            const idx = line.indexOf(':');

            if (idx === -1) {
                throw new Error(`Campo inválido: "${line}"`);
            }

            const key = line.substring(0, idx).trim();
            const val = line.substring(idx + 1).trim();

            if (!key) {
                throw new Error(`Campo inválido: "${line}"`);
            }

            fields[key] = val;
        }

        // Campos obrigatórios
        const required = [
            'OPERATION',
            'ACCOUNT_ID',
            'TO_ACCOUNT_ID',
            'VALUE'
        ];

        for (const r of required) {
            if (!(r in fields)) {
                throw new Error(`Campo obrigatório ausente: ${r}`);
            }
        }

        // Operações válidas
        const validOps: OperationType[] = [
            'BALANCE',
            'DEPOSIT',
            'WITHDRAW',
            'TRANSFER'
        ];

        const op = fields['OPERATION'] as OperationType;

        if (!validOps.includes(op)) {
            throw new Error(`Operação inválida: ${fields['OPERATION']}`);
        }

        const accountId = fields['ACCOUNT_ID'].trim();
        const toAccountId = fields['TO_ACCOUNT_ID'].trim();
        const value = parseStrictNumber(fields['VALUE'], 'VALUE');

        if (accountId === '') {
            throw new Error('ACCOUNT_ID não pode ser vazio');
        }

        // Regras específicas por operação
        if (op === 'TRANSFER') {
            if (toAccountId === '') {
                throw new Error(
                    'TO_ACCOUNT_ID é obrigatório para transferência'
                );
            }

            if (value <= 0) {
                throw new Error(
                    'VALUE deve ser maior que zero para transferência'
                );
            }
        } else {
            // Nas outras operações o destino deve ficar vazio
            if (toAccountId !== '') {
                throw new Error(
                    'TO_ACCOUNT_ID deve estar vazio para esta operação'
                );
            }

            if (op === 'BALANCE' && value !== 0) {
                throw new Error(
                    'VALUE deve ser 0 para consulta de saldo'
                );
            }

            if (
                (op === 'DEPOSIT' || op === 'WITHDRAW') &&
                value <= 0
            ) {
                throw new Error(
                    `VALUE deve ser maior que zero para ${op}`
                );
            }
        }

        if (value < 0) {
            throw new Error('VALUE não pode ser negativo');
        }

        return new GBTPRequest(
            op,
            accountId,
            toAccountId,
            value
        );
    }
}

export class GBTPResponse {
    constructor(
        public status: ResponseStatus,
        public message: string,
        public balance: number
    ) { }

    // Converte resposta em texto GBTP
    toString(): string {
        return [
            `STATUS:${this.status}`,
            `MESSAGE:${this.message}`,
            `BALANCE:${this.balance.toFixed(2)}`
        ].join('\n');
    }

    // Converte texto GBTP em resposta
    static fromString(msg: string): GBTPResponse {
        if (!msg || msg.trim() === '') {
            throw new Error('Mensagem de resposta vazia');
        }

        const lines = msg.trim().split(/\r?\n/);
        const fields: Record<string, string> = {};

        for (const line of lines) {
            const idx = line.indexOf(':');

            if (idx === -1) {
                throw new Error(`Campo inválido: "${line}"`);
            }

            const key = line.substring(0, idx).trim();
            const val = line.substring(idx + 1).trim();

            if (!key) {
                throw new Error(`Campo inválido: "${line}"`);
            }

            fields[key] = val;
        }

        // Campos obrigatórios da resposta
        const required = ['STATUS', 'MESSAGE', 'BALANCE'];

        for (const r of required) {
            if (!(r in fields)) {
                throw new Error(
                    `Campo ausente na resposta: ${r}`
                );
            }
        }

        const status = fields['STATUS'] as ResponseStatus;

        if (status !== 'OK' && status !== 'ERROR') {
            throw new Error(
                `STATUS inválido: ${fields['STATUS']}`
            );
        }

        const balance = parseStrictNumber(
            fields['BALANCE'],
            'BALANCE'
        );

        return new GBTPResponse(
            status,
            fields['MESSAGE'],
            balance
        );
    }
}