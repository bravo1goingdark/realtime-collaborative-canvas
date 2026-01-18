export type Point = {
  x: number;
  y: number;
};

export type OperationType = "stroke" | "rect" | "erase";

export interface Operation {
  id: string;
  type: OperationType;
  userId: string;
  timestamp: number;
  data: StrokeData | RectData | EraseData;
}


export interface StrokeData {
  points: Point[];
  color: string;
  width: number;
}

export interface RectData {
  start: Point;
  end: Point;
  color: string;
  width: number;
}

export interface EraseData {
  points: Point[];
  width: number;
}


export type ServerMessage =
  | StateInitMessage
  | StateUpdateMessage
  | StateSyncMessage;

export interface StateInitMessage {
  type: "state:init";
  operations: Operation[];
}

export interface StateUpdateMessage {
  type: "state:update";
  operation: Operation;
}

export interface StateSyncMessage {
  type: "state:sync";
  operations: Operation[];
}


export type ClientMessage =
  | RoomJoinMessage
  | DrawMessage
  | UndoMessage
  | RedoMessage;

export interface RoomJoinMessage {
  type: "room:join";
  roomId: string;
}

export interface DrawMessage {
  type: "draw";
  operation: Omit<Operation, "id">;
}

export interface UndoMessage {
  type: "undo";
}

export interface RedoMessage {
  type: "redo";
}
