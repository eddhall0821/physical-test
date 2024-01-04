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

export const drawClickResultText = (ctx, success, time, reward) => {
  const successText = success ? "Success" : "failed";
  const successColor = success ? "green" : "red";

  ctx.font = "30px serif";
  ctx.fillStyle = successColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    `click ${successText}!`,
    window.innerWidth / 2,
    window.innerHeight / 2
  );
  ctx.fillStyle = "#fff";

  ctx.fillText(
    `It took ${time} seconds.`,
    window.innerWidth / 2,
    window.innerHeight / 2 + 50
  );
  ctx.fillText(
    `You got ${reward} points`,
    window.innerWidth / 2,
    window.innerHeight / 2 + 100
  );
};
export const drawRewardText = (ctx, moneybag, target_reward) => {
  ctx.font = "30px serif";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(
    `maximum reward: ${target_reward} P!`,
    window.innerWidth / 2,
    window.innerHeight / 2
  );

  if (target_reward > 40) {
    ctx.drawImage(
      moneybag,
      window.innerWidth / 2 - 100,
      window.innerHeight / 2 + 20,
      100,
      100
    );
    ctx.drawImage(
      moneybag,
      window.innerWidth / 2,
      window.innerHeight / 2 + 20,
      100,
      100
    );
    ctx.drawImage(
      moneybag,
      window.innerWidth / 2 - 50,
      window.innerHeight / 2 + 20,
      100,
      100
    );
  } else if (target_reward > 5) {
    ctx.drawImage(
      moneybag,
      window.innerWidth / 2 - 50,
      window.innerHeight / 2 + 20,
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
    "Before the main experiment, let's start with a simple inspection.",
    window.innerWidth / 2,
    window.innerHeight / 2 - 50
  );

  ctx.fillText(
    "You may not be familiar with mouse sensitivity, ",
    window.innerWidth / 2,
    window.innerHeight / 2
  );
  ctx.fillText(
    "because the mouse sensitivity has been adjusted based on the mouse sensitivity you just measured.",
    window.innerWidth / 2,
    window.innerHeight / 2 + 50
  );

  ctx.fillText(
    "Click on the blue ball that appears on the screen as quickly and accurately as possible.",
    window.innerWidth / 2,
    window.innerHeight / 2 + 100
  );
  ctx.fillText(
    "If the ball does not appear on the screen, click anywhere.",
    window.innerWidth / 2,
    window.innerHeight / 2 + 150
  );

  ctx.fillText(
    "If it does not automatically go to full screen, or if full screen is released during operation, press the enter key.",
    window.innerWidth / 2,
    window.innerHeight / 2 + 200
  );

  ctx.fillText(
    "When you're ready, click to start.",
    window.innerWidth / 2,
    window.innerHeight / 2 + 250
  );
};

export const drawStartButton2 = (ctx) => {
  ctx.font = "30px serif";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "From now on, for each trial, the screen will display the amount of rewards you can earn.",
    window.innerWidth / 2,
    window.innerHeight / 2
  );
  ctx.fillText(
    "Click on the blue ball in the game to receive a reward. ",
    window.innerWidth / 2,
    window.innerHeight / 2 + 50
  );

  ctx.fillText(
    "After every attempt, you will receive a bonus based on the total reward amount.",
    window.innerWidth / 2,
    window.innerHeight / 2 + 100
  );

  ctx.fillText(
    "Rewards are given in points, with xx points equivalent to $xx.",
    window.innerWidth / 2,
    window.innerHeight / 2 + 150
  );
  ctx.fillText(
    "When you're ready, click to start.",
    window.innerWidth / 2,
    window.innerHeight / 2 + 200
  );
};

export const drawText = (ctx, summary, remain) => {
  ctx.font = "30px serif";
  ctx.fillStyle = "#fff";
  ctx.fillText(
    `cnt: ${summary.fail + summary.success}`,
    window.innerWidth - 200,
    50
  );
  ctx.fillText(`success: ${summary.success}`, window.innerWidth - 200, 100);
  ctx.fillText(`fail: ${summary.fail}`, window.innerWidth - 200, 150);
  ctx.fillText(`point: ${summary.point}`, window.innerWidth - 200, 200);
  ctx.fillText(`total: ${remain}`, window.innerWidth - 200, 250);
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
