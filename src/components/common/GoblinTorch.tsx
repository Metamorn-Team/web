export default function GoblinTorch({ className }: { className?: string }) {
  return (
    <div
      className={`w-60 h-60 bg-[url('/game/enemy/goblin-torch.png')] bg-[length:700%_500%] animate-fire ${className}`}
    />
  );
}
