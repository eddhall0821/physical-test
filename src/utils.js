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

  ctx.fillStyle = "#eee";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

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
  };
  toggleFullScreen(canvas);

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
  ctx.fillStyle = "red";
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
}) => {
  while (true) {
    console.log("generate....");
    const theta = getRandomArbitrary(0, 2 * Math.PI);
    const r = getRandomArbitrary(inner_radius, outer_radius);

    const x = center.x + r * Math.cos(theta);
    const y = center.y + r * Math.sin(theta);

    if (
      ball_radius <= x &&
      x <= screen_width - ball_radius &&
      ball_radius <= y &&
      y <= screen_height - ball_radius
    ) {
      return { x: x, y: y };
    }
  }
};

export const drawRewardText = (ctx, moneybag, target_reward) => {
  ctx.font = "30px serif";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "center";

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
  ctx.textBaseline = "center";
  ctx.fillText(
    "click to start!",
    window.innerWidth / 2,
    window.innerHeight / 2
  );
};

export const drawText = (ctx, summary) => {
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
};
