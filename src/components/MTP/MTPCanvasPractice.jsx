import { useCallback, useEffect } from "react";
import {
  calculatePoint,
  distanceBetweenTwoPoint,
  drawClickResultText,
  drawFullscreenAlertText,
  drawGuideText,
  drawLateClickText,
  drawMTPTarget,
  drawPauseText,
  drawPointer,
  drawPracticeStartButton,
  drawRewardText,
  drawRoughClickText,
  drawText,
  financial,
  FONT_SIZE,
  getTimePercent,
  getTimerColor,
  inch,
  initMultipleCanvas,
  millisToMinutesAndSeconds,
  random_point_between_circles,
  repeatAnimation,
  resetCanvas,
} from "../../utils";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import reward_settings from "../../images/reward_setting.png";
import Reward0 from "../../images/max_reward/reward_0.png";
import Reward4 from "../../images/max_reward/reward_4.png";
import Reward20 from "../../images/max_reward/reward_20.png";

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
import {
  SHOW_REWARD_TIME,
  SHOW_RESULT_TIME,
  SHOW_ROUGH_TIME,
  SHOW_LATE_TIME,
} from "./MTPCanvas";
import { useTimer } from "react-use-precision-timer";
import { Subs } from "react-sub-unsub";
import Cent from "../../images/cent.png";
import Trash from "../../images/trashcan.png";

export const INCH_24_WIDTH = 20.92;
export const INCH_24_HEIGHT = 11.77;
const TOTAL_TIME = 1.5 * 60 * 1000;

const TOTAL_TRIALS = 1200;

const STOP_TIME = 3000;
const MAXIMUM_ERROR_STREAK = 3;
let myReq;

const NUM_SESSIONS = 0;
const NUM_SUB_SESSIONS_PER_SESSIONS = 2;

