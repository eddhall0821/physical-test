import { BALL_COLORS, BALL_POINTS } from "./components/MTP/Balls";
import { SHOW_REWARD_TIME } from "./components/MTP/MTPCanvas";

export const GREEN_BALL = "#00ff00";
export const BLUE_BALL = "#00bfff";
export const BROWN_BALL = "#ff7f00";
export const FONT_SIZE = 50;

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

export const drawRewardLevelText = (ctx, x, y) => {
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, degToRad(360), true);
  ctx.fillStyle = GREEN_BALL;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x - 100, y, 10, 0, degToRad(360), true);
  ctx.fillStyle = GREEN_BALL;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + 100, y, 10, 0, degToRad(360), true);
  ctx.fillStyle = GREEN_BALL;
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

// export const drawRewardProgressBar = (ctx, total, current, x, y) => {
//   const a = 100;
//   const b = a - ((total - current) / 1400) * a;

//   ctx.fillStyle = "yellow";
//   ctx.fillRect(x - a / 2, y, a, 20);

//   ctx.fillStyle = "green";
//   ctx.fillRect(x - a / 2, y, b, 20);
// };

export const drawRewardProgressBar = (ctx, total, current, x, y) => {
  const a = 100;
  const b = a - ((total - current) / SHOW_REWARD_TIME) * a;

  if (b > 0) {
    const outerRadius = 30;
    const innerRadius = 20;
    const startAngle = -0.5 * Math.PI;
    const endAngle = startAngle + (b / a) * 2 * Math.PI;

    ctx.beginPath();
    ctx.arc(x, y, outerRadius, 0, 2 * Math.PI);
    ctx.arc(x, y, innerRadius, 2 * Math.PI, 0, true);
    ctx.fillStyle = "black";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, outerRadius, startAngle, endAngle);
    ctx.arc(x, y, innerRadius, endAngle, startAngle, true);
    ctx.fillStyle = "white";
    ctx.fill();
  }
};

export const drawPauseText = (ctx) => {
  ctx.font = `${FONT_SIZE}px serif`;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "The study paused because it looks like you're away right now.",
    window.innerWidth / 2,
    window.innerHeight / 2
  );
  ctx.fillText(
    `Press "S" key to start.`,
    window.innerWidth / 2,
    window.innerHeight / 2 + 100
  );
};

export const drawCurrentRewardText = (ctx, current_reward, trials) => {
  ctx.font = `${FONT_SIZE}px serif`;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (current_reward === 0) {
    ctx.fillText(
      `In this session, there is no bonus.`,
      window.innerWidth / 2,
      window.innerHeight / 2
    );
    ctx.fillText(
      `Regardless of your click performance, total bonus is fixed to 0 cents.`,
      window.innerWidth / 2,
      window.innerHeight / 2 + 50
    );
  } else {
    ctx.fillText(
      `In this session, each target has "${current_reward}" cents.`,
      window.innerWidth / 2,
      window.innerHeight / 2 - 50
    );
    ctx.fillText(
      `Expected session total bonus ranges from ${
        (((current_reward * trials) / 5) * 3.5) / 100
      } ~ ${(((current_reward * trials) / 5) * 4) / 100} dollars.`,
      window.innerWidth / 2,
      window.innerHeight / 2
    );
    ctx.fillText(
      `Successful click with shorter time will give you more bonuses.`,
      window.innerWidth / 2,
      window.innerHeight / 2 + 50
    );
  }

  ctx.fillText(
    `Press "S" key to start.`,
    window.innerWidth / 2,
    window.innerHeight / 2 + 150
  );
};

export const drawLateClickText = (ctx) => {
  ctx.font = `${FONT_SIZE}px serif`;
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
  ctx.font = `${FONT_SIZE}px serif`;
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
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.moveTo(x - 10, y);
  ctx.lineTo(x + 10, y);
  ctx.moveTo(x, y - 10);
  ctx.lineTo(x, y + 10);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.moveTo(x - 10, y);
  ctx.lineTo(x + 10, y);
  ctx.moveTo(x, y - 10);
  ctx.lineTo(x, y + 10);
  ctx.stroke();
};

export const toggleFullScreen = async (element) => {
  element.requestFullscreen();
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
};

export const initMultipleCanvas = async (canvas1, container) => {
  window.onresize = () => {
    canvas1.width = window.innerWidth;
    canvas1.height = window.innerHeight;
  };

  window.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      toggleFullScreen(container);
      if (!document.pointerLockElement) {
        await canvas1.requestPointerLock();
      }
    }
  });
};

