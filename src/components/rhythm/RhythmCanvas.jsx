import { useEffect, useRef } from "react";
import { Layer, Rect, Stage } from "react-konva";
import Konva from "konva";

const RhythmCanvas = () => {
  const barRef = useRef(null);

  //focus해서 keydown 이벤트 걸리게
  useEffect(() => {
    window.location = "#focus";
  }, []);

  // const tick = () => {
  //   console.log(barRef);
  //   barRef.current = requestAnimationFrame(tick);
  // };

  // useEffect(() => {
  //   barRef.current = requestAnimationFrame(tick);
  //   return () => {
  //     cancelAnimationFrame(barRef.current);
  //   };
  // }, []);

  useEffect(() => {
    moveBar();
  }, []);

  const moveBar = () => {
    // move a node to the right at 50 pixels / second
    const velocity = 300;
    var anim = new Konva.Animation((frame) => {
      var dist = velocity * (frame.timeDiff / 1000);
      barRef.current.move({ x: dist, y: 0 });
    }, barRef.current.getLayer());
    anim.start();
    return () => {
      anim.stop();
    };
  };

  return (
    <div
      id="focus"
      tabIndex={0}
      style={{
        width: window.innerWidth,
        height: window.innerHeight,
      }}
    >
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Rect
            ref={barRef}
            x={20}
            y={20}
            width={50}
            height={50}
            fill="green"
            shadowBlur={5}
            onClick={() => console.log(barRef)}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default RhythmCanvas;
