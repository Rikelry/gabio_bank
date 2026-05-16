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