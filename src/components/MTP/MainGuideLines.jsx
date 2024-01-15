import { useRecoilValue } from "recoil";
import { mointorBoundState, prolificUserState } from "../../recoil/atom";
import { Button, Space, Tour } from "antd";
import { useEffect, useRef, useState } from "react";
import { toggleFullScreen } from "../../utils";
import { Content } from "antd/es/layout/layout";
import TaskSteps from "../TaskSteps";
import { useNavigate } from "react-router-dom";
import moneybag from "../../images/moneybag.png";

const MainGuideLines = () => {
  const monitorBound = useRecoilValue(mointorBoundState);
  const prolificUser = useRecoilValue(prolificUserState);

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);
  const ref7 = useRef(null);
  const ref8 = useRef(null);

  const [open, setOpen] = useState(false);
  const [currentGuideIndex, setCurrentGuideIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (open && !document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    }

    if (document.fullscreenElement) {
      // document.exitFullscreen();
      // navigate(
      //   `/pnc?PROLIFIC_PID=${prolificUser.PROLIFIC_PID}&STUDY_ID=${prolificUser.STUDY_ID}&SESSION_ID=${prolificUser.SESSION_ID}`
      // );
    }
  }, [open]);

  const StepTitle = ({ children }) => {
    return <p style={{ fontSize: 20, margin: 0 }}>{children}</p>;
  };

  const StepContent = ({ children }) => {
    return <p style={{ fontSize: 16, margin: 0 }}>{children}</p>;
  };

  const steps = [
    {
      title: <StepTitle>Next Reward</StepTitle>,
      description: (
        <StepContent>Points value of the upcoming reward.</StepContent>
      ),
      target: () => ref6.current,
    },
    {
      title: <StepTitle>Blue Highlighted Target Circle</StepTitle>,
      description: (
        <StepContent>
          Click the blue highlighted target Circle. If there is no activity for
          3 seconds, the trial is skipped.
        </StepContent>
      ),
      target: () => ref7.current,
    },
    {
      title: <StepTitle>Click results</StepTitle>,
      description: (
        <StepContent>
          When you click on a target, you'll see a short display of success/time
          taken/points earned.
        </StepContent>
      ),
      target: () => ref8.current,
    },
    {
      title: <StepTitle>Trials</StepTitle>,
      description: <StepContent>Current trial and total trials.</StepContent>,
      target: () => ref1.current,
    },
    {
      title: <StepTitle>Successful Clicks</StepTitle>,
      description: (
        <StepContent>Number of clicks resulting in success.</StepContent>
      ),
      target: () => ref2.current,
    },
    {
      title: <StepTitle>Earned Bonus</StepTitle>,
      description: <StepContent>Total bonus earned.</StepContent>,
      target: () => ref3.current,
    },
    {
      title: <StepTitle>Failed Clicks</StepTitle>,
      description: (
        <StepContent>Number of clicks resulting in failure.</StepContent>
      ),
      target: () => ref4.current,
    },
    {
      title: <StepTitle>Current Bonus</StepTitle>,
      description: (
        <StepContent>The bonus for the current trial is displayed.</StepContent>
      ),
      target: () => ref5.current,
    },
  ];
  return (
    <>
      {!open && (
        <>
          <TaskSteps current={4} />
          <Content>
            <Space direction="vertical" style={{ width: 1000 }}>
              <h2>
                From now on, the screen will show the amount of rewards you can
                earn for each trial. In the game, click on the target to collect
                rewards. After each attempt, you'll receive a bonus calculated
                from the total rewards earned. Rewards are issued in points,
                with 1000 points equaling 1 euro.
              </h2>
              <Button
                size="large"
                type="primary"
                onClick={() => {
                  setOpen(true);
                }}
              >
                Start Tutorial
              </Button>
            </Space>
          </Content>
        </>
      )}

      {/* guide.. start */}

      <div
        style={{
          display: open ? "block" : "none",
          width: window.screen.width,
          height: window.screen.height,
          backgroundColor: "black",
          position: "absolute",
          fontFamily: "sans serif",
          fontSize: 30,
          color: "white",
        }}
      >
        <div
          style={{
            width: monitorBound.width,
            height: monitorBound.height,
            top: monitorBound.top,
            left: monitorBound.left,
            backgroundColor: "#1c1c1c",
            position: "absolute",
          }}
        ></div>
        <div
          style={{
            display: "flex",
            left: monitorBound.left,
            top: 50,
            width: monitorBound.width,
            position: "absolute",
            justifyContent: "space-between",
            flexDirection: "row",
            zIndex: 1,
          }}
        >
          <div ref={ref1}>Trials: 12 / 900</div>
          <div ref={ref2}>✅: 10</div>
          <div ref={ref3}>Earned Bonus: 1€</div>
          <div ref={ref4}>❌: 2</div>
          <div ref={ref5}>Current Bonus: 10p</div>
        </div>
        <div
          style={{
            display: currentGuideIndex !== 0 && "none",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          ref={ref6}
        >
          <p>Next reward: 10p!</p>
          <img alt="money" src={moneybag} width={100} />
        </div>

        <div
          style={{
            display: currentGuideIndex !== 1 && "none",
            position: "absolute",
            top: "70%",
            left: "70%",
            transform: "translate(-50%, -50%)",
            width: 200,
            height: 200,
            background: "#00BFFF",
            borderRadius: "100%",
          }}
          ref={ref7}
        />
        <div
          style={{
            fontFamily: "serif",
            display: currentGuideIndex !== 2 && "none",
            position: "absolute",
            top: "60%",
            left: "70%",
            transform: "translate(-50%, -50%)",
          }}
          ref={ref8}
        >
          <p>✅</p>
          <p>It took 0.5 seconds.</p>
          <p>You got 10 points.</p>
        </div>
      </div>
      <Tour
        onChange={(e) => setCurrentGuideIndex(e)}
        closeIcon={false}
        scrollIntoViewOptions={false}
        mask={{
          color: "rgba(223, 223, 223, .4)",
        }}
        open={open}
        onClose={() => setOpen(false)}
        steps={steps}
      />
    </>
  );
};

export default MainGuideLines;
