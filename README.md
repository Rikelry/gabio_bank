# Atividade de Redes de Computadores

### Gábio Bank: Implementação do Protocolo GBTP

### Disciplina de Redes de Computadores

### 20 de maio de 2025

---

## Instruções de Execução

### Pré-requisitos

- Node.js instalado
- npm instalado

---

## 1. Executando o Servidor (WebSocket - GBTP)

Acesse a pasta do servidor:

> cd server

Instale as dependências:

> npm install

Compile o projeto TypeScript:

> npm run build

Inicie o servidor:

> npm start

O servidor WebSocket será iniciado na porta: ``7001``

---

## 2. Executando o Cliente (Frontend Web)

Acesse a pasta do cliente:

> cd client

Instale as dependências:

> npm install

Inicie o cliente com Parcel:

> npm start

O frontend ficará disponível em:

> http://localhost:1234

---

## 3. Protocolo GBTP (Gábio Bank Transaction Protocol)

O GBTP é um protocolo textual de aplicação desenvolvido para simular operações bancárias simples entre um cliente web e um servidor WebSocket.

Ele é inspirado em protocolos baseados em texto (como SMTP), utilizando pares `CHAVE:VALOR` separados por quebra de linha (`\n`), facilitando o parsing manual e garantindo simplicidade na comunicação.

---

### 3.1 Formato Geral da Mensagem

Todas as mensagens seguem o padrão:

```
CHAVE:VALOR
CHAVE:VALOR
CHAVE:VALOR
CHAVE:VALOR
```

Não há JSON, nem estruturas binárias. O protocolo é 100% textual.

---

### 3.2 Estrutura da Requisição (Client → Server)

| Campo | Tipo | Descrição |
|------|------|----------|
| OPERATION | string | Tipo da operação bancária |
| ACCOUNT_ID | string | Conta de origem |
| TO_ACCOUNT_ID | string | Conta destino (obrigatório apenas em TRANSFER) |
| VALUE | number | Valor da operação |

---

### 3.3 Operações Suportadas

- `BALANCE` → consulta saldo da conta
- `DEPOSIT` → depósito de valor
- `WITHDRAW` → saque de valor
- `TRANSFER` → transferência entre contas

---

### 3.4 Estrutura da Resposta (Server → Client)

| Campo | Tipo | Descrição |
|------|------|----------|
| STATUS | string | Resultado da operação: `OK` ou `ERROR` |
| MESSAGE | string | Mensagem descritiva do resultado |
| BALANCE | number | Saldo atual da conta após operação |

---

### 3.5 Exemplos de Comunicação

#### Consulta de saldo

```
OPERATION:BALANCE
ACCOUNT_ID:1234
TO_ACCOUNT_ID:
VALUE:0
```

Resposta:

```
STATUS:OK
MESSAGE:Saldo consultado com sucesso
BALANCE:1500.00
```

---

#### Depósito

```
OPERATION:DEPOSIT
ACCOUNT_ID:1234
TO_ACCOUNT_ID:
VALUE:100.00
```

Resposta:

```
STATUS:OK
MESSAGE:Depósito realizado com sucesso
BALANCE:1600.00
```

---

#### Saque

```
OPERATION:WITHDRAW
ACCOUNT_ID:1234
TO_ACCOUNT_ID:
VALUE:50.00
```

Resposta:

```
STATUS:OK
MESSAGE:Saque efetuado
BALANCE:1550.00
```

---

#### Transferência

```
OPERATION:TRANSFER
ACCOUNT_ID:1234
TO_ACCOUNT_ID:5678
VALUE:75.00
```

Resposta:

```
STATUS:OK
MESSAGE:Transferência concluída
BALANCE:1475.00
```

---

### 3.6 Regras do Protocolo

- Todas as mensagens devem conter os 4 campos fixos
- Campos não utilizados devem permanecer vazios (ex: `TO_ACCOUNT_ID:` em BALANCE)
- VALUE deve ser numérico e não negativo
- OPERATION deve ser uma das operações válidas
- O formato deve ser estritamente textual (sem JSON ou binário)
- Comunicação ocorre via WebSocket