# Gábio Bank - Exemplo de Protocolo sobre WebSockets

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

- **client**: Interface web construída com TypeScript e Parcel.
- **server**: Servidor WebSocket construído com Node.js e TypeScript.

### Protocolo MTP (Fictício)

O MTP define um formato simples para troca de mensagens:

- **Request**: `MENSAGEM:<texto>`
- **Response**: `CODIGO:<OK|ERROR>\nMENSAGEM:<texto>`

## Como Executar

### Pré-requisitos

- Node.js instalado
- npm ou yarn

### Servidor (`server`)

1. Entre na pasta: `cd server`
2. Instale as dependências: `npm install`
3. Inicie o servidor: `npm start` (ou `npm run build` seguido de `npm start`)

### Cliente (`client`)

1. Entre na pasta: `cd client`
2. Instale as dependências: `npm install`
3. Inicie o cliente: `npm start`
4. Acesse o endereço indicado pelo Parcel (geralmente `http://localhost:1234`)

## Fins Pedagógicos

Este código serve como base para estudos sobre:
- Encapsulamento de dados.
- Definição de protocolos de aplicação.
- Comunicação assíncrona com WebSockets.
- Estruturação de projetos Fullstack com TypeScript.

## Contributors

<a href="https://github.com/Rikelry/gabio_bank/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Rikelry/gabio_bank" />
</a>

Made with [contrib.rocks](https://contrib.rocks).
