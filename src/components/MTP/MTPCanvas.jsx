import { useEffect } from "react";
import {
  distanceBetweenTwoPoint,
  drawMTPTarget,
  drawPointer,
  drawRewardText,
  drawStartButton,
  getRandomValueInArray,
  initCanvas,
  random_point_between_circles,
  resetCanvas,
} from "../../utils";
import Description from "./Description";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Moneybag from "../../images/moneybag.png";

const RADIUS = 10;
const SHOW_REWARD_TIME = 1000; //ms
const startStamp = performance.now();
const MTPCanvas = () => {
  const [settings, setSettings] = useState({
    name: "player",
    lowerBound: 30,
    upperBound: 70,
    trial: 20,
  });

  const [isSettingMode, setIsSettingMode] = useState(true);

  const navigate = useNavigate();
  const logArr = [
    [
      "target_radius",
      "target_x",
      "target_y",
      "x",
      "y",
      "movementX",
      "movementY",
      "screenX",
      "screenY",
    ],
  ];

  useEffect(() => {
    if (!isSettingMode) {
      let moneybag = new Image();
      moneybag.src = Moneybag;

      let show_reward_counter = performance.now();

      let lower_bound = settings.lowerBound;
      let upper_bound = settings.upperBound;
      let trial = settings.trial;
      let name = settings.name;

      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;
      let delay = 0;
      let summary = {
        fail: 0,
        success: 0,
      };

      let start;
      let end = false;
      let timeDiff = 0;
      let p1 = 0;
      let p2 = 0;

      let target_radius, target_x, target_y;

      const targetInit = () => {
        target_radius = getRandomValueInArray([5, 10, 30]);

        const target_location = random_point_between_circles({
          center: { x, y },
          inner_radius: lower_bound,
          outer_radius: upper_bound,
          ball_radius: target_radius,
          screen_width: window.innerWidth,
          screen_height: window.innerHeight,
        });

        target_x = target_location.x;
        target_y = target_location.y;
      };

      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");

      document.addEventListener("pointerlockchange", lockChangeAlert, false);
      function lockChangeAlert() {
        if (document.pointerLockElement === canvas) {
          start = true;
          document.addEventListener("mousemove", updatePosition, false);
        } else {
          document.removeEventListener("mousemove", updatePosition, false);
        }
      }

      //test---
      let mouse_cnt = 0;
      let cnt = 0;
      let tt = performance.now();
      //test---

      function uploadCSV() {
        if (document.fullscreenElement) {
          document
            .exitFullscreen()
            .then(() => console.log("Document Exited from Full screen mode"))
            .catch((err) => console.error(err));
        }
        const storage = getStorage();
        const storageRef = ref(storage, `${name}_${Date.now()}.csv`);

        let csvContent = logArr
          .map((e) => {
            return e.join(",");
          })
          .join("\n");

        var encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
        //download in local pc
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "pnc.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        uploadBytes(storageRef, blob)
          .then((snapshot) => {
            console.log("blob..");
          })
          .finally(() => {
            navigate("/replay");
          });
      }

      function updatePosition(e) {
        mouse_cnt++;
        const p = performance.now();
        p1 = p;
        p2 = p;

        x += e.movementX;
        y += e.movementY;

        //마우스 가두기
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
          show_reward_counter = performance.now();
          if (p - delay > 300) {
            const distance = distanceBetweenTwoPoint(x, y, target_x, target_y);
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

        if (summary.success + summary.fail === trial && !end) {
          end = true;
          uploadCSV();
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
        ctx.fillText(
          `success: ${summary.success}`,
          window.innerWidth - 200,
          100
        );
        ctx.fillText(`fail: ${summary.fail}`, window.innerWidth - 200, 150);
      };

      //step function execute every frame
      function step(timestamp) {
        const tempRow = [
          target_radius,
          target_x,
          target_y,
          x,
          y,
          "",
          "",
          window.innerWidth,
          window.innerHeight,
        ];

        logArr.push(tempRow);

        if (tt + 1000 < performance.now()) {
          console.log("frame rate: " + cnt);
          console.log("mouse event per second: " + mouse_cnt);
          tt = performance.now();
          cnt = 0;
          mouse_cnt = 0;
        }
        cnt++;

        if (!end) {
          resetCanvas(canvas);
          drawText();

          if (show_reward_counter + SHOW_REWARD_TIME > performance.now()) {
            drawRewardText(ctx, moneybag);
          } else {
            drawMTPTarget(ctx, target_x, target_y, 0, target_radius);
            drawPointer(ctx, x, y);
          }

          requestAnimationFrame(step);
        }
      }

      function pre_step() {
        resetCanvas(canvas);

        if (start) {
          show_reward_counter = performance.now();
          requestAnimationFrame(step);
        } else {
          drawStartButton(ctx);
          requestAnimationFrame(pre_step);
        }
      }

      //init
      targetInit();
      initCanvas(canvas);
      requestAnimationFrame(pre_step);
    }
  }, [isSettingMode]);

  return (
    <>
      <Description
        setSettings={setSettings}
        setIsSettingMode={setIsSettingMode}
        isSettingMode={isSettingMode}
      />
      <canvas
        id="canvas"
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </>
  );
};

export default MTPCanvas;
