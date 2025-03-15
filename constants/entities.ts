export const warriorColors = ["blue", "purple"] as const;
export type WarriorColor = (typeof warriorColors)[number];

export const WARRIOR = (color: WarriorColor) => `${color}_warrior`;
