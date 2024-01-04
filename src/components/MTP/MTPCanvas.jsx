import { useEffect } from "react";
import {
  distanceBetweenTwoPoint,
  drawClickResultText,
  drawMTPTarget,
  drawPointer,
  drawRewardText,
  drawStartButton,
  drawStartButton2,
  drawText,
  fastRound3,
  getRandomValueInArray,
  inch,
  initCanvas,
  random_point_between_circles,
  resetCanvas,
} from "../../utils";
import Description from "./Description";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Moneybag from "../../images/moneybag.png";
import { useRecoilValue } from "recoil";
import {
  docIdState,
  mointorBoundState,
  pointerWeightState,
  ppiState,
} from "../../recoil/atom";
import { Balls } from "./Balls";

export const INCH_24_WIDTH = 20.92;
export const INCH_24_HEIGHT = 11.77;

const RADIUS = 10;
const SHOW_REWARD_TIME = 1200; //ms
const SHOW_RESULT_TIME = 1200; //ms
const DELAY = SHOW_REWARD_TIME + SHOW_RESULT_TIME + 100;

const startStamp = performance.now();
const MTPCanvas = () => {
  const [settings, setSettings] = useState({
    name: "player",
    lowerBound: 30,
    upperBound: 70,
    trial: 20,
  });

  const [isSettingMode, setIsSettingMode] = useState(false);
  const weight = useRecoilValue(pointerWeightState);
  const ppi = useRecoilValue(ppiState);
  const monitorBound = useRecoilValue(mointorBoundState);
  const docId = useRecoilValue(docIdState);

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
      "buttons",
      "reaction_time",
      "timestamp",
      "dpr",
      "id",
      "w",
      "d",
      "success",
      "target_p",
      "total_p",
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
      let movement_stop_time = 0;

      let movementX = 0;
      let movementY = 0;
      let buttons = 0;

      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;
      let delay = 0;
      let summary = {
        fail: 0,
        success: 0,
        point: 0,
      };
      let lastClickResult = {
        success: false,
        time: 0,
        point: 0,
      };

      let start;
      let end = false;

      let target_radius, target_x, target_y;
      let target_reward;
      let currentDesign = null;
      let p1 = 0;

      const balls = new Balls();
      balls.init({
        groupCount: 3,
        stepSize: 1.5,
        startStep: 2,
        totalCount: 3,
      });

      balls.generateRandomDesigns();
      currentDesign = balls.popStack();

      const targetInit = (d, w) => {
        movement_stop_time = performance.now();
        p1 = performance.now();
        target_radius = inch(ppi, w);
        target_reward = getRandomValueInArray([0, 10, 50]);

        const target_location = random_point_between_circles({
          center: { x, y },
          inner_radius: inch(ppi, d),
          outer_radius: inch(ppi, d),
          ball_radius: inch(ppi, w),
          screen_width: monitorBound.width,
          screen_height: monitorBound.height,
          top: monitorBound.top,
          left: monitorBound.left,
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
          document.addEventListener("mousedown", mouseDown);
        } else {
          document.removeEventListener("mousemove", updatePosition, false);
          document.removeEventListener("mousedown", mouseDown);
        }
      }
      //test---
      let mouse_cnt = 0;
      let cnt = 0;
      let tt = performance.now();
      //test---

      const mouseDown = (e) => {
        const p = performance.now();
        if (p - delay > SHOW_REWARD_TIME + SHOW_RESULT_TIME) {
          buttons = e.buttons;
          if (e.buttons === 1) {
            lastClickResult.time = p - p1 - SHOW_RESULT_TIME - SHOW_REWARD_TIME;
            show_reward_counter = p;
            delay = p;
            const distance = distanceBetweenTwoPoint(x, y, target_x, target_y);
            if (target_radius - distance > 0) {
              //성공시 이펙트 추가
              summary.point += target_reward;
              summary.success++;
              lastClickResult.success = true;
              lastClickResult.point = target_reward;
            } else {
              //실패시 이펙트 추가
              summary.fail++;
              lastClickResult.success = false;
            }

            if (balls.getRandomDesignArray().length === 0 && !end) {
              alert("done!!");
              end = true;
              uploadCSV();
            } else {
              currentDesign = balls.popStack();
              targetInit(currentDesign.d, currentDesign.w);
            }
          }
        }
      };

      async function uploadCSV() {
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
        const snapshot = await uploadBytes(storageRef, blob);
        // .then((snapshot) => {
        //   console.log("blob..");
        // })
        // .finally(() => {
        //   navigate("/replay");
        // });

        console.log(snapshot);
      }
      // let weight = 0.0575;
      function updatePosition(e) {
        mouse_cnt++;
        const p = performance.now();
        movement_stop_time = p;
        if (
          show_reward_counter + SHOW_REWARD_TIME + SHOW_RESULT_TIME <
          performance.now()
        ) {
          movementX += e.movementX;
          movementY += e.movementY;

          x += e.movementX * weight * 10;
          y += e.movementY * weight * 10;
        }

        //마우스 가두기
        if (x > window.screen.width - monitorBound.left) {
          x = window.screen.width - monitorBound.left;
        }
        if (y > window.screen.height - monitorBound.top) {
          y = window.screen.height - monitorBound.top;
        }
        if (x < monitorBound.left) {
          x = monitorBound.left;
        }
        if (y < monitorBound.top) {
          y = monitorBound.top;
        }
      }

      const logging = () => {
        console.log("log log");
        const tempRow = [
          fastRound3(target_radius),
          fastRound3(target_x - monitorBound.left),
          fastRound3(target_y - monitorBound.top),
          fastRound3(x - monitorBound.left),
          fastRound3(y - monitorBound.top),
          movementX,
          movementY,
          monitorBound.width,
          monitorBound.height,
          buttons,
          lastClickResult.time,
          Date.now() / 1000,
          window.devicePixelRatio,
          fastRound3(currentDesign.id),
          fastRound3(currentDesign.w),
          fastRound3(currentDesign.d),
        ];
        logArr.push(tempRow);
        if (buttons !== 0) buttons = 0;
        if (lastClickResult.time !== 0) lastClickResult.time = 0;
      };

      //step function execute every frame
      function step(timestamp) {
        //TO-DO end 매번 검사 안할 방법
        if (!end) {
          resetCanvas(canvas, monitorBound);
          drawText(ctx, summary, 900);

          //움직임 감지되지 않음
          if (
            performance.now() - movement_stop_time >
            3000 + SHOW_RESULT_TIME + SHOW_REWARD_TIME
          ) {
            const p = performance.now();
            lastClickResult.time = p - p1 - SHOW_RESULT_TIME - SHOW_REWARD_TIME;
            show_reward_counter = p;
            delay = p;

            console.log("stop.");
            summary.fail++;
            lastClickResult.success = false;
            if (balls.getRandomDesignArray().length === 0 && !end) {
              alert("done!!");
              end = true;
              uploadCSV();
            } else {
              currentDesign = balls.popStack();
              targetInit(currentDesign.d, currentDesign.w);
            }
            movement_stop_time = p;
          }
          //움직임 감지 끝
          if (
            show_reward_counter + SHOW_RESULT_TIME > timestamp &&
            summary.success + summary.fail > 0
          ) {
            drawClickResultText(
              ctx,
              lastClickResult.success,
              fastRound3(lastClickResult.time / 1000),
              lastClickResult.point
            );
            drawPointer(ctx, x, y);
          } else if (
            show_reward_counter + SHOW_REWARD_TIME + SHOW_RESULT_TIME >
              timestamp ||
            !timestamp
          ) {
            drawRewardText(ctx, moneybag, target_reward);
            drawPointer(ctx, x, y);
          }
          if (
            show_reward_counter + SHOW_REWARD_TIME + SHOW_RESULT_TIME <
            timestamp
          ) {
            logging();
            drawMTPTarget(ctx, target_x, target_y, 0, target_radius);
            drawPointer(ctx, x, y);
          }

          movementX = 0;
          movementY = 0;

          requestAnimationFrame(step);
        }
      }

      function pre_step() {
        resetCanvas(canvas, monitorBound);
        if (start) {
          targetInit(currentDesign.d, currentDesign.w);
          show_reward_counter = performance.now();
          step();
        } else {
          drawStartButton2(ctx);
          requestAnimationFrame(pre_step);
        }
      }

      //init
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
