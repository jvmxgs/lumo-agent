"use client";

import { useEffect } from "react";
import { initializePhaser } from "./phaserConfig";

const RobotCanvas = () => {
  useEffect(() => {
    const game = initializePhaser();

    return () => {
      if (game) {
        game.destroy(true);
      }
    };
  }, []);

  return <div id="robotCanvas" className="w-full max-w-2xl h-96 bg-gray-800 rounded-lg shadow-lg mb-8"></div>;
};

export default RobotCanvas;