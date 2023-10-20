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

Array.prototype.next = function () {
  return this[++this.current];
};
Array.prototype.prev = function () {
  return this[--this.current];
};
Array.prototype.current = 0;

const MTPReplay = () => {
  useEffect(() => {
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
        console.log(obj);

        const log = await arr.map((item) => {
          const itemArr = item.split(",");
          return {
            target_radius: parseInt(itemArr[obj["target_radius"]]),
            target_x: parseInt(itemArr[obj["target_x"]]),
            target_y: parseInt(itemArr[obj["target_y"]]),
            x: parseInt(itemArr[obj["x"]]),
            y: parseInt(itemArr[obj["y"]]),
            movementX: parseInt(itemArr[obj["movementX"]]),
            movementY: parseInt(itemArr[obj["movementY"]]),
            screenX: parseInt(itemArr[obj["screenX"]]),
            screenY: parseInt(itemArr[obj["screenY"]]),
            // buttons: parseInt(itemArr[obj["buttons"]]),
            // reaction_time: parseInt(itemArr[obj["reaction_time"]]),
          };
        });
        logArr = log;
        startReplay(log);
      };

      const step = (timestamp) => {
        const {
          target_radius,
          target_x,
          target_y,
          x,
          y,
          movementX,
          movementY,
          screenX,
          screenY,
        } = logArr.next();

        if (logArr.length > logIndex) {
          resetCanvas(canvas);
          drawMTPTarget(ctx, target_x, target_y, 0, target_radius);
          drawPointer(ctx, x, y);
          logIndex++;
        }

        requestAnimationFrame(step);
      };

      const startReplay = (log) => {
        toggleFullScreen(canvas);
        window.onresize = () => {
          canvas.width = window.innerWidth - 100;
          canvas.height = window.innerHeight;
        };

        requestAnimationFrame(step);
      };
    }
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

export default MTPReplay;
