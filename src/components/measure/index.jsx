import { useState } from "react";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ENUM, dpiState, prolificUserState } from "../../recoil/atom";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Checkbox,
  Collapse,
  Input,
  InputNumber,
  Radio,
  Space,
  Switch,
  Typography,
} from "antd";
import Guide from "../../images/mouse_guide.png";
import { Content, Footer } from "antd/es/layout/layout";
import GuideGif from "../../images/mouse_guide.gif";
import TaskSteps from "../TaskSteps";

const Measure = () => {
  const [x, setX] = useState(0);
  const [dpi, setDpi] = useRecoilState(dpiState);
  const [isChanged, setIsChanged] = useState(false);
  const [unit, setUnit] = useState("cm");
  const prolificUser = useRecoilValue(prolificUserState);

  useEffect(() => {
    if (isChanged) {
      const current_dpi = Math.round(Math.abs(x) / 3.375);
      if (current_dpi > 3200) {
        alert("extreme high DPI");
      }
      if (current_dpi < 400) {
        alert("extreme low DPI");
      }

      setDpiState(ENUM.MEASUREMENT, current_dpi);
      setX(0);
    }
  }, [isChanged]);

  const setDpiState = (key, input) => {
    setDpi((old) => {
      return {
        ...old,
        [key]: input,
      };
    });
  };

  const exitPointerLock = () => {
    if (document.pointerLockElement) {
      document.exitPointerLock();
      setIsChanged(true);
    }
  };

  useEffect(() => {
    document.addEventListener(
      "pointerlockchange",
      () => {
        if (document.pointerLockElement === document.body) {
          document.addEventListener("mousemove", PLMouseMove, false);
        } else {
          document.removeEventListener("mousemove", PLMouseMove, false);
        }
      },
      false
    );

    document.addEventListener("mouseup", exitPointerLock);

    function PLMouseMove(e) {
      if (document.pointerLockElement === document.body) {
        setIsChanged(false);
        setX((old) => {
          return (old += e.movementX);
        });
      }
    }

    return () => {
      document.removeEventListener("mouseup", exitPointerLock);
    };
  }, []);

  return (
    <>
      <TaskSteps current={1} />
      <Content style={{ padding: "0px 20px", textAlign: "left" }}>
        <Typography.Title level={3}>
          Mouse Sensitivity Measurement
        </Typography.Title>
        <Typography.Paragraph>
          It is important to accurately measure mouse sensitivity in
          experiments.
          <br />
          The measured mouse sensitivity will influence future experimental
          procedures.
          <br />
          Please follow the steps carefully.
        </Typography.Paragraph>
        <Collapse accordion defaultActiveKey={["1"]}>
          <Collapse.Panel
            header={
              <span>
                <b>Step 1.</b> Disable 'Enhance Pointer Precision' option in
                your PC settings.
              </span>
            }
            key="1"
          >
            <Link
              to="https://www.youtube.com/watch?v=Rtin60K_agI"
              target="_blank"
              rel="noopener noreferrer"
            >
              How to Disable 'Enhance Pointer Precision' on Windows 10
            </Link>
            <br />
            <br />
            <Link
              to="https://youtu.be/nrSOSOVYGnk?t=39"
              target="_blank"
              rel="noopener noreferrer"
            >
              How to Disable 'Enhance Pointer Precision' on Windows 11
            </Link>
          </Collapse.Panel>
          <Collapse.Panel
            header={
              <span>
                <b>Step 2.</b> Measure mouse sensitivity.
              </span>
            }
            key="2"
          >
            <p>
              1. Left-click on the <b style={{ color: "#da2c4d" }}>red box</b>{" "}
              and hold the mouse left-click button down.
              <br />
              2. Slowly move the mouse from left to right along the width of the
              card. (3.37 inches/8.56 cm).
              <br />
              3. Release the left-click button.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div
                onMouseDown={() => document.body.requestPointerLock()}
                style={{
                  color: "white",
                  textAlign: "center",
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                  background: "#da2c4d",
                  width: 400,
                  height: 300,
                  cursor: "grab",
                  border: "5px dotted black",
                  borderRadius: 10,
                }}
              >
                {x ? (
                  <p>Now Slowly Move Your Mouse Horizontally</p>
                ) : (
                  <p>
                    <span style={{ fontSize: 40 }}>🖱️</span>
                    <br />
                    Start Measuring by Clicking Here
                  </p>
                )}
              </div>
              {/* <img
              style={{
                width: 350,
              }}
              src={Guide}
            /> */}
              <img
                alt="example"
                style={{
                  width: 350,
                }}
                src={GuideGif}
              />
            </div>
            {/* <Typography>x : {Math.round(Math.abs(x) / 3.375)}</Typography> */}
            {dpi && <p>dpi : {dpi.measurement}</p>}
          </Collapse.Panel>
          <Collapse.Panel
            header={
              <span>
                <b>Step 3.</b> If you know your mouse dpi, please enter it.
                (optional)
              </span>
            }
            key="3"
          >
            <Space>
              <Input
                suffix="DPI"
                disabled={!dpi.isUserKnow}
                type="number"
                value={dpi.userInput}
                onChange={(e) => setDpiState(ENUM.USER_INPUT, e.target.value)}
              />
              <Checkbox
                onChange={() => setDpiState(ENUM.IS_USER_KNOW, !dpi.isUserKnow)}
              >
                I don't know my mouse DPI.
              </Checkbox>
            </Space>
          </Collapse.Panel>
        </Collapse>
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <Typography.Title level={4}>
            Do not refresh or close the web page during the experiment.
            <br />
            If you refresh or close the web page, the experiment will start
            again from the beginning.
          </Typography.Title>
          <Link
            to={`/pointing?PROLIFIC_PID=${prolificUser.PROLIFIC_PID}&STUDY_ID=${prolificUser.STUDY_ID}&SESSION_ID=${prolificUser.SESSION_ID}`}
          >
            <Button
              type="primary"
              size="large"
              disabled={dpi.measurement === 0}
            >
              {dpi.measurement === 0 && "You have to measure."}
              {dpi.measurement !== 0 && "Start Pre-task"}
            </Button>
          </Link>
        </div>
      </Content>
    </>
  );
};

export default Measure;
