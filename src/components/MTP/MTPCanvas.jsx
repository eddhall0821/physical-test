import { useEffect } from "react";
import {
  distanceBetweenTwoPoint,
  drawMTPTarget,
  drawPointer,
  getRandomArbitrary,
  initCanvas,
  resetCanvas,
} from "../../utils";
const RADIUS = 10;

const MTPCanvas = () => {
  useEffect(() => {
    let x = 0;
    let y = 0;
    let delay = 0;
    let summary = {
      fail: 0,
      success: 0,
    };

    let target_radius, target_x, target_y, v_x, v_y;

    const targetInit = () => {
      target_radius = getRandomArbitrary(18, 45);
      target_x = getRandomArbitrary(
        target_radius,
        canvas.width - target_radius
      );
      target_y = getRandomArbitrary(
        target_radius,
        canvas.height - target_radius
      );
      v_x = getRandomArbitrary(-1000, 1000);
      v_y = getRandomArbitrary(-1000, 1000);
    };

    let start;
    let timeDiff = 0;
    let p1 = 0;
    let p2 = 0;

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

    //test---
    let mouse_cnt = 0;
    let cnt = 0;
    let tt = performance.now();
    //test---

    function updatePosition(e) {
      mouse_cnt++;
      const p = performance.now();
      p1 = p;
      // console.log(p1 - p2);
      p2 = p;

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

      if (e.buttons === 1) {
        if (p - delay > 300) {
          const distance = distanceBetweenTwoPoint(x, y, target_x, target_y);
          // console.log(distance - target_radius);
          if (target_radius - distance > 0) {
            summary.success++;
          } else {
            summary.fail++;
          }
          targetInit();
          delay = p;
        }
        timeDiff = 0;
      }
    }
    const drawText = () => {
      ctx.font = "30px serif";
      ctx.fillStyle = "#fff";
      ctx.fillText(
        `cnt: ${summary.fail + summary.success}`,
        window.innerWidth - 200,
        50
      );
      ctx.fillText(`success: ${summary.success}`, window.innerWidth - 200, 100);
      ctx.fillText(`fail: ${summary.fail}`, window.innerWidth - 200, 150);
    };

    //step function execute every frame
    function step(timestamp) {
      if (tt + 1000 < performance.now()) {
        console.log("frame rate: " + cnt);
        console.log("mouse event per second: " + mouse_cnt);
        tt = performance.now();
        cnt = 0;
        mouse_cnt = 0;
      }
      cnt++;

      if (start === undefined) {
        start = timestamp;
      }
      const elapsed = timestamp - start;
      // timeDiff += elapsed;

      const dist_x = v_x * (elapsed / 1000);
      const dist_y = v_y * (elapsed / 1000);

      target_x += dist_x;
      target_y += dist_y;

      if (target_x > canvas.width - target_radius) {
        target_x = canvas.width - target_radius;
        v_x = -v_x;
      }

      if (target_x < target_radius) {
        target_x = target_radius;
        v_x = -v_x;
      }

      if (target_y > canvas.height - target_radius) {
        target_y = canvas.height - target_radius;
        v_y = -v_y;
      }

      if (target_y < target_radius) {
        target_y = target_radius;
        v_y = -v_y;
      }

      start = timestamp;
      resetCanvas(canvas);
      drawText();
      drawMTPTarget(ctx, target_x, target_y, 0, target_radius);
      drawPointer(ctx, x, y);
      requestAnimationFrame(step);
    }

    targetInit();
    initCanvas(canvas);
    requestAnimationFrame(step);
  }, []);

  return <canvas id="canvas" />;
};

export default MTPCanvas;
