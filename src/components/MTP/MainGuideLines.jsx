import { useRecoilValue } from "recoil";
import { mointorBoundState, prolificUserState } from "../../recoil/atom";
import { Button, Space, Tour, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { Content } from "antd/es/layout/layout";
import TaskSteps from "../TaskSteps";
import { useNavigate } from "react-router-dom";
import moneybag from "../../images/reward/cent/cent3.png";
import progressBar from "../../images/progress-bar.png";
import cusror from "../../images/cursor.png";
import task from "../../images/task.png";
import click_success from "../../images/success_click.png";
import click_fail from "../../images/fail_click.png";
import reward_setting from "../../images/reward_setting.png";

const MainGuideLines = () => {
  const monitorBound = useRecoilValue(mointorBoundState);
  const prolificUser = useRecoilValue(prolificUserState);

  const ref1 = useRef(null);
  const refSessionEnd = useRef(null);

  const refTrials = useRef(null);
  const refSessions = useRef(null);
  const refCurrentBonus = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);
  const refOrange = useRef(null);
  const refBlue = useRef(null);
  const refGreen = useRef(null);
  const refSuccess = useRef(null);
  const refFail = useRef(null);
  const refRewardSettings = useRef(null);
  const refReward = useRef(null);
  const ref8 = useRef(null);
  const ref9 = useRef(null);

  const [open, setOpen] = useState(false);
  const [currentGuideIndex, setCurrentGuideIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (open && !document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    }

    if (document.fullscreenElement) {
      document.exitFullscreen();
      navigate(
        `/practice?PROLIFIC_PID=${prolificUser.PROLIFIC_PID}&STUDY_ID=${prolificUser.STUDY_ID}&SESSION_ID=${prolificUser.SESSION_ID}`
      );
    }
  }, [open]);

  const StepTitle = ({ children }) => {
    return <p style={{ fontSize: 22, margin: 0 }}>{children}</p>;
  };

  const StepContent = ({ children }) => {
    return <p style={{ fontSize: 18, margin: 0 }}>{children}</p>;
  };
  const MainTaskFont = ({ children }) => {
    return <p style={{ fontSize: 30, margin: 10 }}>{children}</p>;
  };

  const steps = [
    {
      title: <StepTitle>Mouse Cursor</StepTitle>,
      description: <StepContent>This is your cursor.</StepContent>,
      target: () => ref9.current,
    },
    {
      title: <StepTitle>Sessions</StepTitle>,
      description: (
        <StepContent>
          The amount of bonuses you can earn in this session.
        </StepContent>
      ),
      target: () => refSessionEnd.current,
    },

    {
      title: <StepTitle>Circular Target</StepTitle>,
      description: (
        <StepContent>This is the target. You have to click it.</StepContent>
      ),
      target: () => ref6.current,
    },

    // {
    //   title: <StepTitle>Target Reward</StepTitle>,
    //   description: (
    //     <StepContent>
    //       There are three types of targets. Each type has a different bonus or
    //       penalty.
    //     </StepContent>
    //   ),
    //   target: () => refReward.current,
    // },
    // {
    //   title: <StepTitle>Target Reward</StepTitle>,
    //   description: (
    //     <StepContent>
    //       <b style={{ color: "#ff7f00" }}>
    //         Orange gives 0.1 cents of bonus/penalty.
    //       </b>
    //     </StepContent>
    //   ),
    //   target: () => refOrange.current,
    // },
    // {
    //   title: <StepTitle>Target Reward</StepTitle>,
    //   description: (
    //     <StepContent>
    //       <b style={{ color: "#00bfff" }}>
    //         Blue gives 2 cents of bonus/penalty.
    //       </b>
    //     </StepContent>
    //   ),
    //   target: () => refBlue.current,
    // },
    // {
    //   title: <StepTitle>Target Reward</StepTitle>,
    //   description: (
    //     <StepContent>
    //       <b style={{ color: "#00ff00" }}>
    //         Green gives 4 cents of bonus/penalty.
    //       </b>
    //     </StepContent>
    //   ),
    //   target: () => refGreen.current,
    // },
    {
      title: <StepTitle>Successful clicks</StepTitle>,
      description: (
        <StepContent>
          You will get a bonus if you successfully click the target. Click on
          the targets as quickly and accurately as possible. The faster you
          click, the closer you will get to the maximum bonus.
        </StepContent>
      ),
      target: () => refSuccess.current,
    },
    {
      title: <StepTitle>Failed clicks</StepTitle>,
      description: (
        <StepContent>
          You will get a penalty if you failed to click the target.
        </StepContent>
      ),
      target: () => refFail.current,
    },

    {
      title: <StepTitle>Circular Progress bar</StepTitle>,
      description: (
        <StepContent>
          After click, you have to hold the mouse shortly. Wait until a circular
          progress bar is fully filled. Moving the mouse will reset the progress
          bar.
        </StepContent>
      ),
      target: () => ref8.current,
    },
    {
      title: <StepTitle>Trials</StepTitle>,
      description: (
        <StepContent>
          The number of trials remaining in this session and the total number of
          trials.
        </StepContent>
      ),
      target: () => refTrials.current,
    },
    {
      title: <StepTitle>Sessions</StepTitle>,
      description: (
        <StepContent>The current session and all sessions.</StepContent>
      ),
      target: () => refSessions.current,
    },
    {
      title: <StepTitle>Total bonus</StepTitle>,
      description: (
        <StepContent>
          Total bonus you earned.{" "}
          <b>This amount will be paid as a Prolific bonus.</b>
        </StepContent>
      ),
      target: () => ref1.current,
    },
    {
      title: <StepTitle>Current Bonus</StepTitle>,
      description: (
        <StepContent>The amount of bonuses for this session.</StepContent>
      ),
      target: () => refCurrentBonus.current,
    },

    // {
    //   title: <StepTitle>Time Limits</StepTitle>,
    //   description: (
    //     <StepContent>
    //       You will perform the task for 15 minutes. Earn as many bonuses as
    //       possible before the time limit ends.
    //     </StepContent>
    //   ),
    //   target: () => ref3.current,
    // },
    // {
    //   title: <StepTitle>Target Bonus Information</StepTitle>,
    //   description: (
    //     <StepContent>
    //       Reminder: Orange gives 0.1 cents, Blue gives 2 cents, and Green gives
    //       4 cents.
    //     </StepContent>
    //   ),
    //   target: () => refRewardSettings.current,
    // },
  ];
  return (
    <>
      {!open && (
        <>
          <TaskSteps current={4} />
          <Content>
            <Space direction="vertical" style={{ width: 1000 }}>
              <Typography>
                <Typography.Title level={2}>Ready to begin?</Typography.Title>
                <Typography.Paragraph style={{ fontSize: 30 }}>
                  {/* Before the circular target appears on the screen, the bonus
                  for each trial is displayed. */}
                  You will get a bonus for successfully clicking on a target.
                  <br />
                  If you fail to click on the target, you will lose your bonus.
                  <br /> <br />
                  Click the below button to start.
                </Typography.Paragraph>
              </Typography>
              <Button
                size="large"
                type="primary"
                onClick={() => {
                  setOpen(true);
                }}
              >
                Start
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
          backgroundColor: "#1c1c1c",
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
            backgroundColor: "black",
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
          <div ref={refTrials}>Trials: 1/50</div>
          <div ref={refSessions}>Sessions: 1/6</div>
          <div ref={ref1}>Total Bonus: 1$</div>
          <div ref={refCurrentBonus}>Current Bonus: 1 cents</div>
          {/* <div ref={refRewardSettings}>
            <img src={reward_setting} width={300} />
          </div> */}
        </div>
        <div
          style={{
            display: currentGuideIndex !== 2 ? "none" : "flex",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(0%, -50%)",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          ref={ref6}
        >
          <img alt="money" src={task} />
        </div>
        <div
          ref={refReward}
          style={{
            display:
              currentGuideIndex !== 2 &&
              currentGuideIndex !== 3 &&
              currentGuideIndex !== 4 &&
              currentGuideIndex !== 5 &&
              "none",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            height: 150,
          }}
        >
          {/* <div
            style={{
              display:
                currentGuideIndex !== 2 &&
                currentGuideIndex !== 3 &&
                currentGuideIndex !== 4 &&
                currentGuideIndex !== 5 &&
                "none",
              position: "absolute",
              top: "50%",
              left: "20%",
              transform: "translate(-50%, -50%)",
              width: 100,
              height: 100,
              background: "#ff7f00",
              borderRadius: "100%",
            }}
            ref={refOrange}
          />
          <div
            style={{
              display:
                currentGuideIndex !== 2 &&
                currentGuideIndex !== 3 &&
                currentGuideIndex !== 4 &&
                currentGuideIndex !== 5 &&
                "none",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 100,
              height: 100,
              background: "#00bfff",
              borderRadius: "100%",
            }}
            ref={refBlue}
          />

          <div
            style={{
              display:
                currentGuideIndex !== 2 &&
                currentGuideIndex !== 3 &&
                currentGuideIndex !== 4 &&
                currentGuideIndex !== 5 &&
                "none",
              position: "absolute",
              top: "50%",
              left: "80%",
              transform: "translate(-50%, -50%)",
              width: 100,
              height: 100,
              background: "#00ff00",
              borderRadius: "100%",
            }}
            ref={refGreen}
          /> */}
        </div>
        <div
          style={{
            display: currentGuideIndex !== 1 && "none",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          ref={refSessionEnd}
        >
          <div>
            <MainTaskFont>
              The Reward for this session is 4 cents for each trial.
            </MainTaskFont>
            <MainTaskFont>Press Enter key to start.</MainTaskFont>
          </div>
        </div>

        <div
          style={{
            display: currentGuideIndex !== 3 && "none",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(0%, -50%)",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          ref={refSuccess}
        >
          <div>
            <MainTaskFont>+1.6 Cents</MainTaskFont>
          </div>
          <img alt="money" src={click_success} />
        </div>

        <div
          style={{
            display: currentGuideIndex !== 4 && "none",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(0%, -50%)",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          ref={refFail}
        >
          <div>
            <MainTaskFont style={{ color: "red" }}>-1.6 Cents</MainTaskFont>
          </div>
          <img alt="money" src={click_fail} />
        </div>

        <div
          style={{
            display: currentGuideIndex !== 0 ? "none" : "flex",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          ref={ref9}
        >
          <img alt="cursor" src={cusror} />
        </div>

        <div
          style={{
            display: currentGuideIndex !== 5 ? "none" : "flex",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          ref={ref8}
        >
          <img alt="cursor" src={progressBar} />
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
