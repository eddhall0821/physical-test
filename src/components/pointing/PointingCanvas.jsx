import { useEffect, useRef } from "react";
import { Layer, Stage } from "react-konva";
import { shuffle } from "../../utils";

let cnt = 0;
let summary = {
  success: 0,
  fail: 0,
};

//조건
const targetZoneRadiusArr = [400, 800];
// const targetRadiusArr = [15, 50, 36.6667];
const targetRadiusArr = [50];

let target_zone_radius = 0;
let target_radius = 0;

const RADIUS = 10;
const NUM_POINTS = 12;

const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;

function degToRad(degrees) {
  const result = (Math.PI / 180) * degrees;
  return result;
}

const logArr = [
  [
    "target_radius",
    "target_zone_radius",
    "targetX",
    "targetY",
    "movementX",
    "movementY",
    "screenX",
    "screenY",
    "timeDiff",
    "buttons",
    "reaction_time",
  ],
];
let p1 = 0;
let p2 = 0;

const createCombination = (arr1, arr2) => {
  let combination = [];
  for (let targetZoneRadius of arr1) {
    for (let targetRadius of arr2) {
      combination.push({
        targetZoneRadius,
        targetRadius,
      });
    }
  }
  return shuffle(combination);
};

const combination = createCombination(targetZoneRadiusArr, targetRadiusArr);
let trial = 0;

const PointingCanvas = () => {
  useEffect(() => {
    const isReplayMode = window.confirm("replay?");
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    let x = centerX;
    let y = centerY;

    let target_x = 0;
    let target_y = 0;
    let animation;

    let start_time;
    let end_time;

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

    let rad = 0;

    //Draw mouse pointer
    const canvasDraw = () => {
      ctx.lineWidth = 3;
      ctx.strokeStyle = "green";
      ctx.beginPath();
      ctx.moveTo(x - 10, y);
      ctx.lineTo(x + 10, y);
      ctx.moveTo(x, y - 10);
      ctx.lineTo(x, y + 10);
      ctx.stroke();
    };

    const setTarget = () => {
      target_zone_radius = combination[trial].targetZoneRadius / 2;
      target_radius = combination[trial].targetRadius / 2;
    };

    const drawTarget = () => {
      // Radius of the circle
      // target_zone_radius = combination[trial].targetZoneRadius / 2;
      // target_radius = combination[trial].targetRadius / 2;

      // Number of points
      const numPoints = NUM_POINTS;

      // Calculate the angle between two adjacent points
      const angleBetweenPoints = (2 * Math.PI) / numPoints;

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate the coordinates of each point
      for (let i = 0; i < numPoints; i++) {
        const angle = i * angleBetweenPoints;
        const x = centerX + target_zone_radius * Math.cos(angle);
        const y = centerY + target_zone_radius * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(x, y, target_radius, 0, degToRad(360), true);

        if (i === cnt / 2) {
          ctx.fillStyle = "red";
          ctx.fill();
        }

        if (i === numPoints / 2 + parseInt(cnt / 2)) {
          ctx.fillStyle = "blue";
          ctx.fill();
        }
      }
    };

    const getCurrentTarget = () => {
      // Number of points
      const numPoints = NUM_POINTS;

      // Calculate the angle between two adjacent points
      const angleBetweenPoints = (2 * Math.PI) / numPoints;

      for (let i = 0; i < numPoints; i++) {
        const angle = i * angleBetweenPoints;
        const x = centerX + target_zone_radius * Math.cos(angle);
        const y = centerY + target_zone_radius * Math.sin(angle);
        if (i === cnt / 2 && cnt % 2 === 0) {
          target_x = x;
          target_y = y;
        }

        if (i === numPoints / 2 + parseInt(cnt / 2) && cnt % 2 === 1) {
          target_x = x;
          target_y = y;
        }
      }
      return { target_x, target_y };
    };

    //Draw text
    const drawText = () => {
      ctx.font = "30px serif";
      ctx.fillStyle = "#fff";
      ctx.fillText(`cnt: ${cnt}`, window.innerWidth - 200, 50);
      ctx.fillText(`success: ${summary.success}`, window.innerWidth - 200, 100);
      ctx.fillText(`fail: ${summary.fail}`, window.innerWidth - 200, 150);
      ctx.fillText(
        `trial: ${trial + 1}/${combination.length}`,
        window.innerWidth - 200,
        200
      );
    };

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
      const tempRow = [
        target_radius,
        target_zone_radius,
        target_x,
        target_y,
        e.movementX,
        e.movementY,
        (x += e.movementX),
        (y += e.movementY),
        p1 - p2,
        e.buttons,
        0,
      ];

      if (e.buttons === 1) {
        getCurrentTarget();
        const dist_x = target_x - x;
        const dist_y = target_y - y;

        const distance = Math.sqrt(dist_x * dist_x + dist_y * dist_y);
        console.log(distance);

        if (distance < target_radius) {
          summary.success++;
          cnt++;

          if (cnt % 2 === 1) {
            start_time = performance.now();
          } else {
            end_time = performance.now();
            const reaction_time = end_time - start_time;

            tempRow.pop();
            tempRow.push(reaction_time);
          }
        } else if (cnt % 2 === 1) {
          summary.fail++;
          cnt--;
        }
      }

      if (cnt >= NUM_POINTS && trial + 1 === combination.length) {
        downloadCSV();
      }

      if (cnt >= NUM_POINTS) {
        //다음 trial 이동
        cnt = 0;
        trial++;
        setTarget();
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

      logArr.push(tempRow);
      p2 = p;

      // elapsed = timestamp - then;
      // if (elapsed >= FPS_INTERVAL) {
      // then = timestamp;
      drawTarget();
      canvasDraw();
      drawText();
      // }
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
        const th = arr.shift().split(",");
        let obj = th.reduce((accumulator, value, index) => {
          return { ...accumulator, [value]: index };
        }, {});
        console.log(obj);

        const log = await arr.map((item) => {
          const itemArr = item.split(",");
          return {
            target_radius: parseInt(itemArr[obj["target_radius"]]),
            target_zone_radius: parseInt(itemArr[obj["target_zone_radius"]]),
            targetX: parseInt(itemArr[obj["targetX"]]),
            targetY: parseInt(itemArr[obj["targetY"]]),
            movementX: parseInt(itemArr[obj["movementX"]]),
            movementY: parseInt(itemArr[obj["movementY"]]),
            screenX: parseInt(itemArr[obj["screenX"]]),
            screenY: parseInt(itemArr[obj["screenY"]]),
            timeDiff: parseInt(itemArr[obj["timeDiff"]]),
            buttons: parseInt(itemArr[obj["buttons"]]),
            reaction_time: parseInt(itemArr[obj["reaction_time"]]),
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
      target_radius = arr[replayCnt].target_radius;
      target_zone_radius = arr[replayCnt].target_zone_radius;

      target_x = arr[replayCnt].targetX;
      target_y = arr[replayCnt].targetY;

      x += arr[replayCnt].movementX;
      y += arr[replayCnt].movementY;

      if (arr[replayCnt].buttons) {
        cnt++;
      }

      if (!animation) {
        animation = requestAnimationFrame(function () {
          animation = null;
          // drawTarget();
          canvasDraw();
          // drawText();
        });
      }

      if (replayCnt < arr.length) {
        setTimeout(() => {
          replayCallback(arr, replayCnt);
        }, arr[replayCnt].timeDiff);
      }
    }

    canvasDraw();
    setTarget();
    drawTarget();
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
