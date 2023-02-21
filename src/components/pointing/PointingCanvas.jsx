import { useEffect, useRef } from "react";
import { Layer, Stage } from "react-konva";

let cnt = 0;
let summary = {
  success: 0,
  fail: 0,
};

const FPS = 60;
let FPS_INTERVAL = 1000 / FPS;
let elapsed = 0;
let then = 0;

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

const logArr = [
  ["movementX", "movementY", "screenX", "screenY", "timeDiff", "buttons"],
];
let p1 = 0;
let p2 = 0;

const PointingCanvas = () => {
  useEffect(() => {
    const isReplayMode = window.confirm("replay?");
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    let x = centerX;
    let y = centerY;

    let xx = 956 - 809;
    let yy = 577 - 1098;

    let target_x = 0;
    let target_y = 0;
    let animation;

    const fileInput = document.getElementById("replay");
    fileInput.addEventListener("change", readFile);

    canvas.addEventListener("click", async () => {
      if (!document.pointerLockElement) {
        await canvas.requestPointerLock({
          unadjustedMovement: true,
        });
      }
    });

    if (!isReplayMode) {
      fileInput.style.display = "none";
      document.addEventListener("pointerlockchange", lockChangeAlert, false);
    }
    function lockChangeAlert() {
      if (document.pointerLockElement === canvas) {
        console.log("The pointer lock status is now locked");
        document.addEventListener("mousemove", updatePosition, false);
      } else {
        console.log("The pointer lock status is now unlocked");
        document.removeEventListener("mousemove", updatePosition, false);
      }
    }

    const canvasDraw = () => {
      ctx.fillStyle = "#88b04b";
      ctx.beginPath();
      ctx.arc(x, y, RADIUS, 0, degToRad(360), true);
      ctx.fill();
    };

    const resetCanvas = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    const drawTarget = () => {
      // Radius of the circle
      const radius = TARGET_ZONE_RADIUS;

      // Number of points
      const numPoints = NUM_POINTS;

      // Calculate the angle between two adjacent points
      const angleBetweenPoints = (2 * Math.PI) / numPoints;

      // Calculate the coordinates of each point
      for (let i = 0; i < numPoints; i++) {
        ctx.fillStyle = `#f${i}${i}`;

        const angle = i * angleBetweenPoints;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(x, y, TARGET_RADIUS, 0, degToRad(360), true);

        if (cnt % 2 === 0 && i === cnt / 2) {
          target_x = x;
          target_y = y;
          ctx.fill();
        } else if (cnt % 2 === 1 && i === numPoints / 2 + parseInt(cnt / 2)) {
          target_x = x;
          target_y = y;
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

    resetCanvas();
    canvasDraw();
    drawTarget();

    const downloadCSV = () => {
      let csvContent =
        "data:text/csv;charset=utf-8," +
        logArr
          .map((e) => {
            return e.join(",");
          })
          .join("\n");

      var encodedUri = encodeURI(csvContent);
      window.open(encodedUri);
    };

    function updatePosition(e) {
      const p = performance.now();
      p1 = p;
      logArr.push([
        e.movementX,
        e.movementY,
        (x += e.movementX),
        (y += e.movementY),
        p1 - p2,
        e.buttons,
      ]);
      p2 = p;

      if (e.buttons === 1) {
        const dist_x = target_x - x;
        const dist_y = target_y - y;

        const distance = Math.sqrt(dist_x * dist_x + dist_y * dist_y);
        console.log(distance);
        if (distance < TARGET_RADIUS) {
          summary.success++;
        } else {
          summary.fail++;
        }
        cnt++;
      }
      if (cnt >= NUM_POINTS) {
        cnt = 0;
        downloadCSV();
      }

      if (x > window.innerWidth - RADIUS) {
        x = window.innerWidth - RADIUS;
      }
      if (y > window.innerHeight - RADIUS) {
        y = window.innerHeight - RADIUS;
      }
      if (x < RADIUS) {
        x = RADIUS;
      }
      if (y < RADIUS) {
        y = RADIUS;
      }

      requestAnimationFrame((timestamp) => {
        // elapsed = timestamp - then;
        // if (elapsed >= FPS_INTERVAL) {
        // then = timestamp;
        resetCanvas();
        drawTarget();
        canvasDraw();
        drawText();
        // }
      });
    }

    //------------- replay -------------
    async function readFile() {
      const file = fileInput.files[0];
      fileInput.style.display = "none";
      const reader = new FileReader();
      const content = reader.readAsText(file);

      reader.onload = async function () {
        const result = reader.result;
        const arr = result.split("\n");
        arr.shift();
        const log = await arr.map((item) => {
          const itemArr = item.split(",");
          return {
            ballSize: parseInt(itemArr[4]),
            ballX: parseInt(itemArr[5]),
            ballY: parseInt(itemArr[6]),
            movementX: parseInt(itemArr[11]),
            movementY: parseInt(itemArr[12]),
            screenX: parseInt(itemArr[9]),
            screenY: parseInt(itemArr[10]),
            timeDiff: parseInt(5),
            buttons: parseInt(itemArr[13]),
          };
        });
        console.log(log);
        startReplay(log);
      };
    }

    function startReplay(arr) {
      let replayCnt = 0;
      replayCallback(arr, cnt);
    }

    function replayCallback(arr, replayCnt) {
      replayCnt++;

      x = arr[replayCnt].screenX;
      y = arr[replayCnt].screenY;

      xx += arr[replayCnt].movementX;
      yy += arr[replayCnt].movementY;

      console.log(xx, yy);

      if (arr[replayCnt].buttons) {
        cnt++;
      }

      if (!animation) {
        animation = requestAnimationFrame(function () {
          animation = null;
          // drawTarget();
          resetCanvas();
          ctx.fillStyle = "red";
          ctx.beginPath();
          ctx.arc(
            arr[replayCnt].ballX,
            arr[replayCnt].ballY,
            arr[replayCnt].ballSize,
            0,
            degToRad(360),
            true
          );
          ctx.fill();

          ctx.fillStyle = "blue";
          ctx.beginPath();
          ctx.arc(xx, yy, RADIUS, 0, degToRad(360), true);
          ctx.fill();
          canvasDraw();
          drawText();
        });
      }

      if (replayCnt < arr.length) {
        setTimeout(() => {
          replayCallback(arr, replayCnt);
        }, arr[replayCnt].timeDiff);
      }
    }
  }, []);

  return (
    <div>
      <input type="file" id="replay" />
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer></Layer>
      </Stage>
    </div>
  );
};

export default PointingCanvas;
