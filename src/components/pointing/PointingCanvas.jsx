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

    let movementX;
    let movementY;

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
        //오른쪽 테두리 밖
        x = window.innerWidth - RADIUS;
        movementY = e.movementY;
      } else if (y > window.innerHeight - RADIUS) {
        //아래쪽 테두리 밖
        y = window.innerHeight - RADIUS;
        movementX = e.movementX;
      } else if (x < RADIUS) {
        //왼쪽 테두리 밖
        x = RADIUS;
        movementY = e.movementY;
      } else if (y < RADIUS) {
        //위쪽 테두리 밖
        y = RADIUS;
        movementX = e.movementX;
      } else {
        movementX = e.movementX;
        movementY = e.movementY;
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
            movementX: parseInt(itemArr[0]),
            movementY: parseInt(itemArr[1]),
            screenX: parseInt(itemArr[2]),
            scrrenY: parseInt(itemArr[3]),
            timeDiff: parseInt(itemArr[4]),
            buttons: parseInt(itemArr[5]),
          };
        });
        startReplay(log);
      };
    }

    function startReplay(arr) {
      replayCallback(arr, cnt);
    }

    function replayCallback(arr, replayCnt) {
      replayCnt++;

      x += arr[replayCnt].movementX;
      y += arr[replayCnt].movementY;

      if (arr[replayCnt].buttons) {
        cnt++;
      }

      if (!animation) {
        animation = requestAnimationFrame(function () {
          animation = null;
          drawTarget();
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

    //logging
    let myReq;
    let ms = 0;
    function step() {
      var progress = ms++;
      console.log(movementX, movementY);
      if (progress < 10000) {
        myReq = requestAnimationFrame(step);
      }
    }
    myReq = requestAnimationFrame(step);
    return () => cancelAnimationFrame(myReq);
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
