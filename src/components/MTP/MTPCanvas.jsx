import { useEffect } from "react";
import {
  distanceBetweenTwoPoint,
  drawClickResultText,
  drawFullscreenAlertText,
  drawLateClickText,
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
} from "../../utils";
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
  prolificUserState,
} from "../../recoil/atom";
import { Balls } from "./Balls";
import usePreventRefresh from "../PreventRefresh";
import { Spin, Typography } from "antd";

export const INCH_24_WIDTH = 20.92;
export const INCH_24_HEIGHT = 11.77;

const SHOW_REWARD_TIME = 1800; //ms
const SHOW_RESULT_TIME = 600; //ms
const SHOW_ROUGH_TIME = 2400;
const SHOW_LATE_TIME = 2400;

const TOTAL_TRIALS = `${process.env.REACT_APP_TOTAL_TRIALS}`;
const STOP_TIME = 3000;

const MTPCanvas = () => {
  const [isUploading, setIsUploading] = useState(false);
  const weight = useRecoilValue(pointerWeightState);
  const ppi = useRecoilValue(ppiState);
  const monitorBound = useRecoilValue(mointorBoundState);
  const prolificUser = useRecoilValue(prolificUserState);
  const preventRefresh = usePreventRefresh();
  const MAXIMUM_ERROR_STREAK = 3;

  const navigate = useNavigate();
  const logArr = [
    [
      "trial",
      "target_radius",
      "target_x",
      "target_y",
      "cursor_x",
      "cursor_y",
      "movementX",
      "movementY",
      "screenX",
      "screenY",
      "buttons",
      "timestamp",
      "dpr",
      // "id",
      // "w",
      // "d",
      // "target_p",
      // "total_p",
      "fullscreen",
    ],
  ];
  const summaryLogArr = [
    [
      "trial",
      "success",
      "reaction_time",
      "target_p",
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

    let skipCnt = 0;
    let roughClickCnt = 0;

    if (!isUploading) {
      let moneybag = new Image();
      moneybag.src = Moneybag;
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
      balls.init({
        groupCount: 3,
        stepSize: 1.5,
        startStep: 2,
        totalCount: TOTAL_TRIALS,
      });

      balls.generateRandomDesigns();
      currentDesign = balls.popStack();

      const targetInit = (d, w) => {
        movement_stop_time = performance.now();
        p1 = performance.now();
        target_radius = inch(ppi, w);
        console.log(ppi, target_radius);
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
      const ctx = canvas.getContext("2d");

      document.addEventListener("pointerlockchange", lockChangeAlert, false);
      function lockChangeAlert() {
        if (document.pointerLockElement === canvas) {
          isPointerLock = true;
          start = true;
          document.addEventListener("mousemove", updatePosition, false);
          document.addEventListener("mousedown", mouseDown);
        } else {
          isPointerLock = false;
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
        if (p - delay > SHOW_REWARD_TIME + SHOW_RESULT_TIME && !isPaused) {
          buttons = e.buttons;
          if (e.buttons === 1) {
            lastClickResult.time = p - p1 - SHOW_RESULT_TIME - SHOW_REWARD_TIME;
            show_reward_counter = p;
            delay = p;
            movement_stop_time = p;
            skipCnt = 0;

            const distance = distanceBetweenTwoPoint(x, y, target_x, target_y);
            const current_target_success = target_radius - distance > 0 ? 1 : 0;
            let inaccurate = 0;

            if (target_radius * 5 - distance < 0) {
              //대충 클릭
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
              //성공
              summary.point += target_reward;
              lastClickResult.success = true;
              lastClickResult.point = target_reward;
              pushSummaryLog(current_target_success, 0, inaccurate);
              summary.success++;
            } else {
              //실패
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
        console.log("log log sum");
        const summaryLogRow = [
          summary.fail + summary.success,
          current_target_success,
          lastClickResult.time,
          target_reward,
          summary.point,
          fastRound3(target_radius),
          fastRound3(currentDesign.id),
          fastRound3(currentDesign.w),
          fastRound3(currentDesign.d),
          skipped,
          inaccurate,
          target_gen_error,
        ];
        console.log(summaryLogRow);
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
          `summary/s${prolificUser.PROLIFIC_PID}_${
            prolificUser.SESSION_ID
          }_${Date.now()}.csv`
        );
        const storageRef = ref(
          storage,
          `trajectory/t${prolificUser.PROLIFIC_PID}_${
            prolificUser.SESSION_ID
          }_${Date.now()}.csv`
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
              prolificUser.SESSION_ID
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
              prolificUser.SESSION_ID
            }_${Date.now()}.csv`
          );

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          //---download in local pc---
          navigate("/error");
        }
      }
      // let weight = 0.0575;
      function updatePosition(e) {
        mouse_cnt++;
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

      const drawFullscreenText = () => {
        if (window.innerHeight !== window.screen.height || !isPointerLock) {
          isFullscreen = false;
          drawFullscreenAlertText(ctx);
        } else {
          isFullscreen = true;
        }
      };

      const logging = () => {
        console.log("log log");
        const tempRow = [
          summary.fail + summary.success,
          target_radius,
          fastRound3(target_x - monitorBound.left),
          fastRound3(target_y - monitorBound.top),
          fastRound3(x - monitorBound.left),
          fastRound3(y - monitorBound.top),
          movementX,
          movementY,
          monitorBound.width,
          monitorBound.height,
          buttons,
          // lastClickResult.time,
          Date.now() / 1000,
          window.devicePixelRatio,
          isFullscreen ? 1 : 0,
        ];
        logArr.push(tempRow);
        if (buttons !== 0) buttons = 0;
        if (lastClickResult.time !== 0) lastClickResult.time = 0;
      };

      function update(timestamp) {
        resetCanvas(canvas, monitorBound);
        drawText(ctx, summary, TOTAL_TRIALS);
        drawFullscreenText();

        //움직임 감지되지 않음
        if (
          performance.now() - movement_stop_time >
          STOP_TIME + SHOW_RESULT_TIME + SHOW_REWARD_TIME
        ) {
          const p = performance.now();
          console.log(p);
          lastClickResult.time = p - p1 - SHOW_RESULT_TIME - SHOW_REWARD_TIME;
          show_reward_counter = p;
          show_late_counter = p;
          movement_stop_time = p - STOP_TIME;

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
            fastRound3(lastClickResult.time / 1000),
            lastClickResult.point,
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
          drawRewardText(ctx, moneybag, target_reward, x, y, monitorBound);
          drawPointer(ctx, x, y);
        } else if (show_late_counter + SHOW_LATE_TIME > timestamp) {
          drawLateClickText(ctx);
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
      }

      //step function execute every frame
      function step(timestamp) {
        //TO-DO end 매번 검사 안할 방법
        if (!end) {
          if (!isPaused) {
            update(timestamp);
          } else {
            resetCanvas(canvas, monitorBound);
            drawText(ctx, summary, TOTAL_TRIALS);
            drawPauseText(ctx);
          }
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
  }, [isUploading]);

  return (
    <>
      {!isUploading && (
        <canvas
          id="canvas"
          width={window.innerWidth}
          height={window.innerHeight}
        />
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
