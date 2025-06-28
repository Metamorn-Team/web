interface CellPositionOptions {
  cellIndexX: number;
  cellIndexY: number;
  cellWidth?: number;
  cellHeight?: number;
  offsetX?: number;
  offsetY?: number;
}

export const getPositionCenterByCell = (options: CellPositionOptions) => {
  const {
    cellIndexX,
    cellIndexY,
    cellWidth = 64,
    cellHeight = 64,
    offsetX = 0,
    offsetY = 0,
  } = options;

  const centerX = cellIndexX * cellWidth + cellWidth / 2;
  const centerY = cellIndexY * cellHeight + cellHeight / 2;

  return {
    x: centerX + offsetX,
    y: centerY + offsetY,
  };
};
