import { useEffect } from "react";
import {
  distanceBetweenTwoPoint,
  drawClickResultText,
  drawFullscreenAlertText,
  drawLateClickText,
  drawMaxDistance,
  drawMTPTarget,
  drawPauseText,
  drawPointer,
  drawRewardText,
  drawRoughClickText,
  drawStartButton2,
  drawText,
  fastRound3,
  inch,
  initCanvas,
  random_point_between_circles,
  resetCanvas,
  shuffle,
} from "../../utils";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Reward0 from "../../images/max_reward/reward_0.png";
import Reward4 from "../../images/max_reward/reward_4.png";
import Reward20 from "../../images/max_reward/reward_20.png";

import { useRecoilValue } from "recoil";
import {
  docIdState,
  mointorBoundState,
  pointerWeightState,
  ppiState,
  prolificUserState,
} from "../../recoil/atom";
import { Balls } from "./Balls";
import usePreventRefresh from "../PreventRefresh";
import { Spin, Typography } from "antd";
import { wrap } from "comlink";

export const INCH_24_WIDTH = 20.92;
export const INCH_24_HEIGHT = 11.77;

const SHOW_REWARD_TIME = 1400; //ms
const SHOW_RESULT_TIME = 1000; //ms
const SHOW_ROUGH_TIME = 2400;
const SHOW_LATE_TIME = 2400;
const TOTAL_TRIALS = process.env.REACT_APP_TOTAL_TRIALS;
const STOP_TIME = 3000;
const MAXIMUM_ERROR_STREAK = 3;

// function quantile(arr, q) {
//   const sorted = arr.slice().sort((a, b) => a - b);
//   const pos = (sorted.length - 1) * q;
//   const base = Math.floor(pos);
//   const rest = pos - base;

//   if (sorted[base + 1] !== undefined) {
//     return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
//   } else {
//     return sorted[base];
//   }
// }

