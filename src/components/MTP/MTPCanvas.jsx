import { useEffect } from "react";
import {
  distanceBetweenTwoPoint,
  drawMTPTarget,
  drawPointer,
  drawRewardText,
  drawStartButton,
  drawText,
  getRandomArbitrary,
  getRandomValueInArray,
  getWdithByIDAndDistance,
  inch,
  initCanvas,
  random_point_between_circles,
  resetCanvas,
  shuffle,
} from "../../utils";
import Description from "./Description";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Moneybag from "../../images/moneybag.png";
import { useRecoilValue } from "recoil";
import {
  mointorBoundState,
  pointerWeightState,
  ppiState,
} from "../../recoil/atom";

export const INCH_24_WIDTH = 20.92;
export const INCH_24_HEIGHT = 11.77;

const RADIUS = 10;
const SHOW_REWARD_TIME = 500; //ms
const startStamp = performance.now();
const MTPCanvas = () => {
  const [settings, setSettings] = useState({
    name: "player",
    lowerBound: 30,
    upperBound: 70,
    trial: 20,
  });

  const [isSettingMode, setIsSettingMode] = useState(true);
  const weight = useRecoilValue(pointerWeightState);
  const ppi = useRecoilValue(ppiState);
  const monitorBound = useRecoilValue(mointorBoundState);

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

  const balls = {
    designs: [],
    randomDesignArray: [],

    generateRandomDesigns: function () {
      let randomDesignArray = [];
      for (let design of this.designs) {
        for (let i = 0; i < design.cnt; i++) {
          const random = Math.random();

          const minDistance = 2;
          const maxDistance = INCH_24_HEIGHT / 2;
          const randId = random * design.idStep + design.idStart;
          const distance = random * (maxDistance - minDistance) + minDistance;
          const width = getWdithByIDAndDistance(randId, distance);
          randomDesignArray.push({
            random: random,
            id: randId,
            d: distance,
            w: width,
          });
        }
      }
      this.randomDesignArray = shuffle(randomDesignArray);
    },

    getRandomDesignArray: function () {
      if (this.randomDesignArray.length !== 0) return this.randomDesignArray;
      else return [];
    },

    init: function ({ groupCount, stepSize, startStep, totalCount }) {
      this.designs = [];
      for (let i = 0; i < groupCount; i++) {
        this.designs.push({
          index: i,
          cnt: totalCount / groupCount,
          idStart: startStep + i * stepSize,
          idStep: stepSize,
        });
      }
    },
  };

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
        point: 0,
      };

      let start;
      let end = false;
      let timeDiff = 0;
      let p1 = 0;
      let p2 = 0;

      let target_radius, target_x, target_y;
      let target_reward;

      const targetInit = () => {
        target_radius = getRandomValueInArray([4, 4, 4]);
        target_reward = getRandomValueInArray([0, 10, 50]);

        const target_location = random_point_between_circles({
          center: { x, y },
          inner_radius: lower_bound,
          outer_radius: upper_bound,
          ball_radius: target_radius,
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
      // let weight = 0.0575;
      function updatePosition(e) {
        mouse_cnt++;
        const p = performance.now();
        p1 = p;
        p2 = p;

        if (show_reward_counter + SHOW_REWARD_TIME < performance.now()) {
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

        if (e.buttons === 1) {
          show_reward_counter = performance.now();
          if (p - delay > 300) {
            const distance = distanceBetweenTwoPoint(x, y, target_x, target_y);
            if (target_radius - distance > 0) {
              //성공시 이펙트 추가
              summary.point += target_reward;
              summary.success++;
            } else {
              //실패시 이펙트 추가
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
          // console.log("frame rate: " + cnt);
          // console.log("mouse event per second: " + mouse_cnt);
          tt = performance.now();
          cnt = 0;
          mouse_cnt = 0;
        }
        cnt++;

        //TO-DO end 매번 검사 안할 방법
        if (!end) {
          resetCanvas(canvas, monitorBound);
          drawText(ctx, summary);

          if (show_reward_counter + SHOW_REWARD_TIME > performance.now()) {
            drawRewardText(ctx, moneybag, target_reward);
            drawPointer(ctx, x, y);
          } else {
            drawMTPTarget(ctx, target_x, target_y, 0, target_radius);
            drawPointer(ctx, x, y);
          }

          requestAnimationFrame(step);
        }
      }

      function pre_step() {
        resetCanvas(canvas, monitorBound);
        if (start) {
          targetInit();
          show_reward_counter = performance.now();
          step();
        } else {
          drawStartButton(ctx);
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
