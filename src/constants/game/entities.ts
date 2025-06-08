// Warrior
export const warriorColors = ["blue", "purple", "yellow", "red"] as const;
export type WarriorColor = (typeof warriorColors)[number];

export const WARRIOR = (color: WarriorColor) => `${color}_warrior`;

// Pawn
export const pawnColors = [
  "blue",
  "purple",
  "yellow",
  "red",
  "forest_green",
  "pure_shadow",
  "orange",
] as const;
export type PawnColor = (typeof pawnColors)[number];

export const PAWN = (color: PawnColor) => `${color}_pawn`;

// Goblin Torch
export const torchGoblinColors = ["red", "blue", "purple"] as const;
export type TorchGoblinColor = (typeof torchGoblinColors)[number];

export const TORCH_GOBLIN = (color: TorchGoblinColor) =>
  `${color}_torch_goblin`;

// Animal
export const SHEEP = "sheep";
