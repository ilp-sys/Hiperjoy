interface Position {
  x: number;
  y: number;
}

interface PositionsMap {
  [key: string]: Position;
}

interface ScalesMap {
  [key: string]: number;
}

export type { Position, PositionsMap, ScalesMap };
