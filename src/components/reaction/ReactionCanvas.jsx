import { useEffect, useState } from "react";
import { Circle, Layer, Rect, Stage, Star, Text } from "react-konva";

const BALL_COUNT_WEIGHT = 1;
// const BALL_COUNT_WEIGHT = 20;
const REST_TIME = 5000;
// const REST_TIME = 30000;

const BALL_TYPE = [
  {
    numberOfBalls: 1,
    count: 2 * BALL_COUNT_WEIGHT,
  },
  {
    numberOfBalls: 2,
    count: 6 * BALL_COUNT_WEIGHT,
  },
  {
    numberOfBalls: 4,
    count: 4 * BALL_COUNT_WEIGHT,
  },
];

const csvData = [
  {
    // UserID: "KDW",
    // NumLight: 2,
    // Trial: 12345,
    // Colored: 2,
    // Pressed: 2,
    // Correct: 10,
    // trialStartT: 13.5,
    // PressedT: 14.4,
    // ReactionTime: 0.9,
  },
];

const ReactionCanvas = () => {
  const [initalBallType, setInitalBallType] = useState(BALL_TYPE);
  const [ballType, setBallType] = useState(null);
  const [shapes, setShapes] = useState(null);
  const [trial, setTrial] = useState({
    current: 0,
    total: 1,
  });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [timeStamp, setTimeStamp] = useState(0);
  const [tempRow, setTempRow] = useState({
    UserID: "KDW",
    NumLight: 2,
    Trial: 1,
    Colored: 2,
    Pressed: 2,
    Correct: 10,
    trialStartT: 13.5,
    PressedT: 14.4,
    ReactionTime: 0.9,
  });
  const [csvData, setCsvData] = useState([]);

  const generateShapes = () => {
    return [...Array(ballType.numberOfBalls)].map((_, i) => ({
      id: i.toString(),
      x: (window.innerWidth / (ballType.numberOfBalls + 1)) * (i + 1),
      y: window.innerHeight / 3,
      fill: "grey",
    }));
  };

  //키보드 눌렀을 때 실행
  const handleKeyDown = (e) => {
    if (isBlinking && e.key <= ballType.numberOfBalls && e.key > 0) {
      setCsvData((old) => [
        ...old,
        {
          ...tempRow,
          PressedT: timeStamp,
          ReactionTime: timeStamp - tempRow.trialStartT,
          Pressed: e.key,
          Correct: e.key === tempRow.Colored + 1 + "",
        },
      ]);
      const newShapes = shapes.map((shape) => {
        return { ...shape, fill: "grey" };
      });

      console.log(csvData);
      setIsBlinking(false);
      setShapes(newShapes);
      setTrial((old) => {
        return {
          ...old,
          current: old.current + 1,
        };
      });
    }
  };

  const getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  useEffect(() => {
    let interval = null;

    if (isRecording) {
      interval = setInterval(() => {
        setTimeStamp((old) => old + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRecording]);

  //도형 생성
  useEffect(() => {
    if (ballType) {
      setShapes(generateShapes());
    }

    if (ballType) {
      setTrial({
        current: 0,
        total: ballType.count,
      });
    }
  }, [ballType]);

  //trial이 끝나면, 해당 ball type finished
  useEffect(() => {
    //trial 종료
    if (trial.current === trial.total) {
      if (initalBallType.length === 0) {
        alert("TRIAL FINISH");
      }

      const newInitialBallType = initalBallType.filter((type, i) => {
        if (type.numberOfBalls !== ballType.numberOfBalls) {
          return true;
        } else {
          return false;
        }
      });

      setIsResting(true);

      setTimeout(() => {
        setIsResting(false);
        setInitalBallType(newInitialBallType);
      }, REST_TIME);
    }
  }, [trial]);

  //공 점멸
  useEffect(() => {
    if (trial.current !== trial.total && ballType) {
      const time = getRandomArbitrary(0.3, 2);
      setTimeout(() => {
        const newShapes = [...shapes];
        const colored = Math.floor(Math.random() * newShapes.length);
        newShapes[colored].fill = "red";
        setShapes(newShapes);
        setIsBlinking(true);

        setTempRow((old) => {
          return {
            ...old,
            NumLight: newShapes.length,
            Colored: colored,
            Trial: old.Trial + 1,
            trialStartT: timeStamp,
          };
        });
      }, time * 1000);
    }
  }, [trial]);

  //balltype
  useEffect(() => {
    if (initalBallType.length !== 0) {
      setIsRecording(true);
      setBallType(
        initalBallType[Math.floor(Math.random() * initalBallType.length)]
      );
    } else {
      alert("DONE");
      console.log(csvData);
    }
  }, [initalBallType]);

  //focus해서 keydown 이벤트 걸리게
  useEffect(() => {
    window.location = "#focus";
  }, []);

  return (
    <div id={"focus"} tabIndex={0} onKeyDown={handleKeyDown}>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onKeyPress={(e) => {
          console.log(e);
        }}
      >
        <Layer>
          {isResting && (
            <Text
              fontSize={50}
              text="RESTING...."
              x={window.innerWidth / 3}
              y={window.innerHeight / 2}
            />
          )}
          {shapes && !isResting && (
            <>
              <Text text={timeStamp} />
              <Text
                text={`round : ${4 - initalBallType.length}/3`}
                x={window.innerWidth - 250}
                y={50}
                fontSize={24}
              />
              <Text
                text={`trial ${trial.current + 1}/${trial.total}`}
                x={window.innerWidth - 250}
                y={100}
                fontSize={24}
              />
              {shapes.map((circle) => (
                <Circle
                  key={circle.id}
                  id={circle.id}
                  x={circle.x}
                  y={circle.y}
                  radius={40}
                  fill={circle.fill}
                  shadowColor="black"
                  shadowBlur={10}
                  shadowOpacity={0.2}
                  shadowOffsetX={0}
                  shadowOffsetY={5}
                />
              ))}
              {shapes.map((rect) => (
                <Rect
                  key={`rect${rect.id}`}
                  x={rect.x - 40}
                  y={rect.y + 200}
                  fill={"grey"}
                  width={80}
                  height={80}
                  shadowColor="black"
                  shadowBlur={10}
                  shadowOpacity={0.2}
                  shadowOffsetX={0}
                  shadowOffsetY={5}
                />
              ))}

              {shapes.map((text) => (
                <Text
                  text={parseInt(text.id) + 1}
                  fontSize={40}
                  key={`text${text.id}`}
                  x={text.x - 10}
                  y={text.y + 220}
                  fill={"white"}
                  width={80}
                  height={80}
                  shadowColor="black"
                  shadowBlur={10}
                  shadowOpacity={0.2}
                  shadowOffsetX={0}
                  shadowOffsetY={5}
                />
              ))}
            </>
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default ReactionCanvas;
