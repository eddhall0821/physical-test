import { useCallback, useEffect } from "react";
import {
  distanceBetweenTwoPoint,
  drawClickResultText,
  drawCurrentRewardText,
  drawFullscreenAlertText,
  drawLateClickText,
  drawMaxDistance,
  drawMTPTarget,
  drawPauseText,
  drawPointer,
  drawRewardLevelText,
  drawRewardText,
  drawRoughClickText,
  drawStartButton2,
  drawText,
  fastRound3,
  financial,
  FONT_SIZE,
  getTimePercent,
  getTimerColor,
  inch,
  initCanvas,
  initMultipleCanvas,
  millisToMinutesAndSeconds,
  moveCircle,
  random_point_between_circles,
  repeatAnimation,
  resetCanvas,
  shuffle,
  temporal_discounting_reward,
} from "../../utils";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTimer } from "react-use-precision-timer";
import reward_settings from "../../images/reward_setting.png";
import Reward0 from "../../images/max_reward/reward_0.png";
import Reward4 from "../../images/max_reward/reward_4.png";
import Reward20 from "../../images/max_reward/reward_20.png";
import Cent from "../../images/cent.png";

import { useRecoilValue } from "recoil";
import {
  mointorBoundState,
  pointerWeightState,
  ppiState,
  prolificUserState,
} from "../../recoil/atom";
import { Balls } from "./Balls";
import usePreventRefresh from "../PreventRefresh";
import { Spin, Typography } from "antd";
import { Subs } from "react-sub-unsub";

export const INCH_24_WIDTH = 20.92;
export const INCH_24_HEIGHT = 11.77;

const TOTAL_TIME = 15 * 60 * 1000;

export const SHOW_REWARD_TIME = 800; //ms
export const SHOW_RESULT_TIME = 0; //ms
export const SHOW_ROUGH_TIME = 2400;
export const SHOW_LATE_TIME = 2400;

// const TOTAL_TRIALS = process.env.REACT_APP_TOTAL_TRIALS;
const TOTAL_TRIALS = 600;

export const STOP_TIME = 3000;
export const MAXIMUM_ERROR_STREAK = 3;

const NUM_SESSIONS = 0;

