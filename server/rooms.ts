// @ts-ignore
import WebSocket, { Server } from "ws";

import { DrawingState } from "./drawing-state.js";
import { ServerMessage } from "./types.js";

type Room = {
  state: DrawingState;
  sockets: Set<WebSocket>;
};

export class RoomManager {
  private rooms: Map<string, Room> = new Map();

  private getOrCreateRoom(roomId: string): Room {
    let room = this.rooms.get(roomId);

    if (!room) {
      room = {
        state: new DrawingState(),
        sockets: new Set(),
      };
      this.rooms.set(roomId, room);
    }

    return room;
  }

  joinRoom(roomId: string, socket: WebSocket): void {
    const room = this.getOrCreateRoom(roomId);
    room.sockets.add(socket);

    const message: ServerMessage = {
      type: "state:init",
      operations: room.state.getActiveOperations(),
    };

    socket.send(JSON.stringify(message));
  }

  leaveRoom(roomId: string, socket: WebSocket): void {
    const room = this.rooms.get(roomId);

    if (!room) return;

    room.sockets.delete(socket);

    if (room.sockets.size === 0) {
      this.rooms.delete(roomId);
    }
  }

  addOperation(roomId: string, op: any): void {
    console.log("addOperation called for room", roomId);

    const room = this.rooms.get(roomId);
    if (!room) {
      console.log("Room not found");
      return;
    }

    const operation = room.state.addOperation(op);

    console.log("Broadcasting operation", operation.id);

    this.broadcast(room, {
      type: "state:update",
      operation,
    });
  }

  undo(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const changed = room.state.undo();
    if (!changed) return;

    this.broadcast(room, {
      type: "state:sync",
      operations: room.state.getActiveOperations(),
    });
  }

  redo(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const changed = room.state.redo();
    if (!changed) return;

    this.broadcast(room, {
      type: "state:sync",
      operations: room.state.getActiveOperations(),
    });
  }

  private broadcast(room: Room, message: ServerMessage): void {
    const payload = JSON.stringify(message);

    // @ts-ignore
    for (const socket of room.sockets) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(payload);
      }
    }
  }
}