export function calculatePoint(x1, y1, x2, y2, distance) {
  const ABx = x1 - x2;
  const ABy = y1 - y2;

  const magnitude = Math.sqrt(ABx * ABx + ABy * ABy);

  const unitX = ABx / magnitude;
  const unitY = ABy / magnitude;

  const scaledX = unitX * distance;
  const scaledY = unitY * distance;

  const x3 = x1 + scaledX;
  const y3 = y1 + scaledY;

  return { x: x3, y: y3 };
}

export const drawGuideText = (
  ctx,
  x,
  y,
  monitorBound,
  reward,
  target_radius
) => {
  ctx.font = `${FONT_SIZE - 10}px san-serif`;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const idx = BALL_POINTS.indexOf(reward);
  ctx.fillStyle = BALL_COLORS[idx];

  ctx.fillText(`${reward}`, x, y);
};

export const drawMTPTarget = (ctx, x, y, speed, radius, reward) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, degToRad(360), true);

  const idx = BALL_POINTS.indexOf(reward);
  ctx.fillStyle = BALL_COLORS[idx];

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
  let radius = ball_radius;
  for (let i = 0; i < 10; i++) {
    for (let i = 0; i < 100; i++) {
      console.log("create target");
      const theta = getRandomArbitrary(0, 2 * Math.PI);
      const r = getRandomArbitrary(inner_radius, outer_radius);

      const x = center.x + r * Math.cos(theta);
      const y = center.y + r * Math.sin(theta);
      if (
        left + radius <= x &&
        x <= left + screen_width - radius &&
        top + radius <= y &&
        y <= screen_height + top - radius
      ) {
        return { x: x, y: y, gen: 1 };
      }
    }
  }

  return { x: window.screen.width / 2, y: window.screen.height / 2, gen: 0 };
};

export function getTimerColor(remainTime, maxTime) {
  const percent = getTimePercent(remainTime, maxTime);

  if (remainTime >= (2 / 3) * maxTime) {
    return "#ffffff";
  } else if (remainTime >= (1 / 3) * maxTime) {
    // return "#ff7b7b";
    return `rgb(255,
    ${255 - (66 - percent) * 4},
    ${255 - (66 - percent) * 4})`;
  } else {
    return `rgb(255,
    ${255 - (66 - percent) * 4},
    ${255 - (66 - percent) * 4})`;
  }
}

export function getTimePercent(remainTime, maxTime) {
  return (remainTime * 100) / maxTime;
}