const MTPCanvasPractice = () => {
  const callback = useCallback(() => {
    cancelAnimationFrame(myReq);
    navigate(
      `/pnc?PROLIFIC_PID=${prolificUser.PROLIFIC_PID}&STUDY_ID=${prolificUser.STUDY_ID}&SESSION_ID=${prolificUser.SESSION_ID}`
    );
    // setIsUploading(true);
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
  useEffect(() => {
    let isPaused = false;

    let movement_stop_time = 0;
    let show_reward_counter = performance.now();
    let show_rough_counter = -SHOW_ROUGH_TIME;
    let show_late_counter = -SHOW_LATE_TIME;

    let responseTime = null;
    let loggingStartTime = null;
    let current_reward = null;
    let guide_text_x;
    let guide_text_y;

    let end = false;
    let skipCnt = 0;
    let reward0 = new Image({});
    let reward4 = new Image({});
    let reward20 = new Image({});
    let cent = new Image({});
    let trash = new Image({});

    reward0.src = Reward0;
    reward4.src = Reward4;
    reward20.src = Reward20;
    cent.src = Cent;
    trash.src = Trash;

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
      shuffle: false,
      monitorBound: monitorBound.width / ppi,
    });
    balls.generateRandomDesigns();

    const drawFullscreenText = () => {
      if (window.innerHeight !== window.screen.height || !isPointerLock) {
        isFullscreen = false;
        drawFullscreenAlertText(ctx);
      } else {
        isFullscreen = true;
      }
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
        screen_height: monitorBound.height,
        top: monitorBound.top,
        left: monitorBound.left,
      });

      target_x = target_location.x;
      target_y = target_location.y;

      const guide_coord = calculatePoint(
        target_x,
        target_y,
        x,
        y,
        50 + target_radius
      );
      guide_text_x = guide_coord.x;
      guide_text_y = guide_coord.y;

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

      //test---
      // let mouse_cnt = 0;
      // let cnt = 0;
      // let tt = performance.now();
      //test---

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
                targetInit(currentDesign.d, currentDesign.w);

                return;
                // if (roughClickCnt > MAXIMUM_ERROR_STREAK) {
                //   show_rough_counter = p;
                //   roughClickCnt = 0;
                // }
              } else if (target_radius - distance > 0) {
                let reward = target_reward;

                repeatAnimation({
                  ctx: ctx,
                  x1: x,
                  y1: y,
                  x2: window.innerWidth / 6,
                  y2: 50,
                  r: 50,
                  duration: 300,
                  interval: 30,
                  repeatCount: target_reward,
                  image: cent,
                });

                reward = Math.min(target_reward, reward);
                reward = Math.max(reward, 0);
                reward = financial(reward);

                current_reward = reward;
                summary.point += reward;
                lastClickResult.success = true;
                lastClickResult.point = reward;
                summary.success++;
              } else {
                //실패
                let reward = target_reward;

                repeatAnimation({
                  ctx: ctx,
                  x1: window.innerWidth / 6,
                  y1: 60,
                  x2: 200 + 75,
                  y2: 120,
                  r: 50,
                  duration: 300,
                  interval: 30,
                  repeatCount: target_reward,
                  image: cent,
                });

                repeatAnimation({
                  ctx: ctx,
                  x1: 200,
                  y1: 120,
                  x2: 200,
                  y2: 120,
                  duration: 800,
                  interval: 30,
                  repeatCount: target_reward ? 1 : 0,
                  image: trash,
                  width: 150,
                  height: 200,
                });

                reward = Math.min(target_reward, reward);
                reward = Math.max(reward, 0);
                reward = financial(reward);

                current_reward = reward;
                summary.point -= reward;

                lastClickResult.success = false;
                lastClickResult.point = 0;
                summary.fail++;
              }

              if (balls.getRandomDesignArray().length === 0 && !end) {
                end = true;
                navigate(
                  `/pnc?PROLIFIC_PID=${prolificUser.PROLIFIC_PID}&STUDY_ID=${prolificUser.STUDY_ID}&SESSION_ID=${prolificUser.SESSION_ID}`
                );
              } else {
                currentDesign = balls.popStack();
                targetInit(currentDesign.d, currentDesign.w);
              }
            }

            // if (
            //   (summary.fail + summary.success) %
            //     (TOTAL_TRIALS / NUM_SESSIONS) ===
            //   0
            // ) {
            //   isSessionEnded = true;
            //   session.current++;
            //   current_reward = null;
            //   cancelAnimationFrame(myReq);
            //   requestAnimationFrame(session_show_step);
            // }
          }
        }
      };

      function updatePosition(e) {
        const p = performance.now();

        // if (
        //   !responseTime &&
        //   loggingStartTime &&
        //   show_reward_counter + SHOW_REWARD_TIME + SHOW_RESULT_TIME < p
        // ) {
        //   responseTime = (p - loggingStartTime) / 1000;
        // }

        if (show_reward_counter + SHOW_REWARD_TIME + SHOW_RESULT_TIME < p) {
          const dx = e.movementX * weight;
          const dy = e.movementY * weight;
          // const threshold = 100;
          // if (
          //   dx < -threshold ||
          //   dy < -threshold ||
          //   dx > threshold ||
          //   dy > threshold
          // ) {
          //   console.log(dx, dy);
          // } else {
          x += dx;
          y += dy;
          // }
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
        // step();
        cancelAnimationFrame(myReq);
        requestAnimationFrame(step);
      } else {
        drawText(ctx, summary, TOTAL_TRIALS, session, target_reward);
        drawPracticeStartButton(ctx);
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
      } else if (show_late_counter + SHOW_LATE_TIME > timestamp) {
        drawLateClickText(ctx);
      }
      if (
        show_reward_counter + SHOW_REWARD_TIME + SHOW_RESULT_TIME <
        timestamp
      ) {
        if (!loggingStartTime) {
          loggingStartTime = performance.now(); // Set the logging start time
        }

        // drawMaxDistance(
        //   ctx,
        //   target_x,
        //   target_y,
        //   inch(ppi, balls.max_target_radius) * 5
        // );
        drawMTPTarget(ctx, target_x, target_y, 0, target_radius, target_reward);
        drawGuideText(
          ctx,
          guide_text_x,
          guide_text_y,
          monitorBound,
          target_reward,
          target_radius
        );
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
    <div id="container">
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
          Remaining Time:{" "}
          {!!timer.isRunning()
            ? millisToMinutesAndSeconds(remainTime)
            : millisToMinutesAndSeconds(TOTAL_TIME)}
          <div style={{ width: "100%", height: 20, background: "grey" }}>
            <div
              style={{
                width: `${getTimePercent(remainTime, TOTAL_TIME)}%`,
                height: 20,
                background: getTimerColor(remainTime, TOTAL_TIME),
              }}
            ></div>
          </div>
        </div>

        <div style={{ width: "33%" }}>
          <img src={reward_settings} width={400} />
        </div>
      </div>
      <div
        style={{
          width: "100%",
          textAlign: "center",
          position: "absolute",
          fontSize: 40,
          color: "white",
          bottom: 20,
          left: 0,
        }}
      >
        This is practice session.
      </div>
      <>
        <canvas
          id="canvas"
          width={window.innerWidth}
          height={window.innerHeight}
        />
      </>
    </div>
  );
};

export default MTPCanvasPractice;
