import { useEffect } from "react";
import { drawPointer } from "../../utils";
import { useRecoilValue } from "recoil";
import { pointerWeightState } from "../../recoil/atom";

const DemoPointing = () => {
  const weight = useRecoilValue(pointerWeightState);

  useEffect(() => {
    // helper function

    const RADIUS = 20;

    // setup of the canvas

    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    let x = 50;
    let y = 50;

    function canvasDraw() {
      // Find center x and y for any partial balls
      function find2ndCenter(pos, max) {
        if (pos < RADIUS) {
          pos += max;
        } else if (pos + RADIUS > max) {
          pos -= max;
        } else {
          pos = 0;
        }
        return pos;
      }

      function drawBall(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, RADIUS, 0, 2 * Math.PI, true);
        ctx.fill();
      }

      const x2 = find2ndCenter(x, canvas.width);
      const y2 = find2ndCenter(y, canvas.height);

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#f00";

      drawPointer(ctx, x + 100, y + 100);

      /* Draw the main ball (which may or may not be a full ball) and any
       * partial balls that result from moving close to one of the edges */
      // drawBall(x, y); // main ball
      // if (x2) {
      //   drawBall(x2, y); // partial ball
      // }
      // if (y2) {
      //   drawBall(x, y2); // partial ball
      // }
      // if (x2 && y2) {
      //   drawBall(x2, y2); // partial ball
      // }
    } // end of function canvasDraw

    canvasDraw();

    canvas.addEventListener("click", async () => {
      if (!document.pointerLockElement) {
        try {
          await canvas.requestPointerLock({
            unadjustedMovement: true,
          });
        } catch (error) {
          if (error.name === "NotSupportedError") {
            // Some platforms may not support unadjusted movement.
            await canvas.requestPointerLock();
          } else {
            throw error;
          }
        }
      }
    });

    // pointer lock event listeners

    document.addEventListener("pointerlockchange", lockChangeAlert, false);

    function lockChangeAlert() {
      if (document.pointerLockElement === canvas) {
        console.log("The pointer lock status is now locked");
        document.addEventListener("mousemove", updatePosition, false);
      } else {
        console.log("The pointer lock status is now unlocked");
        document.removeEventListener("mousemove", updatePosition, false);
        document.addEventListener("mousemove", updatePosition, false);
      }
    }

    const tracker = document.getElementById("tracker");

    let animation;
    function updatePosition(e) {
      function updateCoord(pos, delta, weight) {
        pos += delta;
        return pos;
      }

      // x += e.movementX * weight * MOUSE_GAIN;
      // y += e.movementY * weight * MOUSE_GAIN;

      x = updateCoord(x, e.movementX, weight);
      y = updateCoord(y, e.movementY, weight);

      if (!animation) {
        animation = requestAnimationFrame(function () {
          animation = null;
          canvasDraw();
        });
      }
    }
  }, []);
  return (
    <>
      <canvas width={window.innerWidth} height={window.innerHeight} />
    </>
  );
};

export default DemoPointing;
