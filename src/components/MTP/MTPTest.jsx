import { useEffect } from "react";
import {
  distanceBetweenTwoPoint,
  drawMTPTarget,
  drawPointer,
  drawStartButton,
  drawText,
  initCanvas,
  random_point_between_circles,
  resetCanvas,
} from "../../utils";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import {
  mointorBoundState,
  pointerWeightState,
  ppiState,
  skillTestState,
} from "../../recoil/atom";
import usePreventRefresh from "../PreventRefresh";

export const INCH_24_WIDTH = 20.92;
export const INCH_24_HEIGHT = 11.77;

const MTPTest = () => {
  const weight = useRecoilValue(pointerWeightState);
  const ppi = useRecoilValue(ppiState);
  const skillTest = useRecoilValue(skillTestState);
  const { ball_distance } = skillTest;
  const monitorBound = useRecoilValue(mointorBoundState);
  const navigate = useNavigate();
  const preventRefresh = usePreventRefresh();

  // const monitor_check_target_array = [
  //   {
  //     target_x: monitorBound.left + 0.2 * ppi,
  //     target_y: monitorBound.top + 0.2 * ppi,
  //   },
  //   {
  //     target_x: monitorBound.left + monitorBound.width - 0.2 * ppi,
  //     target_y: monitorBound.top + 0.2 * ppi,
  //   },
  //   {
  //     target_x: monitorBound.left + 0.2 * ppi,
  //     target_y: monitorBound.top + monitorBound.height - 0.2 * ppi,
  //   },
  //   {
  //     target_x: monitorBound.left + monitorBound.width - 0.2 * ppi,
  //     target_y: monitorBound.top + monitorBound.height - 0.2 * ppi,
  //   },
  //   {
  //     target_x: window.screen.width / 2,
  //     target_y: window.screen.height / 2,
  //   },
  // ];

  useEffect(() => {
    let ball_cnt = 0;
    let lower_bound, upper_bound;
    let target_radius, target_x, target_y;

    let x = window.screen.width / 2;
    let y = window.screen.height / 2;
    let delay = 0;
    let summary = {
      fail: 0,
      success: 0,
      point: 0,
    };

    let start;
    let end = false;
    let p1 = 0;
    let p2 = 0;
    let timeDiffArr = [];

    const targetInit = () => {
      target_radius = skillTest.target_radius * ppi;
      lower_bound = ball_distance[ball_cnt] * ppi;
      upper_bound = ball_distance[ball_cnt] * ppi;
      console.log(ball_distance[ball_cnt]);

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

    function updatePosition(e) {
      const p = performance.now();
      p1 = p;
      p2 = p;

      x += e.movementX * weight * 10;
      y += e.movementY * weight * 10;

      if (window.innerHeight == window.screen.height) {
        console.log("full");
      } else {
        console.log("no full");
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
      //마우스 가두기 끝

      if (e.buttons === 1 && p - delay > 300) {
        const distance = distanceBetweenTwoPoint(x, y, target_x, target_y);

        timeDiffArr.push(p - delay);
        if (target_radius - distance > 0) {
          summary.success++;
        } else {
          summary.fail++;
        }
        ball_cnt++;
        targetInit();
        delay = p;
      }

      if (summary.success + summary.fail === ball_distance.length && !end) {
        end = true;
        navigate("/linear", { state: { timeDiffArr } });
        // uploadCSV();
      }
    }

    //step function execute every frame
    function step(timestamp) {
      if (!end) {
        resetCanvas(canvas, monitorBound);
        drawText(ctx, summary);

        drawMTPTarget(ctx, target_x, target_y, 0, target_radius);
        drawPointer(ctx, x, y);

        requestAnimationFrame(step);
      }
    }

    function pre_step() {
      resetCanvas(canvas, monitorBound);
      if (start) {
        targetInit();
        delay = performance.now();
        step();
      } else {
        drawStartButton(ctx);
        requestAnimationFrame(pre_step);
      }
    }
    //init
    initCanvas(canvas);
    requestAnimationFrame(pre_step);
  }, []);

  return (
    <>
      <canvas
        id="canvas"
        width={window.screen.width}
        height={window.screen.height}
      />
    </>
  );
};

export default MTPTest;
