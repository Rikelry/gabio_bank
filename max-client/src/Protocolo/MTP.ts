export class MTPRequest {
    constructor(public mensagem: string) { }

    toString(): string {
        return `MENSAGEM:${this.mensagem}`;
    }

    static fromString(msg: string): MTPRequest {
        let split: string[] = msg.trim().split(":");
        if (split[0] != "MENSAGEM") {
            throw new Error("Mensagem inválida");
        }
        return new MTPRequest(split[1]);
    }
}

export class MTPResponse {
    constructor(public cod: 'OK' | 'ERROR', public mensagem: string) { }

    toString(): string {
        return `CODIGO:${this.cod}\nMENSAGEM:${this.mensagem}`;
    }

    static fromString(msg: string): MTPResponse {
        let parts: string[] = msg.trim().split("\n");
        if (parts.length != 2 || !parts[0].startsWith("CODIGO:") || !parts[1].startsWith("MENSAGEM:")) {
            throw new Error("Mensagem inválida");
        }
        let split0: string[] = parts[0].split(":");
        let split1: string[] = parts[1].split(":");
        return new MTPResponse(split0[1] as 'OK' | 'ERROR', split1[1]);
    }

}