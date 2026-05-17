import { ComunicadorServer } from './Comunicacao/comunicadorServer';
import { ProcessarTransacaoUseCase } from './RegrasNegocio/processarTransacaoUseCase';

const comunicador = new ComunicadorServer();
const processador = new ProcessarTransacaoUseCase();

comunicador.setOnRequest((msg: string) => processador.processar(msg));
comunicador.startServer(7001);
