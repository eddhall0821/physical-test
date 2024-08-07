import React, { useEffect, useState } from "react";
import {
  drawMTPTarget,
  drawPointer,
  initCanvas,
  resetCanvas,
  toggleFullScreen,
} from "../../utils";
import { useRecoilValue } from "recoil";
import { mointorBoundState } from "../../recoil/atom";

const fetchSimulationData = async () => {
  const res = await fetch("http://127.0.0.1:8000/simulate");
  const json_string = await res.json();
  const data = JSON.parse(json_string.message);
  return data;
};

const Simulator = () => {
  const [simulationData, setSimulationData] = useState({});
  const [loading, setLoading] = useState(true);
  const monitorBound = useRecoilValue(mointorBoundState);

  const moveTargetAtoB = (b1, b2, p1, p2, duration, canvas, ctx) => {
    let startTime = performance.now();
    const target_radius = 10;

    return new Promise((resolve) => {
      const step = (timestamp) => {
        if (!timestamp) startTime = timestamp;
        const elapsed = timestamp - startTime;

        const progress = Math.min(elapsed / duration, 1);

        const currentBallX = b1.x + (b2.x - b1.x) * progress;
        const currentBallY = b1.y + (b2.y - b1.y) * progress;
        const currentPointerX = p1.x + (p2.x - p1.x) * progress;
        const currentPointerY = p1.y + (p2.y - p1.y) * progress;

        resetCanvas(ctx, monitorBound);
        drawMTPTarget(
          ctx,
          monitorBound.left + currentBallX * monitorBound.width,
          monitorBound.top + currentBallY * monitorBound.height,
          0,
          target_radius
        );
        drawPointer(
          ctx,
          monitorBound.left + currentPointerX * monitorBound.width,
          monitorBound.top + currentPointerY * monitorBound.height
        );
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          resolve(true);
        }
      };
      requestAnimationFrame(step);
    });
  };

  const getSimulationData = async () => {
    const data = await fetchSimulationData();
    setLoading(false);
    setSimulationData(data);
  };

  useEffect(() => {
    getSimulationData();
  }, []);

  useEffect(() => {
    let currentIndex = 0;
    if (!loading) {
      const { timeDiff, pointer_x, pointer_y, ball_x, ball_y } = simulationData;

      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");

      // initCanvas(canvas);

      const aa = async () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log("aa");
            resolve(true);
          }, 1000);
        });
      };
      const startAnimation = async () => {
        for (let i = 0; i < Object.keys(timeDiff).length; i++) {
          await moveTargetAtoB(
            { x: ball_x[currentIndex], y: ball_y[currentIndex] },
            { x: ball_x[currentIndex + 1], y: ball_y[currentIndex + 1] },
            { x: pointer_x[currentIndex], y: pointer_y[currentIndex] },
            { x: pointer_x[currentIndex + 1], y: pointer_y[currentIndex + 1] },
            timeDiff[currentIndex + 1] * 1000,
            canvas,
            ctx
          );
          currentIndex++;
        }
      };

      startAnimation();
    }
  }, [loading]);

  return (
    <>
      {!loading && (
        <canvas
          id="canvas"
          width={window.innerWidth}
          height={window.innerHeight}
        />
      )}
    </>
  );
};

export default Simulator;