const MTPCanvas = () => {
  const [isUploading, setIsUploading] = useState(false);
  const weight = useRecoilValue(pointerWeightState);
  // const weight = 1;
  const ppi = useRecoilValue(ppiState);
  const monitorBound = useRecoilValue(mointorBoundState);
  const prolificUser = useRecoilValue(prolificUserState);
  const preventRefresh = usePreventRefresh();

  const navigate = useNavigate();
  const logArr = [
    [
      "trial",
      "target_radius",
      "target_x",
      "target_y",
      "cursor_x",
      "cursor_y",
      "screenX",
      "screenY",
      "buttons",
      "timestamp",
      "dpr",
      "fullscreen",
    ],
  ];
  const summaryLogArr = [
    [
      "trial",
      "success",
      "trial_completion_time",
      "target_p",
      "got_p",
      "total_p",
      "target_radius",
      "id",
      "w",
      "d",
      "skipped",
      "inaccurate",
      "gen",
    ],
  ];

  useEffect(() => {
    let isPaused = false;
    let movement_stop_time = 0;
    let show_reward_counter = performance.now();
    let show_rough_counter = -SHOW_ROUGH_TIME;
    let show_late_counter = -SHOW_LATE_TIME;
    let recent_20_trials_rt = [
      300.2002, 414.27628, 531.35435, 645.43043, 762.50851, 876.58458,
      993.6626600000001, 1107.73874, 1224.81682, 1338.8928899999999, 1455.97097,
      1570.0470500000001, 1687.1251300000001, 1801.2012, 1918.27928, 2032.35536,
      2149.43343, 2263.50951, 2380.58759, 2497.66567,
    ];
    let step = 3000 / 19;

    let responseTime = null;
    let loggingStartTime = null;
    let current_reward = null;
    shuffle(recent_20_trials_rt);

    let skipCnt = 0;
    let roughClickCnt = 0;

    if (!isUploading && weight) {
      let reward0 = new Image({});
      let reward4 = new Image({});
      let reward20 = new Image({});

      reward0.src = Reward0;
      reward4.src = Reward4;
      reward20.src = Reward20;

      const rewardImages = {
        0: reward0,
        4: reward4,
        20: reward20,
      };

      show_reward_counter = performance.now();

      let movementX = 0;
      let movementY = 0;
      let buttons = 0;
      let isFullscreen = false;
      let isPointerLock = false;

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

      let target_radius, target_x, target_y, target_gen_error;
      let target_reward;
      let currentDesign = null;
      let p1 = 0;

      const balls = new Balls();
      // balls.init({
      //   groupCount: 3,
      //   stepSize: 1.5,
      //   startStep: 2,
      //   totalCount: TOTAL_TRIALS,
      // });

      balls.init({
        groupCount: 3,
        stepSize: 1.33333,
        startStep: 3,
        totalCount: TOTAL_TRIALS,
      });

      balls.generateRandomDesigns();
      currentDesign = balls.popStack();

      const targetInit = (d, w) => {
        movement_stop_time = performance.now();
        p1 = performance.now();
        responseTime = null;
        loggingStartTime = null;
        target_radius = inch(ppi, w);
        target_reward = currentDesign.reward;

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
        target_gen_error = target_location.gen;
      };

      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d", { alpha: false });

      const lockChangeAlert = () => {
        if (document.pointerLockElement === canvas) {
          isPointerLock = true;
          start = true;
          document.addEventListener("mousemove", updatePosition, false);
          document.addEventListener("mousedown", mouseDown, false);
        } else {
          isPointerLock = false;
          document.removeEventListener("mousemove", updatePosition, false);
          document.removeEventListener("mousedown", mouseDown, false);
        }
      };

      document.addEventListener("pointerlockchange", lockChangeAlert, false);

      //test---
      // let mouse_cnt = 0;
      // let cnt = 0;
      // let tt = performance.now();
      //test---

      const mouseDown = (e) => {
        if (e.buttons === 1) {
          const p = performance.now();
          if (p - delay > SHOW_REWARD_TIME + SHOW_RESULT_TIME && !isPaused) {
            responseTime = p - loggingStartTime;
            // let t0 = quantile(recent_20_trials_rt, 0.1);
            // let t1 = quantile(recent_20_trials_rt, 0.9);
            // console.log(t0, t1);
            // recent_20_trials_rt.pop();
            // recent_20_trials_rt.unshift(responseTime);

            buttons = e.buttons;

            show_reward_counter = p;
            delay = p;
            movement_stop_time = p;
            skipCnt = 0;

            const distance = distanceBetweenTwoPoint(x, y, target_x, target_y);
            const current_target_success = target_radius - distance > 0 ? 1 : 0;
            let inaccurate = 0;

            if (inch(ppi, balls.max_target_radius) * 5 - distance < 0) {
              // if (target_radius * 5 - distance < 0) {
              inaccurate = 1;
              show_rough_counter = p;
              pushSummaryLog(current_target_success, 0, inaccurate);
              targetInit(currentDesign.d, currentDesign.w);

              return;
              // if (roughClickCnt > MAXIMUM_ERROR_STREAK) {
              //   show_rough_counter = p;
              //   roughClickCnt = 0;
              // }
            } else if (target_radius - distance > 0) {
              let reward = target_reward / (1 + (0.6 * responseTime) / 1000);
              console.log(reward);

              reward = Math.min(target_reward, reward);
              reward = Math.max(reward, 0);
              reward = Number(reward.toFixed(2));
              current_reward = reward;

              console.log(summary.point);
              console.log(reward);

              summary.point += reward;
              lastClickResult.success = true;
              lastClickResult.point = reward;
              pushSummaryLog(current_target_success, 0, inaccurate);
              summary.success++;
            } else {
              //실패
              current_reward = 0;
              lastClickResult.success = false;
              lastClickResult.point = 0;
              pushSummaryLog(current_target_success, 0, inaccurate);
              summary.fail++;
            }

            if (balls.getRandomDesignArray().length === 0 && !end) {
              end = true;
              uploadCSV();
              setIsUploading(true);
            } else {
              currentDesign = balls.popStack();
              targetInit(currentDesign.d, currentDesign.w);
            }
          }
        }
      };

      const pushSummaryLog = (
        current_target_success,
        skipped = 0,
        inaccurate = 0
      ) => {
        const summaryLogRow = [
          summary.fail + summary.success,
          current_target_success,
          responseTime,
          target_reward,
          current_reward,
          summary.point,
          fastRound3(target_radius),
          fastRound3(currentDesign.id),
          fastRound3(currentDesign.w),
          fastRound3(currentDesign.d),
          skipped,
          inaccurate,
          target_gen_error,
        ];
        summaryLogArr.push(summaryLogRow);
      };

      async function uploadCSV() {
        console.log("upload csv");

        if (document.fullscreenElement) {
          document
            .exitFullscreen()
            .then(() => console.log("Document Exited from Full screen mode"))
            .catch((err) => console.error(err));
        }
        const storage = getStorage();

        const summaryStorageRef = ref(
          storage,
          `summary/${prolificUser.PROLIFIC_PID}_${prolificUser.STUDY_ID}.csv`
        );
        const storageRef = ref(
          storage,
          `trajectory/${prolificUser.PROLIFIC_PID}_${prolificUser.STUDY_ID}.csv`
        );

        let summaryContent = summaryLogArr
          .map((e) => {
            return e.join(",");
          })
          .join("\n");

        let csvContent = logArr
          .map((e) => {
            return e.join(",");
          })
          .join("\n");

        const summaryBlob = new Blob([summaryContent], {
          type: "text/csv;charset=utf-8;",
        });
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        try {
          const summarySnapshot = await uploadBytes(
            summaryStorageRef,
            summaryBlob
          );
          const snapshot = await uploadBytes(storageRef, blob);
          console.log(summarySnapshot);
          console.log(snapshot);
          navigate("/done");
        } catch {
          alert(
            "An error occurred during the upload. The data file will be downloaded directly to your PC. please send the two downloaded files to eddhall0821@yonsei.ac.kr and we will process them. your completion code is CSE63DRO."
          );
          //---download in local pc---
          var summaryEncodedUri = encodeURI(
            `data:text/csv;charset=utf-8,${summaryContent}`
          );
          var encodedUri = encodeURI(
            `data:text/csv;charset=utf-8,${csvContent}`
          );

          var link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute(
            "download",
            `trajectory/${prolificUser.PROLIFIC_PID}_${
              prolificUser.STUDY_ID
            }_${Date.now()}.csv`
          );

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          var link = document.createElement("a");
          link.setAttribute("href", summaryEncodedUri);
          link.setAttribute(
            "download",
            `summary/${prolificUser.PROLIFIC_PID}_${
              prolificUser.STUDY_ID
            }_${Date.now()}.csv`
          );

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          //---download in local pc---
          navigate("/error");
        }
      }

      function updatePosition(e) {
        const p = performance.now();

        // if (
        //   !responseTime &&
        //   loggingStartTime &&
        //   show_reward_counter + SHOW_REWARD_TIME + SHOW_RESULT_TIME < p
        // ) {
        //   responseTime = (p - loggingStartTime) / 1000;
        //   console.log(responseTime);
        // }

        if (show_reward_counter + SHOW_REWARD_TIME + SHOW_RESULT_TIME < p) {
          // movementX += e.movementX;
          // movementY += e.movementY;

          x += e.movementX * weight;
          y += e.movementY * weight;
        } else {
          if (
            (e.movementX > 2 || e.movementY > 2) &&
            show_reward_counter + SHOW_RESULT_TIME < p
          ) {
            show_reward_counter = performance.now() - SHOW_RESULT_TIME - 10;
            movement_stop_time = performance.now() - SHOW_RESULT_TIME - 10;
          }
        }

        x = Math.max(
          monitorBound.left,
          Math.min(x, window.screen.width - monitorBound.left)
        );
        y = Math.max(
          monitorBound.top,
          Math.min(y, window.screen.height - monitorBound.top)
        );
      }

      const drawFullscreenText = () => {
        if (window.innerHeight !== window.screen.height || !isPointerLock) {
          isFullscreen = false;
          drawFullscreenAlertText(ctx);
        } else {
          isFullscreen = true;
        }
      };

      const logging = () => {
        if (!loggingStartTime) {
          loggingStartTime = performance.now(); // Set the logging start time
          console.log("START.");
        }

        const tempRow = [
          summary.fail + summary.success,
          target_radius,
          fastRound3(target_x - monitorBound.left),
          fastRound3(target_y - monitorBound.top),
          fastRound3(x - monitorBound.left),
          fastRound3(y - monitorBound.top),
          // movementX,
          // movementY,
          monitorBound.width,
          monitorBound.height,
          buttons,
          Date.now() / 1000,
          window.devicePixelRatio,
          isFullscreen ? 1 : 0,
        ];
        logArr.push(tempRow);
        if (buttons !== 0) buttons = 0;
      };

      function update(timestamp) {
        resetCanvas(ctx, monitorBound);
        drawText(ctx, summary, TOTAL_TRIALS);
        drawFullscreenText();

        //움직임 감지되지 않음
        if (
          performance.now() - movement_stop_time >
          STOP_TIME + SHOW_RESULT_TIME + SHOW_REWARD_TIME
        ) {
          const p = performance.now();
          responseTime = 0;
          show_reward_counter = p;
          show_late_counter = p;
          movement_stop_time = p - STOP_TIME;
          current_reward = 0;
          delay = p;
          // summary.fail++;
          lastClickResult.success = false;
          lastClickResult.point = 0;
          pushSummaryLog(0, 1, 0);
          currentDesign = currentDesign;
          targetInit(currentDesign.d, currentDesign.w);
          // }
          skipCnt++;
          if (skipCnt >= MAXIMUM_ERROR_STREAK) {
            isPaused = true;
          }
        }

        //움직임 감지 끝
        if (show_rough_counter + SHOW_ROUGH_TIME > timestamp) {
          drawRoughClickText(ctx);
          drawPointer(ctx, x, y);
        } else if (show_late_counter + SHOW_LATE_TIME > timestamp) {
          drawLateClickText(ctx);
        } else if (
          show_reward_counter + SHOW_RESULT_TIME > timestamp &&
          summary.success + summary.fail > 0
        ) {
          drawClickResultText(
            ctx,
            lastClickResult.success,
            fastRound3(current_reward),
            // lastClickResult.point,
            x,
            y,
            monitorBound
          );
          drawPointer(ctx, x, y);
        } else if (
          show_reward_counter + SHOW_REWARD_TIME + SHOW_RESULT_TIME >
            timestamp ||
          !timestamp
        ) {
          drawRewardText(
            ctx,
            rewardImages[target_reward],
            target_reward,
            x,
            y,
            monitorBound,
            show_reward_counter + SHOW_REWARD_TIME + SHOW_RESULT_TIME,
            timestamp
          );
          // drawRewardProgressBar(
          //   ctx,
          //   show_reward_counter + SHOW_REWARD_TIME + SHOW_RESULT_TIME,
          //   timestamp
          // );
          drawPointer(ctx, x, y);
        } else if (show_late_counter + SHOW_LATE_TIME > timestamp) {
          drawLateClickText(ctx);
        }
        if (
          show_reward_counter + SHOW_REWARD_TIME + SHOW_RESULT_TIME <
          timestamp
        ) {
          logging();
          // drawMaxDistance(
          //   ctx,
          //   target_x,
          //   target_y,
          //   inch(ppi, balls.max_target_radius) * 5
          // );
          drawMTPTarget(ctx, target_x, target_y, 0, target_radius);
          drawPointer(ctx, x, y);
        }

        movementX = 0;
        movementY = 0;
      }

      //step function execute every frame
      function step(timestamp) {
        //TO-DO end 매번 검사 안할 방법
        if (!end) {
          if (!isPaused) {
            update(timestamp);
          } else {
            resetCanvas(ctx, monitorBound);
            drawText(ctx, summary, TOTAL_TRIALS);
            drawPauseText(ctx);
          }
          requestAnimationFrame(step);
        }
      }

      function pre_step() {
        resetCanvas(ctx, monitorBound);
        if (start) {
          targetInit(currentDesign.d, currentDesign.w);
          show_reward_counter = performance.now();
          step();
        } else {
          drawText(ctx, summary, TOTAL_TRIALS);
          drawStartButton2(ctx);
          requestAnimationFrame(pre_step);
        }
      }

      //init
      initCanvas(canvas);
      requestAnimationFrame(pre_step);
    }

    function handlePause(e) {
      if (isPaused && e.key === "Enter") {
        isPaused = false;
        skipCnt = 0;
        movement_stop_time = performance.now();
        show_reward_counter = performance.now();
      }
    }
    document.addEventListener("keypress", handlePause);
    return () => {
      document.removeEventListener("keypress", handlePause);
    };
  }, [isUploading, weight]);

  return (
    <>
      {!isUploading && (
        <>
          <canvas
            id="canvas"
            width={window.innerWidth}
            height={window.innerHeight}
          />
        </>
      )}
      {isUploading && (
        <div>
          <Typography.Title>
            <Spin size="large" />
            <br />
            Uploading
            <br />
            Never close the screen...
          </Typography.Title>
        </div>
      )}
    </>
  );
};

export default MTPCanvas;
