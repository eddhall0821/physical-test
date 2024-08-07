import { useEffect } from "react";
import {
  distanceBetweenTwoPoint,
  drawFullscreenAlertText,
  drawPointer,
  drawStartButton,
  fastRound3,
  fittsLaw,
  inch,
  initCanvas,
  resetCanvas,
  shuffle,
} from "../../utils";
import { useRecoilValue } from "recoil";
import {
  mointorBoundState,
  pointerWeightState,
  ppiState,
  prolificUserState,
} from "../../recoil/atom";
import { useNavigate } from "react-router-dom";
import usePreventRefresh from "../PreventRefresh";

let cnt = 0;
let summary = {
  success: 0,
  fail: 0,
};

let target_zone_radius = 0;
let target_radius = 0;

const RADIUS = 10;
const NUM_POINTS = 14;
const SHOW_MISS_TIME = 100; //ms

const centerX = window.screen.width / 2;
const centerY = window.screen.height / 2;

function degToRad(degrees) {
  return (Math.PI / 180) * degrees;
}

let p1 = 0;
let p2 = 0;
let trial = 0;

const reaction_time_arr = [];
const PointingTest = () => {
  const navigate = useNavigate();
  const weight = useRecoilValue(pointerWeightState);
  // const weight = 1;
  const monitorBound = useRecoilValue(mointorBoundState);
  const ppi = useRecoilValue(ppiState);
  const prolificUser = useRecoilValue(prolificUserState);
  const preventRefresh = usePreventRefresh();

  const combination = shuffle([
    {
      //난이도 2
      targetZoneRadius: inch(ppi, 0.9),
      targetRadius: inch(ppi, 0.3),
    },
    {
      //난이도 3
      targetZoneRadius: inch(ppi, 1.4),
      targetRadius: inch(ppi, 0.2),
    },
    {
      //난이도 4.5
      targetZoneRadius: inch(ppi, 2.162),
      targetRadius: inch(ppi, 0.1),
    },
    {
      targetZoneRadius: inch(ppi, 6.266),
      targetRadius: inch(ppi, 0.07),
    },
  ]);

  useEffect(() => {
    console.log(weight);
  }, [weight]);

  useEffect(() => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });
    ctx.scale(1, 1);
    let x = centerX;
    let y = centerY;

    let isMouseDown = false;
    let target_x = 0;
    let target_y = 0;
    let miss_target_x = 0;
    let miss_target_y = 0;
    let miss_radius = 0;
    let show_miss = 0;

    let start_time = performance.now();
    let end_time = performance.now();
    let start;

    let isFullscreen = false;
    let isPointerLock = false;

    document.addEventListener("pointerlockchange", lockChangeAlert, false);
    function lockChangeAlert() {
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
    }
    const mouseDown = (e) => {
      if (e.buttons === 1) {
        cnt++;
        const distance = distanceBetweenTwoPoint(x, y, target_x, target_y);
        if (distance > target_radius) {
          show_miss = performance.now();
          miss_target_x = target_x;
          miss_target_y = target_y;
          miss_radius = target_radius;
        }
        end_time = performance.now();
        const reaction_time = end_time - start_time;
        reaction_time_arr.push({
          target_zone_radius,
          target_radius,
          reaction_time,
        });
        start_time = performance.now();
        if (cnt >= NUM_POINTS && trial + 1 === combination.length) {
          const result = calculateAverages(reaction_time_arr);
          navigate(
            `/linear?PROLIFIC_PID=${prolificUser.PROLIFIC_PID}&STUDY_ID=${prolificUser.STUDY_ID}&SESSION_ID=${prolificUser.SESSION_ID}`,
            { state: { result } }
          );
        }
        if (cnt >= NUM_POINTS) {
          //다음 trial 이동
          cnt = 0;
          trial++;
          setTarget();
        }
      }
    };

    const calculateAverages = (data) => {
      // target_zone_radius,
      // target_radius,
      // reaction_time,
      const groupSize = 14;
      const arr = [];

      for (let i = 0; i < data.length; i += groupSize) {
        const group = data.slice(i, i + groupSize);

        if (group.length === groupSize) {
          const sum = group
            .slice(4)
            .reduce((acc, item) => acc + item.reaction_time, 0);
          const average = sum / 10;
          arr.push({
            average,
            difficulty: fittsLaw(
              group[0].target_radius,
              group[0].target_zone_radius
            ),
          });
        }
      }

      return arr;
    };

    const setTarget = () => {
      target_zone_radius = combination[trial].targetZoneRadius / 2;
      target_radius = combination[trial].targetRadius / 2;
    };

    const generateTarget = () => {
      const numPoints = NUM_POINTS;

      const angleBetweenPoints = (2 * Math.PI) / numPoints;
      let red = 0;

      //grey ball
      for (let i = 0; i < numPoints; i++) {
        const angle = i * angleBetweenPoints;
        const x = centerX + target_zone_radius * Math.cos(angle);
        const y = centerY + target_zone_radius * Math.sin(angle);
        // drawTarget(x, y, target_radius, "#454545");
      }

      //blue ball
      const sequence = generateSequence(cnt, NUM_POINTS);
      const t_angle = sequence * angleBetweenPoints;
      const t_x = centerX + target_zone_radius * Math.cos(t_angle);
      const t_y = centerY + target_zone_radius * Math.sin(t_angle);

      target_x = t_x;
      target_y = t_y;
      drawTarget(t_x, t_y, target_radius, "#00BFFF");

      //miss ball
      if (show_miss + SHOW_MISS_TIME > performance.now()) {
        drawTarget(miss_target_x, miss_target_y, miss_radius, "red");
      }
    };

    const drawFullscreenText = () => {
      if (window.innerHeight !== window.screen.height || !isPointerLock) {
        isFullscreen = false;
        drawFullscreenAlertText(ctx);
      } else {
        isFullscreen = true;
      }
    };

    const drawTarget = (x, y, target_radius, color) => {
      ctx.beginPath();
      ctx.arc(x, y, target_radius, 0, degToRad(360), true);
      ctx.fillStyle = color;
      ctx.fill();
    };

    const generateSequence = (n, max) => {
      if (n % 2 === 0) {
        return Math.floor(n / 2);
      } else {
        return Math.floor(max / 2 + n / 2);
      }
    };
    let animation;

    function updatePosition(e) {
      const p = performance.now();
      p1 = p;
      x += e.movementX * weight;
      y += e.movementY * weight;
      x = Math.max(
        monitorBound.left,
        Math.min(x, window.screen.width - monitorBound.left)
      );
      y = Math.max(
        monitorBound.top,
        Math.min(y, window.screen.height - monitorBound.top)
      );
      // requestAnimationFrame(step);
      p2 = p;

      if (!animation) {
        animation = requestAnimationFrame(function () {
          animation = null;
          resetCanvas(ctx, monitorBound);
          generateTarget();
          drawPointer(ctx, x, y);
          drawFullscreenText();
        });
      }
    }

    setTarget();

    function step() {}

    function pre_step() {
      resetCanvas(ctx, monitorBound);
      if (start) {
        step();
      } else {
        drawStartButton(ctx);
        requestAnimationFrame(pre_step);
      }
    }

    initCanvas(canvas);
    requestAnimationFrame(pre_step);
  }, [weight]);

  return (
    <div id="div">
      <canvas
        id="canvas"
        width={window.screen.width}
        height={window.screen.height}
      />
    </div>
  );
};

export default PointingTest;
