import type { WarriorColor } from "src/constants/entities";

export const WARRIOR_IDLE = (color: WarriorColor) => `${color}_warrior_idle`;
export const WARRIOR_WALK = (color: WarriorColor) => `${color}_warrior_walk`;
export const WARRIOR_ATTACK = (color: WarriorColor) =>
  `${color}_warrior_attack`;
