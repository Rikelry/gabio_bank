import { ComunicadorServer } from "./Comunicacao/comunicadorServer";
import { ProcessarMaximizacaoUseCase } from "./RegrasNegocio/processarMaximizacaoUseCase";

let comunicador: ComunicadorServer = new ComunicadorServer();
let processador: ProcessarMaximizacaoUseCase = new ProcessarMaximizacaoUseCase();
comunicador.setOnRequest(processador.processar);
comunicador.startServer(7001);
