export const getPositionCenterByCell = (
  cellIndexX: number,
  cellIndexY: number,
  cellWith = 64,
  cellHeight = 64
) => {
  return {
    x: cellIndexX * cellWith + cellWith / 2,
    y: cellIndexY * cellHeight + cellWith / 2,
  };
};
