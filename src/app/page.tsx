"use client";
import { useEffect, useRef } from "react";

const MainPage = () => {
  const gameContainer = useRef(null);

  useEffect(() => {
    import("@/game/main").then((mod) => {
      const initializeGame = mod.initializeGame;
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

  return (
    <div>
      <div ref={gameContainer} id="game-container" className="z-0"></div>
      <button className="absolute left-1/2 bg-white round">음소거</button>
    </div>
  );
};

export default MainPage;
