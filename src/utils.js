import { BALL_POINTS } from "./components/MTP/Balls";

export const shuffle = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

export const distanceBetweenTwoPoint = (x1, y1, x2, y2) => {
  const dist_x = x1 - x2;
  const dist_y = y1 - y2;

  return Math.sqrt(dist_x * dist_x + dist_y * dist_y);
};

export const drawMaxDistance = (ctx, x, y, max_target_radius) => {
  ctx.beginPath();
  ctx.arc(x, y, max_target_radius, 0, degToRad(360), true);
  ctx.fillStyle = "#grey";
  ctx.fill();
};

export const resetCanvas = (ctx, monitorBound) => {
  // ctx.clearRect(0, 0, window.screen.width, window.screen.height);
  ctx.fillStyle = "#1c1c1c";
  ctx.fillRect(0, 0, window.screen.width, window.screen.height);
  ctx.fillStyle = "#000";
  ctx.fillRect(
    monitorBound.left,
    monitorBound.top,
    monitorBound.width,
    monitorBound.height
  );
};

export const drawRewardProgressBar = (ctx, total, current, x, y) => {
  const a = 100;
  const b = a - ((total - current) / 1400) * a;

  ctx.fillStyle = "yellow";
  ctx.fillRect(x - a / 2, y, a, 20);

  ctx.fillStyle = "green";
  ctx.fillRect(x - a / 2, y, b, 20);
};

export const drawPauseText = (ctx) => {
  ctx.font = "30px serif";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "The experiment paused because it looks like you're away right now.",
    window.innerWidth / 2,
    window.innerHeight / 2
  );
  ctx.fillText(
    "Press Enter key to start.",
    window.innerWidth / 2,
    window.innerHeight / 2 + 100
  );
};

export const drawLateClickText = (ctx) => {
  ctx.font = "30px serif";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "The trial took too long time, so trial will be restarted.",
    window.innerWidth / 2,
    window.innerHeight / 2
  );
};

export const drawRoughClickText = (ctx) => {
  ctx.font = "30px serif";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "The click was too inaccurate in this trial, so trial will be restarted.",
    window.innerWidth / 2,
    window.innerHeight / 2
  );
};
export const drawRedBall = (ctx, x, y) => {
  ctx.lineWidth = 3;
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(x - 50, y);
  ctx.lineTo(x + 50, y);
  ctx.moveTo(x, y - 50);
  ctx.lineTo(x, y + 50);

  ctx.stroke();
};
export const drawPointer = (ctx, x, y) => {
  ctx.lineWidth = 3;
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.moveTo(x - 10, y);
  ctx.lineTo(x + 10, y);
  ctx.moveTo(x, y - 10);
  ctx.lineTo(x, y + 10);

  ctx.stroke();
};

export const toggleFullScreen = async (canvas) => {
  canvas.requestFullscreen();
};

export const degToRad = (degrees) => {
  const result = (Math.PI / 180) * degrees;
  return result;
};

export const initCanvas = async (canvas) => {
  window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  // toggleFullScreen(canvas);

  window.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      toggleFullScreen(canvas);
      if (!document.pointerLockElement) {
        await canvas.requestPointerLock();
      }
    }
  });

  // canvas.addEventListener("click", async (e) => {
  // toggleFullScreen(canvas);
  // if (!document.pointerLockElement) {
  //   await canvas.requestPointerLock({
  //     unadjustedMovement: true,
  //   });
  // }
  // });

  // canvas.addEventListener(
  //   "click",
  //   (e) => {
  //     canvas.requestPointerLock({
  //       unadjustedMovement: true,
  //     });
  //   },
  //   false
  // );
};

export const drawMTPTarget = (ctx, x, y, speed, radius) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, degToRad(360), true);
  ctx.fillStyle = "#00BFFF";
  ctx.fill();
};

export const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};

