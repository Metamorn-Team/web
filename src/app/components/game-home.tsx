import { useEffect, useRef } from "react";
import { initializeGame } from "src/game/main";

export default function GameHome() {
  const gameContainer = useRef(null);

  useEffect(() => {
    const game = initializeGame(window.innerWidth, window.innerHeight);

    const handleResize = () => {
      game.scale.resize(window.innerWidth, window.innerHeight);
      game.scene.scenes.forEach((scene) => {
        scene.cameras.main.setSize(window.innerWidth, window.innerHeight);
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      game.destroy(true);
    };
  });

  return <div ref={gameContainer} id="game-container" className=" z-50" />;
}
