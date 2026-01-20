import { Operation, StrokeData, EraseData } from "./types";

export function isValidOperation(
  op: any
): op is Omit<Operation, "id"> {
  if (!op || typeof op !== "object") return false;

  if (!["stroke", "erase"].includes(op.type)) return false;

  if (typeof op.userId !== "string") return false;
  if (!Number.isFinite(op.timestamp)) return false;

  if (!op.data || typeof op.data !== "object") return false;

  switch (op.type) {
    case "stroke": {
      const data = op.data as StrokeData;

      return (
        Array.isArray(data.points) &&
        data.points.length >= 2 &&
        data.points.every(
          p =>
            Number.isFinite(p.x) &&
            Number.isFinite(p.y)
        ) &&
        typeof data.color === "string" &&
        Number.isFinite(data.width) &&
        data.width > 0
      );
    }

    case "erase": {
      const data = op.data as EraseData;

      return (
        Array.isArray(data.points) &&
        data.points.length >= 1 &&
        data.points.every(
          p =>
            Number.isFinite(p.x) &&
            Number.isFinite(p.y)
        ) &&
        Number.isFinite(data.width) &&
        data.width > 0
      );
    }

    default:
      return false;
  }
}