export const getRandomValueInArray = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const random_point_between_circles = ({
  center,
  inner_radius,
  outer_radius,
  ball_radius,
  screen_width,
  screen_height,
  top,
  left,
}) => {
  for (let i = 0; i < 1000; i++) {
    console.log("create target");
    const theta = getRandomArbitrary(0, 2 * Math.PI);
    const r = getRandomArbitrary(inner_radius, outer_radius);

    const x = center.x + r * Math.cos(theta);
    const y = center.y + r * Math.sin(theta);
    if (
      left + ball_radius <= x &&
      x <= left + screen_width - ball_radius &&
      top + ball_radius <= y &&
      y <= screen_height + top - ball_radius
    ) {
      return { x: x, y: y, gen: 1 };
    }
  }

  return { x: window.screen.width / 2, y: window.screen.height / 2, gen: 0 };
};

export const drawClickResultText = (
  ctx,
  success,
  time,
  reward,
  x,
  y,
  monitorBound
) => {
  // const successText = success ? "Success" : "failed";
  const successText = success ? "✅ Success!" : "❌ Failed...";
  const successColor = success ? "green" : "red";

  let textY = 0;
  let textX = 0;

  if (monitorBound.top + 200 > y) {
    textY = -200;
  }
  if (monitorBound.left + 100 > x) {
    textX = -200;
  }
  if (monitorBound.left + monitorBound.width - 100 < x) {
    textX = 200;
  }

  const adjX = x - textX;
  const adY = y - textY;

  ctx.font = "30px serif";
  // ctx.fillStyle = successColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    `${successText}`,
    adjX,
    adY - 50
    // window.innerWidth / 2,
    // window.innerHeight / 2
  );
  ctx.fillStyle = "#fff";

  // ctx.fillText(
  //   `It took ${time} seconds.`,
  //   adjX,
  //   adY - 50
  // );

  // ctx.fillText(
  //   `You got ${reward / 10} pence.`,
  //   adjX,
  //   adY - 50
  // );
};

export const drawTest = (ctx, x, y, monitorBound) => {
  ctx.font = "30px serif";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let textY = 150;
  let textX = 0;

  if (monitorBound.top + textY > y) {
    textY = -20;
  }
  if (monitorBound.left + 100 > x) {
    textX = -100;
  }
  ctx.fillText(`Test`, x - textX, y - textY);
};

export const drawRewardText = (
  ctx,
  moneybag,
  target_reward,
  x,
  y,
  monitorBound,
  progress_total,
  progress_current
) => {
  let textY = 0;
  let textX = 0;

  if (monitorBound.top + 200 > y) {
    textY = -200;
  }
  if (monitorBound.top + monitorBound.height - 250 < y) {
    textY = 250;
  }
  if (monitorBound.left + 150 > x) {
    textX = -200;
  }
  if (monitorBound.left + monitorBound.width - 150 < x) {
    textX = 200;
  }

  const adjX = x - textX;
  const adY = y - textY;

  drawRewardProgressBar(ctx, progress_total, progress_current, adjX, adY - 80);

  ctx.font = "30px serif";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const width = 420;
  const height = 270;

  if (target_reward === BALL_POINTS[2]) {
    ctx.drawImage(moneybag, adjX - width / 2, adY, width, 260);
  } else if (target_reward === BALL_POINTS[1]) {
    ctx.drawImage(moneybag, adjX - width / 2, adY, width, 210);
  } else {
    const w = width * 0.8;
    ctx.drawImage(moneybag, adjX - w / 2, adY, w, 230 * 0.8);
  }
};

