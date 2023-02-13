import { useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage, Circle, Text } from "react-konva";
import Konva from "konva";
import Description from "./Description";
import { useNavigate } from "react-router-dom";

const BAR_HEIGHT = 300;
const BAR_WIDTH = 100;
const BAR_X = (window.innerWidth * 2) / 3;
const BAR_Y = window.innerHeight / 2 - BAR_HEIGHT / 2;

const BALL_RADIUS = 20;

const cycleArr = [1.25, 1.8]; //등장 주기, 단위 초
const reachArr = [0, 0.2]; //등장 후 zone에 만나기까지 시간, 단위 초
const stayTimeArr = [0.08, 0.15]; // zone에 머무르는 시간, 단위 초

let test_s = [];

const shuffle = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

//trial 관련 수정...
//현재 -> 공 출발, 다음 공 등장 전까지가 1cycle
//수정 -> 공 출발 전(delay)부터 다음 공 delay 전까지 1cycle

const RhythmCanvas = () => {
  const ballRef = useRef(null);
  const navigate = useNavigate();

  const [isReady, setIsReady] = useState(true);
  const [keyDownDelay, setKeyDownDelay] = useState(false);
  const [barFill, setBarFill] = useState("grey");
  const [trial, setTrial] = useState({
    current: 0,
    total: 3,
  });
  const [animation, setAnimation] = useState(null);

  const createCombination = (cycleArr, reachArr, stayTimeArr) => {
    let combination = [];
    for (let cycle of cycleArr) {
      for (let reach of reachArr) {
        for (let stayTime of stayTimeArr) {
          combination.push({
            cycle,
            reach,
            stayTime,
          });
        }
      }
    }
    return shuffle(combination);
  };

  const [combination, setCombination] = useState(() => {
    return createCombination(cycleArr, reachArr, stayTimeArr);
  });

  const popCombination = () => {
    const copy = [...combination];
    const pop = copy.pop();
    setCombination(copy);
    return pop;
  };

  const [condition, setCondition] = useState(() => popCombination());

  const handleKeyDown = (e) => {
    //spacebar 이벤트
    if (e.key === " " && !keyDownDelay) {
      setKeyDownDelay(true);
      // console.log(performance.now());
      // setTimeout(() => {
      // }, 500);

      if (
        BAR_X < ballRef?.current?.attrs?.x &&
        BAR_X + BAR_WIDTH > ballRef?.current?.attrs?.x
      ) {
        setBarFill("blue");
      } else {
        setBarFill("red");
      }

      setTimeout(() => {
        setBarFill("grey");
      }, 300);
    }

    if (!isReady && e.key === "Escape") {
      navigate("/");
    }
    //s keydown
    if (!isReady && e.key === "s") {
      setIsReady(true);
    }
  };
  //focus해서 keydown 이벤트 걸리게
  useEffect(() => {
    window.location = "#focus";
  }, []);

  useEffect(() => {
    if (isReady) {
      // moveBar();
    }
  }, [isReady]);

  useEffect(() => {
    if (trial.current === trial.total && combination.length === 0) {
      alert("DONE");
      console.log(test_s);
      return false;
    }
    if (trial.current === trial.total) {
      setCondition(popCombination());
      setTrial({
        current: 0,
        total: 3,
      });
    }

    if (trial.current !== trial.total && animation) {
      createAnimation(condition);
    }
  }, [trial]);

  useEffect(() => {
    if (ballRef && condition) {
      createAnimation(condition);
    }
  }, [condition, ballRef]);

  useEffect(() => {
    if (condition && trial && isReady) {
    }
  }, [condition, trial, isReady]);

  useEffect(() => {
    if (animation) {
      let p = performance.now();
      test_s.push(p);

      setTimeout(() => {
        animation.start();
        runNextTrial();
      }, 1000);
    }
  }, [animation]);

  const runNextTrial = () => {
    setTimeout(() => {
      console.log("SET trial");
      setTrial((old) => {
        return { ...old, current: old.current + 1 };
      });
    }, condition.cycle * 1000);
  };

  const createAnimation = (condition) => {
    setKeyDownDelay(false);

    if (animation) {
      animation.stop();
    }
    const velocity = BAR_WIDTH / condition.stayTime; //속도

    const period = condition.cycle * 1000; //보여지는 시간
    let cnt = 0;

    ballRef.current.x(BAR_X - velocity * condition.reach);
    ballRef.current.opacity(0);

    var anim = new Konva.Animation((frame) => {
      if (frame.time < period) {
        // move a node to the right at velocity pixels / second
        //timeDiff값 주사율에 따라 달라짐

        //staytime은 ball이 bar에 머물러 있는 시간 단위초.
        var dist = velocity * (frame.timeDiff / 1000);
        ballRef.current.move({ x: dist });
        ballRef.current.opacity(1);

        if (
          BAR_X < ballRef.current.attrs.x &&
          BAR_X + BAR_WIDTH > ballRef.current.attrs.x
        ) {
          // console.log("pass ms");
        }

        cnt++;
      } else {
        //주사율에 따라 달라짐. 60, 120
        // console.log(cnt / 120);
        return anim.stop();
      }
    }, ballRef.current.getLayer());

    setAnimation(anim);
  };

  return (
    <div
      id="focus"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        width: window.innerWidth,
        height: window.innerHeight,
      }}
    >
      {!isReady && <Description />}
      {isReady && (
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer>
            <Text
              text={`${condition.cycle}등장주기 ${condition.reach}거리 ${condition.stayTime}속도`}
            />
            <Text
              text={`round : ${8 - combination.length}/8`}
              x={window.innerWidth - 250}
              y={50}
              fontSize={24}
            />
            <Text
              text={`trial : ${trial.current + 1}/${trial.total}`}
              x={window.innerWidth - 250}
              y={100}
              fontSize={24}
            />

            <Rect
              x={BAR_X}
              y={BAR_Y}
              width={BAR_WIDTH}
              height={BAR_HEIGHT}
              fill={barFill}
            />

            <Circle
              ref={ballRef}
              x={BAR_X}
              y={window.innerHeight / 2}
              radius={BALL_RADIUS}
              fill="green"
              onClick={() => console.log(ballRef)}
            />
          </Layer>
        </Stage>
      )}
    </div>
  );
};

export default RhythmCanvas;
