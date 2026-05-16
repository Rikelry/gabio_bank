export type OperationType = 'BALANCE' | 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';

export class GBTPRequest {
    constructor(
        public operation: OperationType,
        public accountId: string,
        public toAccountId: string,
        public value: number
    ) {}

    toString(): string {
        return [
            OPERATION:${this.operation},
            ACCOUNT_ID:${this.accountId},
            TO_ACCOUNT_ID:${this.toAccountId},
            VALUE:${this.value}
        ].join('\n');
    }
}

static fromString(msg: string): GBTPRequest {
    const lines = msg.trim().split('\n');
    const fields: Record<string, string> = {};

    for (const line of lines) {
        const idx = line.indexOf(':');

        if (idx === -1) {
            throw new Error(Campo inválido: "${line}");
        }

        const key = line.substring(0, idx).trim();
        const val = line.substring(idx + 1).trim();

        fields[key] = val;
    }

    const required = [
        'OPERATION',
        'ACCOUNT_ID',
        'TO_ACCOUNT_ID',
        'VALUE'
    ];

    for (const r of required) {
        if (!(r in fields)) {
            throw new Error(Campo obrigatório ausente: ${r});
        }
    }

    const validOps: OperationType[] = [
        'BALANCE',
        'DEPOSIT',
        'WITHDRAW',
        'TRANSFER'
    ];

    const op = fields['OPERATION'] as OperationType;

    if (!validOps.includes(op)) {
        throw new Error(Operação inválida: ${fields['OPERATION']});
    }

    const value = parseFloat(fields['VALUE']);

    if (isNaN(value)) {
        throw new Error('VALUE deve ser um número');
    }

    return new GBTPRequest(
        op,
        fields['ACCOUNT_ID'],
        fields['TO_ACCOUNT_ID'],
        value
    );
}