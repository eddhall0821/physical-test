import { useEffect, useRef } from "react";
import { drawPointer, resetCanvas } from "../../utils";
import { useRecoilValue } from "recoil";
import { mointorBoundState, pointerWeightState } from "../../recoil/atom";

const DemoPointing = () => {
  const weight = useRecoilValue(pointerWeightState);
  // const weight = 1;
  const monitorBound = useRecoilValue(mointorBoundState);
  const canvasRef = useRef(null);
  const positionRef = useRef({ x: 50, y: 50 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function updatePosition(e) {
      positionRef.current.x += e.movementX * weight;
      positionRef.current.y += e.movementY * weight;

      positionRef.current.x = Math.max(
        monitorBound.left,
        Math.min(positionRef.current.x, window.screen.width - monitorBound.left)
      );
      positionRef.current.y = Math.max(
        monitorBound.top,
        Math.min(positionRef.current.y, window.screen.height - monitorBound.top)
      );

      resetCanvas(ctx, monitorBound);
      const { x, y } = positionRef.current;
      drawPointer(ctx, x, y);
    }

    function lockChangeAlert() {
      if (document.pointerLockElement === canvas) {
        console.log("The pointer lock status is now locked");
        document.addEventListener("mousemove", updatePosition, false);
      } else {
        console.log("The pointer lock status is now unlocked");
        document.removeEventListener("mousemove", updatePosition, false);
      }
    }

    canvas.addEventListener("click", async () => {
      if (!document.pointerLockElement) {
        try {
          await canvas.requestPointerLock();
        } catch (error) {
          if (error.name === "NotSupportedError") {
            await canvas.requestPointerLock();
          } else {
            throw error;
          }
        }
      }
    });

    document.addEventListener("pointerlockchange", lockChangeAlert, false);
    return () => {
      document.removeEventListener("pointerlockchange", lockChangeAlert, false);
      document.removeEventListener("mousemove", updatePosition, false);
    };
  }, [weight, monitorBound]);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
};

export default DemoPointing;

// import { useEffect, useRef } from "react";
// import { drawPointer, resetCanvas } from "../../utils";
// import { useRecoilValue } from "recoil";
// import { mointorBoundState, pointerWeightState } from "../../recoil/atom";

// const DemoPointing = () => {
//   const weight = useRecoilValue(pointerWeightState);
//   // const weight = 1;
//   const monitorBound = useRecoilValue(mointorBoundState);
//   const canvasRef = useRef(null);
//   const positionRef = useRef({ x: 50, y: 50 });

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     function updatePosition(e) {
//       positionRef.current.x += e.movementX * weight;
//       positionRef.current.y += e.movementY * weight;

//       positionRef.current.x = Math.max(
//         monitorBound.left,
//         Math.min(positionRef.current.x, window.screen.width - monitorBound.left)
//       );
//       positionRef.current.y = Math.max(
//         monitorBound.top,
//         Math.min(positionRef.current.y, window.screen.height - monitorBound.top)
//       );

//       resetCanvas(ctx, monitorBound);
//       const { x, y } = positionRef.current;
//       drawPointer(ctx, x, y);
//     }

//     function lockChangeAlert() {
//       if (document.pointerLockElement === canvas) {
//         console.log("The pointer lock status is now locked");
//         document.addEventListener("mousemove", updatePosition, false);
//       } else {
//         console.log("The pointer lock status is now unlocked");
//         // document.removeEventListener("mousemove", updatePosition, false);
//       }
//     }

//     canvas.addEventListener("click", async () => {
//       console.log(document.pointerLockElement);

//       if (!document.pointerLockElement) {
//         try {
//           await canvas.requestPointerLock({ unadjustedMovement: true });
//         } catch (error) {
//           if (error.name === "NotSupportedError") {
//             await canvas.requestPointerLock();
//           } else {
//             throw error;
//           }
//         }
//       }
//     });

//     document.addEventListener("pointerlockchange", lockChangeAlert, false);
//     return () => {
//       document.removeEventListener("pointerlockchange", lockChangeAlert, false);
//       document.removeEventListener("mousemove", updatePosition, false);
//     };
//   }, [weight, monitorBound]);

//   return (
//     <canvas
//       ref={canvasRef}
//       width={window.innerWidth}
//       height={window.innerHeight}
//     />
//   );
// };

// export default DemoPointing;
