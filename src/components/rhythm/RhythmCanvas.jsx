import { useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage, Circle, Text } from "react-konva";
import Konva from "konva";
import Description from "./Description";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import Rest from "../Rest";
import { shuffle } from "../../utils";

const REST_TIME = 1;
const TOTAL_TRIAL = 2;
const BAR_HEIGHT = 300;
const BAR_WIDTH = 100;
const BAR_X = (window.innerWidth * 2) / 3;
const BAR_Y = window.innerHeight / 2 - BAR_HEIGHT / 2;

const BALL_RADIUS = 20;

const cycleArr = [1.25, 1.8]; //등장 주기, 단위 초
const reachArr = [0, 0.2]; //등장 후 zone에 만나기까지 시간, 단위 초
const stayTimeArr = [0.08, 0.15]; // zone에 머무르는 시간, 단위 초

//trial 관련 수정...
//현재 -> 공 출발, 다음 공 등장 전까지가 1cycle
//수정 -> 공 출발 전(delay)부터 다음 공 delay 전까지 1cycle

const RhythmCanvas = () => {
  const ballRef = useRef(null);
  const navigate = useNavigate();

  const [csvData, setCsvData] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);

  const [timeStamp, setTimeStamp] = useState(0);
  const [timeTargetAppeared, setTimeTargetAppeared] = useState(0);
  const [buttonPressed, setButtonPressed] = useState(0);
  const [timeTargetMeetZone, setTimeTargetMeetZone] = useState(0);

  const [isReady, setIsReady] = useState(false);
  const [keyDownDelay, setKeyDownDelay] = useState(false);
  const [barFill, setBarFill] = useState("grey");
  const [trial, setTrial] = useState({
    current: 0,
    total: TOTAL_TRIAL,
  });
  const [summary, setSummary] = useState({
    success: 0,
    fail: 0,
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

  const plusSummaryCount = (res) => {
    setSummary((old) => {
      return {
        ...old,
        [res]: old[res] + 1,
      };
    });
  };

  const handleKeyDown = (e) => {
    //spacebar
    if (e.key === " " && !keyDownDelay) {
      const p = performance.now();
      console.log("condition#1 거리 기준");
      const a = ballRef?.current?.attrs?.x - BAR_X;
      const b = BAR_X + BAR_WIDTH - ballRef?.current?.attrs?.x;
      console.log("공과 bar 시작 거리 px", a);
      console.log("공과 bar 끝 거리 px", b);

      setKeyDownDelay(true);
      if (
        BAR_X < ballRef?.current?.attrs?.x &&
        BAR_X + BAR_WIDTH > ballRef?.current?.attrs?.x
      ) {
        setBarFill("blue");
        plusSummaryCount("success");
      } else {
        setBarFill("red");
        plusSummaryCount("fail");
      }
      setButtonPressed(p);

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
      const stamp = performance.now();
      setTimeStamp(stamp);
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
    if (trial.current !== 0) {
      console.log("----------condition#2----------");
      console.log(condition);
      console.log(
        "ms로 계산한 ball과 bar 사이 거리" +
          (((buttonPressed - timeTargetMeetZone) / 1000) * BAR_WIDTH) /
            condition.stayTime
      );

      const tempRow = {
        TC: condition.reach,
        Wa: condition.stayTime,
        P: condition.cycle,
        TargetDistance: (BAR_WIDTH / condition.stayTime) * condition.reach,
        ZoneWidth: BAR_WIDTH,
        targetSpeed: BAR_WIDTH / condition.stayTime,
        targetWidth: BALL_RADIUS * 2,
        targetX: BAR_X - (BAR_WIDTH / condition.stayTime) * condition.reach,
        targetY: window.innerHeight / 2,
        zoneX: BAR_X,
        zoneY: BAR_Y,
        frameRate: 0,
        timeTargetAppeared: timeTargetAppeared - timeStamp,
        timeTargetMeetZone: timeTargetMeetZone,
        buttonPressed: buttonPressed - timeStamp,
        timeGap: buttonPressed - timeTargetAppeared,
        correct: +(
          buttonPressed - timeTargetMeetZone > 0 &&
          buttonPressed - timeTargetMeetZone < condition.stayTime * 1000
        ),
      };

      setCsvData((old) => {
        return [...old, tempRow];
      });

      console.log("----------condition#2----------");
    }

    if (trial.current === trial.total && combination.length === 0) {
      alert("DONE");
      setIsFinished(true);
      return false;
    }

    if (trial.current !== trial.total && animation && !isResting) {
      createAnimation(condition);
    }

    if (trial.current === trial.total) {
      console.log("resting...");
      setIsResting(true);
      setRestTime(REST_TIME);

      setTrial({
        current: 0,
        total: TOTAL_TRIAL,
      });
      setCondition(popCombination());
    }
  }, [trial]);

  useEffect(() => {
    if (ballRef && condition && isReady && !isResting) {
      createAnimation(condition);
    }
  }, [condition, ballRef, isReady, isResting]);

  useEffect(() => {
    if (animation) {
      setTimeout(() => {
        animation.start();
        const p = performance.now();
        setTimeTargetAppeared(p);
        // console.log("time target appeared", p - timeStamp);
        runNextTrial();
      }, 1000);
    }
  }, [animation]);

  const runNextTrial = () => {
    setTimeout(() => {
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
    let isFirstMeet = true;

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
          BAR_X + BAR_WIDTH > ballRef.current.attrs.x &&
          isFirstMeet
        ) {
          console.log("pass ms");
          isFirstMeet = false;
          setTimeTargetMeetZone(performance.now());
        }
        if (
          BAR_X < ballRef.current.attrs.x &&
          BAR_X + BAR_WIDTH > ballRef.current.attrs.x
        ) {
          console.log("pass");
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

  useEffect(() => {
    if (restTime > 0) {
      setTimeout(() => {
        setRestTime((old) => old - 1);
      }, 1000);
    } else {
      setIsResting(false);
    }
  }, [restTime]);

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
      {isFinished && <CSVLink data={csvData}>Download me</CSVLink>}
      {!isReady && !isFinished && <Description />}
      {isReady && !isFinished && (
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer>
            <Text
              text={`${condition.reach}거리 ${condition.stayTime}속도 ${condition.cycle}등장주기 `}
            />
            {isResting && <Rest time={restTime} />}
            {!isResting && (
              <>
                <Text
                  text={`round : ${8 - combination.length}/8`}
                  x={window.innerWidth - 250}
                  y={50}
                  fontSize={24}
                />
                <Text
                  text={`trial : ${trial.current + 1}/${trial.total} `}
                  x={window.innerWidth - 250}
                  y={100}
                  fontSize={24}
                />
                <Text
                  text={`success/fail : ${summary.success}/${summary.fail}`}
                  x={window.innerWidth - 250}
                  y={150}
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
                />
              </>
            )}
          </Layer>
        </Stage>
      )}
    </div>
  );
};

export default RhythmCanvas;
