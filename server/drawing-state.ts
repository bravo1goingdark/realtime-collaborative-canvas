import { Operation } from "./types.js";
import { generateId } from "./utils.js";

export class DrawingState {
  private operations: Operation[] = [];

  private cursor: number = -1;

  addOperation(op: Omit<Operation, "id">): Operation {
    const operation: Operation = {
      ...op,
      id: generateId(),
    };

    if (this.cursor < this.operations.length - 1) {
      this.operations = this.operations.slice(0, this.cursor + 1);
    }

    this.operations.push(operation);
    this.cursor++;

    return operation;
  }

  undo(): boolean {
    if (this.cursor < 0) {
      return false;
    }

    this.cursor--;
    return true;
  }

  redo(): boolean {
    if (this.cursor >= this.operations.length - 1) {
      return false;
    }

    this.cursor++;
    return true;
  }

  getActiveOperations(): Operation[] {
    return this.operations.slice(0, this.cursor + 1);
  }

  getAllOperations(): Operation[] {
    return [...this.operations];
  }
}