const MTPCanvas = () => {
  const callback = useCallback(() => {
    end = true;
    uploadCSV();
    setIsUploading(true);
  }, []);

  const timer = useTimer({ delay: TOTAL_TIME, runOnce: true }, callback);

  useEffect(() => {
    if (timer.isStarted()) {
      const subs = new Subs();
      subs.setInterval(() => setRemainTime(timer.getRemainingTime()), 500);
      return subs.createCleanup();
    }
  }, [timer.isStarted()]);

  let end = false;

  const [remainTime, setRemainTime] = useState(0);

  const [isUploading, setIsUploading] = useState(false);
  const weight = useRecoilValue(pointerWeightState);
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
      const summarySnapshot = await uploadBytes(summaryStorageRef, summaryBlob);
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
      var encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);

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

  useEffect(() => {
    let isPaused = false;
    // let isSessionEnded = false;

    let movement_stop_time = 0;
    let show_reward_counter = performance.now();
    let show_rough_counter = -SHOW_ROUGH_TIME;
    let show_late_counter = -SHOW_LATE_TIME;

    let responseTime = null;
    let loggingStartTime = null;
    let current_reward = null;

    let skipCnt = 0;
    let roughClickCnt = 0;
    let myReq;
    let reward0 = new Image({});
    let reward4 = new Image({});
    let reward20 = new Image({});
    let cent = new Image({});

    reward0.src = Reward0;
    reward4.src = Reward4;
    reward20.src = Reward20;
    cent.src = Cent;

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
      total: TOTAL_TRIALS,
    };

    let session = {
      current: 0,
      total: NUM_SESSIONS,
    };

    let lastClickResult = {
      success: false,
      time: 0,
      point: 0,
    };

    let start;

    let target_radius, target_x, target_y, target_gen_error;
    let target_reward;
    let currentDesign = null;
    let p1 = 0;

    const balls = new Balls();
    balls.init({
      groupCount: 3,
      stepSize: 1,
      startStep: 4,
      totalCount: TOTAL_TRIALS,
      num_sessions: NUM_SESSIONS,
      monitorBound: monitorBound.width / ppi,
    });
    balls.generateRandomDesigns();

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
    currentDesign = balls.popStack();
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });

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
        screen_height: monitorBound.height - Math.max(monitorBound.top, 70),
        top: Math.max(monitorBound.top, 70),
        left: monitorBound.left,
      });

      target_x = target_location.x;
      target_y = target_location.y;
      target_gen_error = target_location.gen;
    };

    if (!isUploading && weight) {
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

      const mouseDown = (e) => {
        if (e.buttons === 1) {
          const p = performance.now();
          if (!isPaused) {
            if (p - delay > SHOW_REWARD_TIME + SHOW_RESULT_TIME) {
              responseTime = p - loggingStartTime;
              buttons = e.buttons;

              show_reward_counter = p;
              delay = p;
              movement_stop_time = p;
              skipCnt = 0;

              const distance = distanceBetweenTwoPoint(
                x,
                y,
                target_x,
                target_y
              );
              const current_target_success =
                target_radius - distance > 0 ? 1 : 0;
              let inaccurate = 0;

              if (
                false &&
                inch(ppi, balls.max_target_radius) * 5 - distance < 0
              ) {
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
                let reward = temporal_discounting_reward(
                  target_reward,
                  responseTime
                );
                repeatAnimation(
                  ctx,
                  x,
                  y,
                  window.innerWidth / 6,
                  50,
                  15,

                  300,
                  30,
                  target_reward,
                  cent
                );

                reward = Math.min(target_reward, reward);
                reward = Math.max(reward, 0);
                reward = financial(reward);

                current_reward = reward;
                summary.point += reward;
                lastClickResult.success = true;
                lastClickResult.point = reward;
                pushSummaryLog(current_target_success, 0, inaccurate);
                summary.success++;
              } else {
                let reward = temporal_discounting_reward(
                  target_reward,
                  responseTime
                );
                reward = Math.min(target_reward, reward);
                reward = Math.max(reward, 0);
                reward = financial(reward);

                current_reward = reward;
                summary.point -= reward;

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
        }
      };

      function updatePosition(e) {
        const p = performance.now();

        if (
          !responseTime &&
          loggingStartTime &&
          show_reward_counter + SHOW_REWARD_TIME + SHOW_RESULT_TIME < p
        ) {
          responseTime = (p - loggingStartTime) / 1000;
        }

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
          Math.max(monitorBound.top, 70),
          Math.min(y, window.screen.height - monitorBound.top)
        );
      }
      const container = document.getElementById("container");
      initMultipleCanvas(canvas, container);
      myReq = requestAnimationFrame(pre_step);
    }

    function step(timestamp) {
      if (!end) {
        if (isPaused) {
          myReq = requestAnimationFrame(afk_step);
        } else {
          // console.log("STEP");
          update(timestamp);

          myReq = requestAnimationFrame(step);
        }
      }
    }

    function pre_step() {
      resetCanvas(ctx, monitorBound);
      if (start) {
        targetInit(currentDesign.d, currentDesign.w);
        show_reward_counter = performance.now();
        timer.start();
        cancelAnimationFrame(myReq);
        requestAnimationFrame(step);
      } else {
        drawText(ctx, summary, TOTAL_TRIALS, session, target_reward);
        drawStartButton2(ctx);
        myReq = requestAnimationFrame(pre_step);
      }
    }

    function afk_step(timestamp) {
      // console.log("AFK_STEP");
      resetCanvas(ctx, monitorBound);
      drawText(ctx, summary, TOTAL_TRIALS, session, target_reward);
      drawPauseText(ctx);
      myReq = requestAnimationFrame(afk_step);
    }

    function handlePause(e) {
      if (isPaused && (e.key === "s" || e.key === "S")) {
        cancelAnimationFrame(myReq);
        isPaused = false;
        // isSessionEnded = false;
        skipCnt = 0;
        movement_stop_time = performance.now();
        show_reward_counter = performance.now();
        myReq = requestAnimationFrame(step);
      }
    }

    function update(timestamp) {
      resetCanvas(ctx, monitorBound);
      drawText(ctx, summary, TOTAL_TRIALS, session, target_reward);
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
        //얻은 금액 표시 부분
        drawClickResultText(
          ctx,
          lastClickResult.success,
          current_reward,
          // lastClickResult.point,
          x,
          y,
          monitorBound
        );

        drawPointer(ctx, x, y);
      } else if (
        show_reward_counter + SHOW_REWARD_TIME + SHOW_RESULT_TIME > timestamp ||
        !timestamp
      ) {
        if (typeof current_reward === "number") {
          drawClickResultText(
            ctx,
            lastClickResult.success,
            current_reward,
            // lastClickResult.point,
            x,
            y,
            monitorBound
          );
        }

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
        drawPointer(ctx, x, y);
        // drawMTPTarget(ctx, target_x, target_y, 0, target_radius, target_reward);
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
        //   window.innerWidth / 2,
        //   window.innerHeight / 2,
        //   inch(ppi, currentDesign.d)
        // );
        drawMTPTarget(ctx, target_x, target_y, 0, target_radius, target_reward);
        drawPointer(ctx, x, y);
      }

      movementX = 0;
      movementY = 0;
    }

    document.addEventListener("keypress", handlePause);

    return () => {
      document.removeEventListener("keypress", handlePause);
    };
  }, [isUploading, weight]);

  return (
    <>
      <div
        id="container"
        style={{
          display: !isUploading ? "block" : "none",
        }}
      >
        <div
          style={{
            position: "fixed",
            top: 20,
            left: 0,
            width: monitorBound.width,
            height: 50,
            fontSize: FONT_SIZE - 20,
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            marginLeft: monitorBound.left,
            // paddingRight: monitorBound.left,
          }}
          id="text_canvas"
        >
          <div style={{ width: "33%" }}></div>
          <div style={{ width: "33%" }}>
            Time:{" "}
            {!!timer.isRunning()
              ? millisToMinutesAndSeconds(remainTime)
              : millisToMinutesAndSeconds(TOTAL_TIME)}
            <div style={{ width: "100%", height: 15, background: "grey" }}>
              <div
                style={{
                  width: `${getTimePercent(remainTime, TOTAL_TIME)}%`,
                  height: 15,
                  background: getTimerColor(remainTime, TOTAL_TIME),
                }}
              ></div>
            </div>
          </div>

          <div style={{ width: "33%" }}>
            <img src={reward_settings} width={350} />
          </div>
        </div>

        <canvas
          id="canvas"
          width={window.innerWidth}
          height={window.innerHeight}
        />
      </div>

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
