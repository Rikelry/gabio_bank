

export class ComunicadorClient {

    public enviarMsg(msg: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const socket = new WebSocket('ws://localhost:7001');

            socket.onopen = () => {
                socket.send(msg);
            };

            socket.onmessage = (event) => {
                resolve(event.data);
                socket.close();
            };

            socket.onerror = (error) => {
                reject(error);
                socket.close();
            };
        });
    }
}

