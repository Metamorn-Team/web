import { TorchGoblinColor } from "@/constants/entities";

export const TORCH_GOBLIN_IDLE = (color: TorchGoblinColor) =>
  `${color}_torch_goblin_idle`;
export const TORCH_GOBLIN_WALK = (color: TorchGoblinColor) =>
  `${color}_torch_goblin_walk`;
export const TORCH_GOBLIN_ATTACK = (color: TorchGoblinColor) =>
  `${color}_torch_goblin_attack`;
