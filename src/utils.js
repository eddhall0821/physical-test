export const shuffle = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

export const distanceBetweenTwoPoint = (x1, y1, x2, y2) => {
  const dist_x = x1 - x2;
  const dist_y = y1 - y2;

  return Math.sqrt(dist_x * dist_x + dist_y * dist_y);
};

export const resetCanvas = (canvas, monitorBound) => {
  const ctx = canvas.getContext("2d");
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
    //TODO demo
    // const ctx = canvas.getContext("2d");
    // ctx.setTransform(1, 0, 0, 1, 0, 0);
    // ctx.scale(1 / window.devicePixelRatio, 1 / window.devicePixelRatio);
  };
  toggleFullScreen(canvas);

  window.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      toggleFullScreen(canvas);
    }
  });

  canvas.addEventListener("click", async () => {
    if (!document.pointerLockElement) {
      await canvas.requestPointerLock({
        unadjustedMovement: true,
      });
    }
  });

  canvas.addEventListener(
    "click",
    (e) => {
      canvas.requestPointerLock({
        unadjustedMovement: true,
      });
    },
    false
  );

  canvas.addEventListener("click", async () => {
    if (!document.pointerLockElement) {
      await canvas.requestPointerLock({
        //To disable OS-level mouse acceleration and access raw mouse input, you can set the unadjustedMovement to true:
        unadjustedMovement: true,
      });
    }
  });
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
    console.log("create....");
    const theta = getRandomArbitrary(0, 2 * Math.PI);
    const r = getRandomArbitrary(inner_radius, outer_radius);

    const x = center.x + r * Math.cos(theta);
    const y = center.y + r * Math.sin(theta);
    if (
      left + ball_radius <= x &&
      x <= left + screen_width - ball_radius &&
      top + ball_radius <= y &&
      y <= screen_height + top - ball_radius
      // ball_radius <= x &&
      // x <= screen_width - ball_radius &&
      // ball_radius <= y &&
      // y <= screen_height - ball_radius
    ) {
      return { x: x, y: y };
    }
  }

  console.log("Err");
  return { x: window.screen.width / 2, y: window.screen.height / 2 };
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
  const successText = success ? "✅" : "❌";
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
  ctx.fillStyle = successColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    `${successText}`,
    adjX,
    adY - 150
    // window.innerWidth / 2,
    // window.innerHeight / 2
  );
  ctx.fillStyle = "#fff";

  // ctx.fillText(
  //   `It took ${time} seconds.`,
  //   adjX,
  //   adY - 50
  // );

  ctx.fillText(
    `You got ${reward / 10} pence.`,
    adjX,
    adY - 100
    // window.innerWidth / 2,
    // window.innerHeight / 2 + 100
  );
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
  monitorBound
) => {
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
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(
    `Next reward is ${target_reward / 10} pence.`,
    adjX,
    adY - 50
    // adY - 150
    // window.innerWidth / 2,
    // window.innerHeight / 2
  );

  if (target_reward > 40) {
    ctx.drawImage(
      moneybag,
      adjX - 150,
      adY,
      // adY - 100,
      // window.innerWidth / 2 - 100,
      // window.innerHeight / 2 + 20,
      100,
      100
    );
    ctx.drawImage(
      moneybag,
      adjX - 100,
      adY,
      // adY - 100,
      // window.innerWidth / 2 - 100,
      // window.innerHeight / 2 + 20,
      100,
      100
    );
    ctx.drawImage(
      moneybag,
      adjX + 50,
      adY,
      // adY - 100,
      // window.innerWidth / 2,
      // window.innerHeight / 2 + 20,
      100,
      100
    );
    ctx.drawImage(
      moneybag,
      adjX,
      adY,
      // adY - 100,
      // window.innerWidth / 2,
      // window.innerHeight / 2 + 20,
      100,
      100
    );
    ctx.drawImage(
      moneybag,
      adjX - 50,
      adY,
      // adY - 100,
      // window.innerWidth / 2 - 50,
      // window.innerHeight / 2 + 20,
      100,
      100
    );
  } else if (target_reward > 5) {
    ctx.drawImage(
      moneybag,
      adjX - 50,
      adY,
      // adY - 100,
      // window.innerWidth / 2 - 50,
      // window.innerHeight / 2 + 20,
      100,
      100
    );
  } else {
  }
};

export const drawStartButton = (ctx) => {
  ctx.font = "30px serif";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "Before starting the main task, you will conduct a simple test.",
    window.innerWidth / 2,
    window.innerHeight / 2 - 50
  );
  ctx.fillText(
    "Mouse sensitivity will be adjusted for the experiment.",
    window.innerWidth / 2,
    window.innerHeight / 2
  );
  // ctx.fillText(
  //   "the mouse sensitivity has been adjusted based on the mouse sensitivity you just measured.",
  //   window.innerWidth / 2,
  //   window.innerHeight / 2 + 100
  // );

  // ctx.fillText(
  //   "If the target does not appear on the screen, click anywhere.",
  //   window.innerWidth / 2,
  //   window.innerHeight / 2 + 150
  // );

  ctx.fillText(
    // "If it does not automatically switch to fullscreen mode or if the fullscreen mode is exited during test, press Enter. ",
    "If the fullscreen mode is exited during test, press Enter.",
    window.innerWidth / 2,
    window.innerHeight / 2 + 100
  );

  ctx.fillText(
    "Click anywhere to start.",
    window.innerWidth / 2,
    window.innerHeight / 2 + 250
  );
  ctx.font = "bold 35px serif";
  ctx.fillStyle = "#ff0000";
  ctx.fillText(
    "Click on the blue circular target as quickly and accurately as possible.",
    window.innerWidth / 2,
    window.innerHeight / 2 + 50
  );
};

export const drawStartButton2 = (ctx) => {
  ctx.font = "30px  serif";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "Click anywhere to start.",
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
  ctx.fillText(`Total Bonus: ${summary.point / 1000}£`, boardInterval * 2, 50);
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

export const getWdithByIDAndDistance = (id, d) => {
  return d / (2 ** id - 1);
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
