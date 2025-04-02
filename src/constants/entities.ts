// Warrior
export const warriorColors = ["blue", "purple", "yellow", "red"] as const;
export type WarriorColor = (typeof warriorColors)[number];

export const WARRIOR = (color: WarriorColor) => `${color}_warrior`;

// Goblin Torch
export const torchGoblinColors = ["red"] as const;
export type TorchGoblinColor = (typeof torchGoblinColors)[number];

export const TORCH_GOBLIN = (color: TorchGoblinColor) =>
  `${color}_torch_goblin`;
