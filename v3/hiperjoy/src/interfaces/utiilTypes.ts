interface Position {
  x: number;
  y: number;
}

type PositionsMap = { [key: string]: Position };

export type { Position, PositionsMap };
