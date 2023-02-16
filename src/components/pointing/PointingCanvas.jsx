import { useEffect, useRef } from "react";
import { Layer, Stage } from "react-konva";

let cnt = 0;
let summary = {
  success: 0,
  fail: 0,
};

const RADIUS = 10;
const TARGET_RADIUS = 20;
const TARGET_ZONE_RADIUS = window.innerHeight / 3;
const NUM_POINTS = 10;

const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;

function degToRad(degrees) {
  const result = (Math.PI / 180) * degrees;
  return result;
}

const logArr = [["movementX", "movementY", "screenX", "screenY", "timeDiff"]];
let p1 = 0;
let p2 = 0;

const PointingCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const isReplayMode = window.confirm("replay?");
    console.log(isReplayMode);

    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    let x = centerX;
    let y = centerY;

    const canvasDraw = () => {
      ctx.fillStyle = "#88b04b";
      ctx.beginPath();
      ctx.arc(x, y, RADIUS, 0, degToRad(360), true);
      ctx.fill();
    };

    const drawTarget = () => {
      // Radius of the circle
      const radius = TARGET_ZONE_RADIUS;

      // Number of points
      const numPoints = NUM_POINTS;

      // Calculate the angle between two adjacent points
      const angleBetweenPoints = (2 * Math.PI) / numPoints;

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate the coordinates of each point
      for (let i = 0; i < numPoints; i++) {
        ctx.fillStyle = `#f${i}${i}`;

        const angle = i * angleBetweenPoints;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(x, y, TARGET_RADIUS, 0, degToRad(360), true);

        if (cnt % 2 === 0 && i === cnt / 2) {
          ctx.fill();
        } else if (cnt % 2 === 1 && i === numPoints / 2 + parseInt(cnt / 2)) {
          ctx.fill();
        }
      }
    };

    const drawText = () => {
      ctx.font = "30px serif";
      ctx.fillStyle = "#fff";
      ctx.fillText(`cnt: ${cnt}`, window.innerWidth - 200, 50);
      ctx.fillText(`success: ${summary.success}`, window.innerWidth - 200, 100);
      ctx.fillText(`fail: ${summary.fail}`, window.innerWidth - 200, 150);
    };

    canvasDraw();
    drawTarget();

    canvas.addEventListener("click", async () => {
      if (!document.pointerLockElement) {
        await canvas.requestPointerLock({
          unadjustedMovement: true,
        });
      }
    });

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

    let animation;
    const downloadCSV = () => {
      let csvContent =
        "data:text/csv;charset=utf-8," +
        logArr
          .map((e) => {
            console.log(e);
            return e.join(",");
          })
          .join("\n");

      var encodedUri = encodeURI(csvContent);
      window.open(encodedUri);
    };

    const replayActions = () => {};

    function updatePosition(e) {
      const p = performance.now();
      p1 = p;
      logArr.push([
        e.movementX,
        e.movementY,
        (x += e.movementX),
        (y += e.movementY),
        p1 - p2,
      ]);
      console.log(e);
      p2 = p;

      if (e.buttons === 1) {
        cnt++;
      }
      if (cnt > NUM_POINTS) {
        cnt = 0;
        downloadCSV();
      }

      if (x > canvas.width + RADIUS) {
        x = -RADIUS;
      }
      if (y > canvas.height + RADIUS) {
        y = -RADIUS;
      }
      if (x < -RADIUS) {
        x = canvas.width + RADIUS;
      }
      if (y < -RADIUS) {
        y = canvas.height + RADIUS;
      }

      if (!animation) {
        animation = requestAnimationFrame(function () {
          animation = null;
          drawTarget();
          canvasDraw();
          drawText();
        });
      }
    }
  }, []);

  return (
    <div>
      {/* <canvas width={window.innerWidth} height={window.innerHeight}>
        Your browser does not support HTML5 canvas
      </canvas> */}
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer ref={canvasRef}></Layer>
      </Stage>
    </div>
  );
};

export default PointingCanvas;
