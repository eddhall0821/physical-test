import { useRecoilValue } from "recoil";
import { mointorBoundState, prolificUserState } from "../../recoil/atom";
import { Button, Space, Tour, Typography } from "antd";
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
      navigate(
        `/pnc?PROLIFIC_PID=${prolificUser.PROLIFIC_PID}&STUDY_ID=${prolificUser.STUDY_ID}&SESSION_ID=${prolificUser.SESSION_ID}`
      );
    }
  }, [open]);

  const StepTitle = ({ children }) => {
    return <p style={{ fontSize: 20, margin: 0 }}>{children}</p>;
  };

  const StepContent = ({ children }) => {
    return <p style={{ fontSize: 16, margin: 0 }}>{children}</p>;
  };
  const MainTaskFont = ({ children }) => {
    return <p style={{ fontSize: 30, margin: 10 }}>{children}</p>;
  };

  const steps = [
    {
      title: <StepTitle>Next Reward</StepTitle>,
      description: <StepContent>The value of the upcoming reward</StepContent>,
      target: () => ref6.current,
    },
    {
      title: <StepTitle>Blue Circular Target</StepTitle>,
      description: (
        <StepContent>
          <b style={{ color: "red" }}>
            Click on the blue circular target as quickly and accurately as
            possible.
          </b>
          <br />
          If there is no mouse movement or clicks for 3 seconds, the trial will
          be skipped.
        </StepContent>
      ),
      target: () => ref7.current,
    },
    {
      title: <StepTitle>Trial Results</StepTitle>,
      description: (
        <StepContent>
          success/failure of each trial and bonuses earned for each click
        </StepContent>
      ),
      target: () => ref8.current,
    },
    {
      title: <StepTitle>Trials</StepTitle>,
      description: <StepContent>Current trial and total trials</StepContent>,
      target: () => ref1.current,
    },
    {
      title: <StepTitle>Total Bonus</StepTitle>,
      description: <StepContent>Total bonuses you earned</StepContent>,
      target: () => ref3.current,
    },
    {
      title: <StepTitle>Successful Clicks</StepTitle>,
      description: <StepContent>The number of successful clicks</StepContent>,
      target: () => ref2.current,
    },
    {
      title: <StepTitle>Failed Clicks</StepTitle>,
      description: <StepContent>The number of unsuccessful clicks</StepContent>,
      target: () => ref4.current,
    },
  ];
  return (
    <>
      {!open && (
        <>
          <TaskSteps current={4} />
          <Content>
            <Space direction="vertical" style={{ width: 1000 }}>
              <Typography>
                <Typography.Title level={3}>Main Tasks</Typography.Title>
                <Typography.Paragraph>
                  Before the blue circular target appears on the screen, the
                  bonus for each trial is displayed.
                  <br />
                  If you successfully click on the target, you will get that
                  bonus.
                </Typography.Paragraph>
              </Typography>
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
          <div ref={ref3}>Earned Bonus: 1€</div>
          <div ref={ref2}>✅: 10</div>
          <div ref={ref4}>❌: 2</div>
          <div></div>
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
          <MainTaskFont>Next reward is 1 pence.</MainTaskFont>
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
          <MainTaskFont>✅</MainTaskFont>
          {/* <p>It took 0.5 seconds.</p> */}
          <MainTaskFont>You got 1 pence.</MainTaskFont>
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
