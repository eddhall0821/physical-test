import { useEffect, useRef } from "react";
import {
  drawMTPTarget,
  drawPointer,
  initCanvas,
  resetCanvas,
  toggleFullScreen,
} from "../../utils";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { useRecoilValue } from "recoil";
import { mointorBoundState } from "../../recoil/atom";

Array.prototype.next = function () {
  return this[++this.current];
};
Array.prototype.prev = function () {
  return this[--this.current];
};
Array.prototype.current = 0;

const ReplayTimeinteval = () => {
  useEffect(() => {
    let target_radius = 0;
    let screenX, screenY;
    let target_x = 0;
    let target_y = 0;
    let x = 0;
    let y = 0;
    let cnt = 0;
    let animation;
    let timestamp = null;

    let currTimestamp = 0;
    let prevTimestamp = 0;

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const fileInput = document.getElementById("replay");
    fileInput.addEventListener("change", readFile);
    let logArr = [];
    let logIndex = 0;

    async function readFile() {
      console.log(performance.now());
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

        const log = await arr.map((item) => {
          const itemArr = item.split(",");
          return {
            target_radius: parseInt(itemArr[obj["target_radius"]]),
            target_x: parseInt(itemArr[obj["target_x"]]),
            target_y: parseInt(itemArr[obj["target_y"]]),
            x: parseInt(itemArr[obj["cursor_x"]]),
            y: parseInt(itemArr[obj["cursor_y"]]),
            // movementX: parseInt(itemArr[obj["movementX"]]),
            // movementY: parseInt(itemArr[obj["movementY"]]),
            screenX: parseInt(itemArr[obj["screenX"]]),
            screenY: parseInt(itemArr[obj["screenY"]]),
            buttons: parseInt(itemArr[obj["buttons"]]),
            timestamp: itemArr[obj["timestamp"]],
            // buttons: parseInt(itemArr[obj["buttons"]]),
            // reaction_time: parseInt(itemArr[obj["reaction_time"]]),
          };
        });
        startReplay(log);
      };
    }

    function startReplay(arr) {
      replayCallback(arr, cnt);
    }

    function replayCallback(arr, replayCnt) {
      prevTimestamp = new Date(timestamp).getTime();

      replayCnt++;
      target_radius = arr[replayCnt].target_radius;
      screenX = arr[replayCnt].screenX;
      screenY = arr[replayCnt].screenY;
      target_x = arr[replayCnt].target_x;
      target_y = arr[replayCnt].target_y;
      timestamp = arr[replayCnt].timestamp;

      currTimestamp = new Date(timestamp).getTime();
      console.log(currTimestamp - prevTimestamp);
      x = arr[replayCnt].x;
      y = arr[replayCnt].y;

      if (arr[replayCnt].buttons) {
        cnt++;
      }

      if (!animation) {
        animation = requestAnimationFrame(function () {
          animation = null;
          // drawTarget();
          resetCanvas(ctx, {
            width: screenX,
            height: screenY,
            top: 0,
            left: 0,
          });

          drawMTPTarget(ctx, target_x, target_y, 0, target_radius);
          drawPointer(ctx, x, y);
          // drawText();
        });
      }
      console.log(currTimestamp - prevTimestamp);
      if (replayCnt < arr.length) {
        setTimeout(() => {
          replayCallback(arr, replayCnt);
          // }, arr[replayCnt].timeDiff);
        }, 16);
      }
    }
    initCanvas(ctx);
    drawMTPTarget(ctx, target_x, target_y, 0, target_radius);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
      }}
    >
      <input type="file" id="replay" />
      <Link to="/">
        <Button>홈</Button>
      </Link>
      <canvas
        id="canvas"
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  );
};

export default ReplayTimeinteval;
