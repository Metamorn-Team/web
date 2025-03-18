import { useEffect, useRef } from "react";

export default function GameHome() {
  const gameContainer = useRef(null);

  useEffect(() => {
    import("../../game/main").then((mod) => {
      const initializeGame = mod.default;
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
  }, []);

  return <div ref={gameContainer} id="game-container" className=" z-50" />;
}
