import {ClientMessage, Operation, ServerMessage} from "../server/types";


type WebSocketHandlers = {
    onInit: (operations: Operation[]) => void;
    onUpdate: (operation: Operation) => void;
    onSync: (operations: Operation[]) => void;
};

export class CanvasSocket {
    private socket: WebSocket;
    private handlers: WebSocketHandlers;

    constructor(
        url: string,
        roomId: string,
        handlers: WebSocketHandlers
    ) {
        this.handlers = handlers;
        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            const join: ClientMessage = {
                type: "room:join",
                roomId,
            };
            this.send(join);
        };

        this.socket.onmessage = (event) => {
            let message: ServerMessage;

            try {
                message = JSON.parse(event.data);
            } catch {
                return;
            }

            this.handleMessage(message);
        };

        this.socket.onerror = (err) => {
            console.error("WebSocket error:", err);
        };
    }


    send(message: ClientMessage): void {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        }
    }

    sendOperation(operation: Omit<Operation, "id">): void {
        this.send({
            type: "draw",
            operation,
        });
    }

    undo(): void {
        this.send({type: "undo"});
    }

    redo(): void {
        this.send({type: "redo"});
    }
    

    private handleMessage(message: ServerMessage): void {
        switch (message.type) {
            case "state:init":
                this.handlers.onInit(message.operations);
                break;

            case "state:update":
                this.handlers.onUpdate(message.operation);
                break;

            case "state:sync":
                this.handlers.onSync(message.operations);
                break;
        }
    }
}
