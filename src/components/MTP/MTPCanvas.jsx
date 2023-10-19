import { useEffect } from "react";
import {
  distanceBetweenTwoPoint,
  drawMTPTarget,
  drawPointer,
  getRandomArbitrary,
  getRandomValueInArray,
  initCanvas,
  random_point_between_circles,
  resetCanvas,
} from "../../utils";
import Description from "./Description";
import { a } from "./test";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const RADIUS = 10;
const startStamp = performance.now();
const MTPCanvas = () => {
  const logArr = [
    [
      "target_radius",
      "targetX",
      "targetY",
      "movementX",
      "movementY",
      "screenX",
      "screenY",
    ],
  ];

  useEffect(() => {
    let lower_bound = 300;
    let upper_bound = 1000;

    // const lower_bound_prompt = Number(window.prompt("set lower bound.", 300));
    // const upper_bound_prompt = Number(window.prompt("set upper bound.", 1000));

    // if (lower_bound_prompt) lower_bound = lower_bound_prompt;
    // if (upper_bound_prompt) upper_bound = upper_bound_prompt;

    if (lower_bound >= upper_bound) {
      alert("lower bound cannot be greater than upper bound.");
      window.location.reload();
    }

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let delay = 0;
    let summary = {
      fail: 0,
      success: 0,
    };

    let target_radius, target_x, target_y, v_x, v_y;

    const targetInit = () => {
      target_radius = getRandomValueInArray([10, 30, 90]);

      const target_location = random_point_between_circles({
        center: { x, y },
        inner_radius: lower_bound,
        outer_radius: upper_bound,
        ball_radius: target_radius,
        screen_width: window.innerWidth,
        screen_height: window.innerHeight,
      });

      // target_x = getRandomArbitrary(
      //   target_radius,
      //   canvas.width - target_radius
      // );
      // target_y = getRandomArbitrary(
      //   target_radius,
      //   canvas.height - target_radius
      // );
      // v_x = getRandomArbitrary(-1000, 1000);
      // v_y = getRandomArbitrary(-1000, 1000);

      target_x = target_location.x;
      target_y = target_location.y;
    };

    let start;
    let end = false;
    let timeDiff = 0;
    let p1 = 0;
    let p2 = 0;

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    document.addEventListener("pointerlockchange", lockChangeAlert, false);
    function lockChangeAlert() {
      if (document.pointerLockElement === canvas) {
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
      const storageRef = ref(storage, "PNC.csv");

      let csvContent = logArr
        .map((e) => {
          return e.join(",");
        })
        .join("\n");

      var encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
      //download in local pc
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "PNC.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      uploadBytes(storageRef, blob).then((snapshot) => {
        console.log("blob..");
      });
    }

    function updatePosition(e) {
      mouse_cnt++;
      const p = performance.now();
      p1 = p;
      // console.log(p1 - p2);
      p2 = p;

      x += e.movementX;
      y += e.movementY;

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

      if (summary.success + summary.fail === 5 && !end) {
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
      ctx.fillText(`success: ${summary.success}`, window.innerWidth - 200, 100);
      ctx.fillText(`fail: ${summary.fail}`, window.innerWidth - 200, 150);
    };

    //step function execute every frame
    function step(timestamp) {
      // if (performance.now() - startStamp > 30 * 60 * 1000 && !end) {
      //   console.log(logArr);
      //   end = !end;

      //   let csvContent =
      //     "data:text/csv;charset=utf-8," +
      //     logArr
      //       .map((e) => {
      //         return e.join(",");
      //       })
      //       .join("\n");

      //   var encodedUri = encodeURI(csvContent);
      //   window.open(encodedUri);
      // }

      if (tt + 1000 < performance.now()) {
        // console.log("frame rate: " + cnt);
        // console.log("mouse event per second: " + mouse_cnt);
        tt = performance.now();
        cnt = 0;
        mouse_cnt = 0;
      }
      cnt++;

      if (start === undefined) {
        start = timestamp;
      }
      // const elapsed = timestamp - start;
      // timeDiff += elapsed;
      // const dist_x = v_x * (elapsed / 1000);
      // const dist_y = v_y * (elapsed / 1000);
      // target_x += dist_x;
      // target_y += dist_y;
      // if (target_x > canvas.width - target_radius) {
      //   target_x = canvas.width - target_radius;
      //   v_x = -v_x;
      // }
      // if (target_x < target_radius) {
      //   target_x = target_radius;
      //   v_x = -v_x;
      // }
      // if (target_y > canvas.height - target_radius) {
      //   target_y = canvas.height - target_radius;
      //   v_y = -v_y;
      // }
      // if (target_y < target_radius) {
      //   target_y = target_radius;
      //   v_y = -v_y;
      // }
      start = timestamp;

      if (!end) {
        const tempRow = [
          target_radius,
          target_x,
          target_y,
          x,
          y,
          "TESTTESTTESTTEST",
        ];

        logArr.push(tempRow);

        resetCanvas(canvas);
        drawText();
        drawMTPTarget(ctx, target_x, target_y, 0, target_radius);
        drawPointer(ctx, x, y);
        requestAnimationFrame(step);
      }
    }

    targetInit();
    initCanvas(canvas);
    requestAnimationFrame(step);
  }, []);

  return (
    <>
      <Description />
      <canvas
        id="canvas"
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </>
  );
};

export default MTPCanvas;