export const drawStartButton = (ctx) => {
  ctx.font = "30px serif";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "Before starting the main study, you will conduct a calibration study.",
    window.innerWidth / 2,
    window.innerHeight / 2 - 50
  );
  ctx.fillText(
    "In this study, we would like to measure the level of your mouse control skills.",
    window.innerWidth / 2,
    window.innerHeight / 2
  );
  ctx.fillText(
    "Mouse sensitivity will be adjusted for the experiment.",
    window.innerWidth / 2,
    window.innerHeight / 2 + 50
  );

  ctx.fillText(
    "If the fullscreen mode is exited during study, press Enter key.",
    window.innerWidth / 2,
    window.innerHeight / 2 + 100
  );

  ctx.fillText(
    "Press Enter key to start.",
    window.innerWidth / 2,
    window.innerHeight / 2 + 250
  );
  ctx.font = "bold 35px serif";
  ctx.fillStyle = "#ff0000";
  ctx.fillText(
    "Click on the blue circular target as quickly and accurately as possible.",
    window.innerWidth / 2,
    window.innerHeight / 2 + 150
  );
};

export const drawStartButton2 = (ctx) => {
  ctx.font = "30px  serif";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "Press Enter key to start.",
    window.innerWidth / 2,
    window.innerHeight / 2
  );
};
export const drawFullscreenAlertText = (ctx) => {
  ctx.font = "30px  serif";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "Press Enter twice!",
    window.innerWidth / 2,
    window.innerHeight / 2
  );
};

export const drawText = (ctx, summary, remain) => {
  ctx.font = "30px sans-serif";
  ctx.fillStyle = "#fff";
  const boardInterval = window.innerWidth / 6;
  ctx.fillText(
    `Trials: ${summary.fail + summary.success} / ${remain}`,
    boardInterval,
    50
  );

  // ctx.fillStyle = "#14e1df";
  // ctx.fillStyle = "#da2c4d";
  // ctx.fillRect(boardInterval * 2, 25, 50, 50);
  // ctx.fillStyle = "#fff";
  ctx.fillText(`✅: ${summary.success}`, boardInterval * 3, 50);
  ctx.fillText(
    `Total Bonus: ${(summary.point / 10000).toFixed(2)}$`,
    boardInterval * 2,
    50
  );
  ctx.fillText(`❌: ${summary.fail}`, boardInterval * 4, 50);

  // ctx.fillText(
  //   `Trials: ${summary.fail + summary.success}`,
  //   window.innerWidth - 200,
  //   50
  // );
  // ctx.fillText(`✅: ${summary.success}`, window.innerWidth - 200, 100);
  // ctx.fillText(`❌: ${summary.fail}`, window.innerWidth - 200, 150);
  // ctx.fillText(
  //   `you earn ${summary.point / 1000}£`,
  //   window.innerWidth - 200,
  //   200
  // );
  // ctx.fillText(`Total: ${remain}`, window.innerWidth - 200, 250);
};

export const inch = (ppi, inch) => {
  return Math.round(ppi * inch);
};

export const fittsLaw = (w, d) => {
  return Math.log2(1 + d / w);
};

export const getWidthByIDAndDistance = (id, d) => {
  return d / (2 ** id - 1);
};

export const getDistanceByWidthAndId = (id, w) => {
  return w * (2 ** id - 1);
};

export const findLargest16by9Rectangle = (x, y) => {
  // 가로 기준 16:9 비율 사각형
  let widthBasedHeight = x * (9 / 16);
  let widthBasedRectangle = {
    width: x,
    height: widthBasedHeight,
    top: (y - widthBasedHeight) / 2,
    left: 0,
  };

  // 세로 기준 16:9 비율 사각형
  let heightBasedWidth = y * (16 / 9);
  let heightBasedRectangle = {
    width: heightBasedWidth,
    height: y,
    top: 0,
    left: (x - heightBasedWidth) / 2,
  };

  // 두 사각형 중 더 작은 것을 반환
  if (widthBasedHeight <= y) {
    return widthBasedRectangle; // 가로 제한이 세로 제한보다 작거나 같은 경우
  } else {
    return heightBasedRectangle; // 세로 제한이 더 작은 경우
  }
};

export const fastRound3 = (x) => ((x * 1000 + 0.5) << 0) / 1000;
