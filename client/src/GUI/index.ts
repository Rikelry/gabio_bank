import { MaximizarUseCase } from "../RegrasNegocio/maximizarUseCase";

class MainGUI {
    private input: HTMLInputElement;
    private mainbutton: HTMLButtonElement;
    private result: HTMLPreElement;

    constructor() {
        this.input = document.getElementById('mensagem')! as HTMLInputElement;
        this.mainbutton = document.getElementById('enviar')! as HTMLButtonElement;
        this.result = document.getElementById('log')! as HTMLPreElement;

        this.mainbutton.onclick = () => this.enviar();
    }

    private enviar() {
        let textoDoUsuario: string = this.input.value;

        //chamar as regras de negócio para enviar o texto do usuário e fazer a função esperada
        let muc: MaximizarUseCase = new MaximizarUseCase();
        muc.maximizar(textoDoUsuario).then((res) => {
            this.result.innerHTML = res + "";
        });
        this.input.value = '';
    }

}

const main = new MainGUI();