export function moveCircle(
  ctx,
  x1,
  y1,
  x2,
  y2,
  width,
  height,
  duration,
  image
) {
  const startTime = performance.now();

  function animate(time) {
    const elapsed = time - startTime;

    let progress = Math.min(elapsed / duration, 1);
    progress = progress * progress * progress * progress;

    const currentX = x1 + (x2 - x1) * progress;
    const currentY = y1 + (y2 - y1) * progress;

    // ctx.beginPath();
    // ctx.arc(currentX, currentY, r, 0, 2 * Math.PI);
    // ctx.fillStyle = "red";
    // ctx.fill();

    ctx.drawImage(image, currentX, currentY, width, height);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

export const drawClickResultText = (
  ctx,
  success,
  reward,
  x,
  y,
  monitorBound
) => {
  const successText = success ? "Success!" : "Failed..";
  const successColor = success ? "white" : "white";
  reward = Number(reward);

  if (Math.abs(reward) === BALL_POINTS[0]) {
    ctx.font = `${FONT_SIZE - 5}px san-serif bold`;
  } else if (Math.abs(reward) == BALL_POINTS[1]) {
    ctx.font = `${FONT_SIZE}px san-serif bold`;
  } else if (Math.abs(reward) == BALL_POINTS[2]) {
    ctx.font = `${FONT_SIZE + 5}px san-serif bold`;
  } else {
    ctx.font = `${FONT_SIZE + 10}px san-serif bold`;
  }

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

  ctx.fillStyle = successColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // ctx.fillText(
  //   `It took ${time} seconds.`,
  //   adjX,
  //   adY - 50
  // );
  ctx.fillText(`${success ? "+" : "-"}${reward} ¢`, adjX, adY - 70);
  // ctx.fillStyle = successColor;
  // ctx.fillText(`${successText}`, adjX, adY - 100);
  ctx.fillStyle = "#fff";
  ctx.font = `${FONT_SIZE}px san-serif bold`;
};

export const drawTest = (ctx, x, y, monitorBound) => {
  ctx.font = `${FONT_SIZE}px serif`;
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

  drawRewardProgressBar(ctx, progress_total, progress_current, x, y);

  ctx.font = `${FONT_SIZE}px serif`;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const width = 420;
  const height = 270;
};

export const drawStartButton = (ctx) => {
  ctx.font = `${FONT_SIZE}px serif`;
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

export const drawStartButton2 = (ctx, elapsed_time) => {
  ctx.font = `${FONT_SIZE}px serif`;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "Now, you will begin the main session.",
    window.innerWidth / 2,
    window.innerHeight / 2 - 50
  );

  ctx.fillText(
    `Reminder: Bonus is either ${BALL_POINTS[0]}, ${BALL_POINTS[1]}, ${BALL_POINTS[2]}, or ${BALL_POINTS[3]} cents.`,
    window.innerWidth / 2,
    window.innerHeight / 2 + 50
  );

  ctx.fillStyle = "red";
  ctx.fillText(
    "Build strategy to earn as many bonuses as possible in 30 minutes.",
    window.innerWidth / 2,
    window.innerHeight / 2 + 100
  );
  ctx.fillStyle = "#fff";

  ctx.fillText(
    "Press Enter key to start",
    window.innerWidth / 2,
    window.innerHeight / 2 + 200
  );

  ctx.font = `${FONT_SIZE - 30}px serif`;
  ctx.fillText(
    `Wait ${Math.max(5 - Math.round(elapsed_time / 1000), 0)} seconds...`,
    window.innerWidth / 2,
    window.innerHeight / 2 + 250
  );
};

export function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

export const drawPracticeStartButton = (ctx) => {
  ctx.font = `${FONT_SIZE}px serif`;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "Let's do 90-seconds practice first.",
    window.innerWidth / 2,
    window.innerHeight / 2 - 50
  );
  ctx.fillText(
    "Try to earn as many bonuses as possible in the limited time.",
    window.innerWidth / 2,
    window.innerHeight / 2
  );

  ctx.fillText(
    "Press Enter key to continue.",
    window.innerWidth / 2,
    window.innerHeight / 2 + 100
  );
};

export function getRandomCoordinateNearby(x, y, d) {
  const angle = Math.random() * 2 * Math.PI;

  const distance = Math.random() * d;
  const newX = x + distance * Math.cos(angle);
  const newY = y + distance * Math.sin(angle);

  return { x: newX - d, y: newY - d };
}

export function repeatAnimation({
  ctx,
  x1,
  y1,
  x2,
  y2,
  r,
  duration,
  interval,
  repeatCount,
  image,
  width = r,
  height = r,
}) {
  let count = 0;
  if (repeatCount < 1) {
    width = 15;
    height = 15;
  }

  let coord = { x: x1, y: y1 };
  const intervalId = setInterval(() => {
    if (count < repeatCount) {
      if (repeatCount !== 1) {
        coord = getRandomCoordinateNearby(x1, y1, 50);
      }
      moveCircle(
        ctx,
        coord.x,
        coord.y,
        x2,
        y2,
        width,
        height,
        duration,
        image,
        () => {}
      );
      count++;
    } else {
      clearInterval(intervalId);
    }
  }, interval);
}

export const drawFullscreenAlertText = (ctx) => {
  ctx.font = `${FONT_SIZE}px serif`;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "Press Enter twice!",
    window.innerWidth / 2,
    window.innerHeight / 2 + 50
  );
};

export const drawText = (
  ctx,
  summary,
  remain,
  session = { current: 0, total: 0 },
  target_reward
) => {
  ctx.font = `${FONT_SIZE}px san-serif`;
  ctx.fillStyle = "#fff";
  const boardInterval = window.innerWidth / 6;

  ctx.fillText(
    `Total Bonus: ${summary.point.toFixed(1)} ¢`,
    boardInterval * 1,
    50
  );
  // ctx.fillText(
  //   `Current Bonus: ${
  //     typeof target_reward === "number" ? target_reward : "-"
  //   } cents`,
  //   boardInterval * 4,
  //   50
  // );
};
export const tdr1 = (max_reward, tct) => {
  return max_reward / (1 + (0.6 * tct) / 1000);
};

export const temporal_discounting_reward = (max_reward, tctms) => {
  return max_reward;
  // const tct = tctms / 1000;
  // const k1 = 0.5;
  // const k2 = 2.1;
  // let reward = 0;

  // if (tct < k1) {
  //   reward = max_reward;
  // } else if (tct > k2) {
  //   reward = 0;
  // } else {
  //   reward = (-0.714 * tct + 1.5712) * max_reward;
  // }

  // return reward;
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

export function financial(x) {
  return Number(Number.parseFloat(x).toFixed(2));
}
