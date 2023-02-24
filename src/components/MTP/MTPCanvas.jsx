import { useEffect } from "react";
import {
  drawMTPTarget,
  drawPointer,
  initCanvas,
  resetCanvas,
} from "../../utils";
const RADIUS = 10;

const MTPCanvas = () => {
  useEffect(() => {
    let x = 0;
    let y = 0;

    let target_x = 0;
    let target_y = 0;
    let target_radius = 10;

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    document.addEventListener("pointerlockchange", lockChangeAlert, false);

    function lockChangeAlert() {
      if (document.pointerLockElement === canvas) {
        console.log("The pointer lock status is now locked");
        document.addEventListener("mousemove", updatePosition, false);
      } else {
        console.log("The pointer lock status is now unlocked");
        document.removeEventListener("mousemove", updatePosition, false);
      }
    }

    function updatePosition(e) {
      const p = performance.now();

      x += e.movementX;
      y += e.movementY;

      if (x > canvas.width - RADIUS) {
        x = canvas.width - RADIUS;
      }
      if (y > canvas.height - RADIUS) {
        y = canvas.height - RADIUS;
      }
      if (x < RADIUS) {
        x = RADIUS;
      }
      if (y < RADIUS) {
        y = RADIUS;
      }
    }

    initCanvas(canvas);

    function step(timestamp) {
      resetCanvas(canvas);
      drawMTPTarget(ctx, 40, 40, 0, target_radius);
      drawPointer(ctx, x, y);
      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }, []);

  return <canvas id="canvas" />;
};

export default MTPCanvas;
