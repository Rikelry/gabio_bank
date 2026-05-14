# Atividade de Redes de Computadores

### Gábio Bank: Implementação do Protocolo GBTP

### Disciplina de Redes de Computadores

### 20 de maio de 2025

## Objetivo

O objetivo desta atividade é consolidar os conceitos de protocolos da camada de aplicação,
por meio do desenvolvimento de uma aplicação cliente–servidor simplificada. Os alunos
irão:

- Implementar um cliente web (frontend) em TypeScript/React que consuma um protocolo personalizado;
- Implementar um servidor em Node.js/TypeScript que entenda e processe as mensagens do protocolo;
- Definir e documentar o protocolo de aplicação GBTP (Gábio Bank Transaction Protocol);
- Testar as operações de consulta de saldo, depósito, saque e transferência entre contas.

## Descrição Geral do Projeto
```text
/client         % Cliente web (HTML + TypeScript)
/server         % Servidor Node.js + TypeScript
README.md       % Documentação do projeto e do protocolo
```
## 1 Protocolo GBTP

O GBTP (Gábio Bank Transaction Protocol) é um protocolo textual inspirado no CNET,
que define mensagens estruturadas em pares CHAVE:VALOR, separadas por nova linha (\n).
Todas as requisições e respostas possuem o mesmo conjunto de campos, garantindo consistência no parsing.

### 1.1 Formato Comum de Requisição

| Campo          | Descrição                                                                           |
|----------------|-------------------------------------------------------------------------------------|
| OPERATION      | Tipo de operação: BALANCE, DEPOSIT, WITHDRAW, TRANSFER.                             |
| ACCOUNT_ID     | Identificador da conta principal.                                                   |
| TO_ACCOUNT_ID  | Identificador da conta de destino (apenas TRANSFER; caso contrário, vazio).         |
| VALUE          | Valor numérico da transação (usado em todas as operações; pode ser 0 para BALANCE). |

### 1.2 Formato Comum de Resposta

| Campo    | Descrição                                                             |
|----------|-----------------------------------------------------------------------|
| STATUS   | Resultado da operação: OK ou ERROR.                                   |
| MESSAGE  | Mensagem descritiva sobre o processamento.                            |
| BALANCE  | Saldo atual da conta principal (mesmo em caso de erro, se aplicável). |

## 2 Operações Exemplificadas

### 2.1 Consulta de Saldo (BALANCE)

Requisição:
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
BALANCE:250.00
```
### 2.2 Depósito (DEPOSIT)

Requisição:
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
BALANCE:350.00
```
### 2.3 Saque (WITHDRAW)

Requisição:
```
OPERATION:WITHDRAW
ACCOUNT_ID:1234
TO_ACCOUNT_ID:
VALUE:50.00
```
Resposta (sucesso):
```
STATUS:OK
MESSAGE:Saque efetuado
BALANCE:300.00
```
Resposta (erro - saldo insuficiente):
```
STATUS:ERROR
MESSAGE:Saldo insuficiente
BALANCE:30.00
```
### 2.4 Transferência (TRANSFER)

Requisição:
```
OPERATION:TRANSFER
ACCOUNT_ID:1234
TO_ACCOUNT_ID:5678
VALUE:75.00
```
Resposta (sucesso):
```
STATUS:OK
MESSAGE:Transferência concluída
BALANCE:225.00
```
Resposta (erro - conta destino não existe):
```
STATUS:ERROR
MESSAGE:Conta de destino inexistente
BALANCE:225.00
```
## 3 Requisitos de Implementação

- Cliente Web: React + TypeScript; interface simples para enviar mensagens GBTP via WebSocket e exibir respostas.
- Servidor: Node.js + TypeScript; mantém um mapa em memória de contas (ID → saldo), processa requisições GBTP e devolve respostas conforme especificado.
- Inicialização: Criar algumas contas fictícias (ex.: IDs 1001, 1002, 1003 com saldos iniciais).
- Validações: campos presentes, valores não-negativos, existência de contas, limites de saque/transferência, conta de origem diferente da de destino.

## Entrega

1. Código-fonte completo do gabio-client e gabio-server.
2. Documentação (README.md) com descrição do protocolo GBTP.
3. Instruções de execução (scripts npm install, npm start, etc).
