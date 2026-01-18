import WebSocket, { WebSocketServer } from "ws";
import { RoomManager } from "./rooms.js";
import { ClientMessage, Operation } from "./types.js";
import { isValidOperation } from "./validation.js";

const wss = new WebSocketServer({ port: 8080 });
const rooms = new RoomManager();

wss.on("connection", (socket: WebSocket) => {
  let currentRoomId: string | null = null;

  socket.on("message", (raw) => {
    let message: ClientMessage;

    try {
      message = JSON.parse(raw.toString());
    } catch {
      return;
    }

    switch (message.type) {
      case "room:join": {
        currentRoomId = message.roomId;
        rooms.joinRoom(message.roomId, socket);
        break;
      }

      case "draw": {
        if (!currentRoomId) return;
        
        if (!isValidOperation(message.operation)) {
          console.error("Invalid operation received:", message.operation);
          return;
        }

        rooms.addOperation(currentRoomId, message.operation);
        break;
      }

      case "undo": {
        if (!currentRoomId) return;
        rooms.undo(currentRoomId);
        break;
      }

      case "redo": {
        if (!currentRoomId) return;
        rooms.redo(currentRoomId);
        break;
      }
    }
  });

  socket.on("close", () => {
    if (currentRoomId) {
      rooms.leaveRoom(currentRoomId, socket);
    }
  });
});

console.log("WebSocket server running on ws://localhost:8080");
