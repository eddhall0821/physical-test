import { useState } from "react";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ENUM, dpiState, prolificUserState } from "../../recoil/atom";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Collapse, Input, Space, Switch, Typography } from "antd";
import Guide from "../../images/mouse_guide.png";
import { Content, Footer } from "antd/es/layout/layout";
import GuideGif from "../../images/mouse_guide.gif";

const Measure = () => {
  const [x, setX] = useState(0);
  const [dpi, setDpi] = useRecoilState(dpiState);
  const [isChanged, setIsChanged] = useState(false);
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
    <Content style={{ padding: "20px 20px", textAlign: "left" }}>
      <h1>
        Measuring mouse sensitivity is essential for accurate experiments.
        Please follow the steps.
      </h1>
      <Collapse accordion defaultActiveKey={["1"]} style={{ fontSize: 20 }}>
        <Collapse.Panel
          header="Step 1. turn off enhance pointer precision on windows PC."
          key="1"
        >
          <Link
            to="https://www.youtube.com/watch?v=Rtin60K_agI"
            target="_blank"
            rel="noopener noreferrer"
          >
            How to Turn Off Enhance Pointer Precision on Windows 10 PC
          </Link>
          <br />
          <br />
          <Link
            to="https://youtu.be/nrSOSOVYGnk?t=39"
            target="_blank"
            rel="noopener noreferrer"
          >
            How to Turn Off Enhance Pointer Precision on Windows 11 PC
          </Link>
        </Collapse.Panel>
        <Collapse.Panel header="Step 2. Measuring DPI." key="2">
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              onMouseDown={() => document.body.requestPointerLock()}
              style={{
                color: "white",
                textAlign: "center",
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                background: "#1E1E1E",
                width: "100%",
                height: 300,
                cursor: "grab",
              }}
            >
              {x ? (
                <p>Measuring.....</p>
              ) : (
                <p>
                  <b>Slowly</b> click and hold the screen <b>here</b> and move
                  the mouse <b>horizontally</b> the size of the card (3.37
                  inches / 8.56 cm).
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
          header="Step 3. If you know your mouse dpi, please enter it.
          (optional)"
          key="3"
        >
          <Space>
            <Switch
              checked={dpi.isUserKnow}
              checkedChildren="I know my mouse dpi"
              unCheckedChildren="I don't know my mouse dpi"
              onChange={() => setDpiState(ENUM.IS_USER_KNOW, !dpi.isUserKnow)}
            />
            <Input
              suffix="DPI"
              disabled={!dpi.isUserKnow}
              type="number"
              value={dpi.userInput}
              onChange={(e) => setDpiState(ENUM.USER_INPUT, e.target.value)}
            />
          </Space>
        </Collapse.Panel>
        <Collapse.Panel
          header="Step 4. Please write down the approximate distance between your eyes and the monitor."
          key="4"
        >
          <Space>
            <Input />
          </Space>
        </Collapse.Panel>
      </Collapse>
      {/* <Space
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          userSelect: "none",
          flexDirection: "column",
        }}
      >
        <p style={{ width: 600 }}>
          Measuring mouse sensitivity is essential for accurate experiments. To
          measure mouse sensitivity, you must drag the mouse the width of a
          credit card (3.37 inches, 8.56cm). Make sure enhance pointer precision
          is disabled in windows settings. Please enter the mouse sensitivity if
          you know it before measuring it. When you're ready, click on the black
          box and drag your mouse the length of your credit card.
        </p>
        <p>step1. turn off enhance pointer precision on windows PC.</p>
        <Link
          to="https://www.youtube.com/watch?v=Rtin60K_agI"
          target="_blank"
          rel="noopener noreferrer"
        >
          How to Turn Off Enhance Pointer Precision on Windows PC
        </Link>
        <p>step2. Measuring DPI.</p>
        <Link
          to="https://www.youtube.com/watch?v=Rtin60K_agI"
          target="_blank"
          rel="noopener noreferrer"
        >
          How to measuring Mouse DPI
        </Link>
        <img
          style={{
            width: 350,
          }}
          src={Guide}
        />
        <Typography>x : {Math.round(Math.abs(x) / 3.375)}</Typography>
        <Typography>dpi : {dpi.measurement}</Typography>
        <div
          onMouseDown={() => document.body.requestPointerLock()}
          style={{
            color: "white",
            textAlign: "center",
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
            background: "#1E1E1E",
            width: 300,
            height: 300,
          }}
        >
          {x ? "MEASUREING....." : "click here"}
        </div>
        <p>If you know the mouse dpi, enter it(optional)</p>
        <Switch
          checked={dpi.isUserKnow}
          checkedChildren="I know my mouse dpi"
          unCheckedChildren="I don't know my mouse dpi"
          onChange={() => setDpiState(ENUM.IS_USER_KNOW, !dpi.isUserKnow)}
        />
        <Input
          suffix="DPI"
          disabled={!dpi.isUserKnow}
          type="number"
          value={dpi.userInput}
          onChange={(e) => setDpiState(ENUM.USER_INPUT, e.target.value)}
        />

        <Link to="/pointing">
          <Button type="primary" size="large" disabled={dpi === 0}>
            {dpi === 0 && "you have to measure"}
            {dpi !== 0 && "NEXT STEP!"}
          </Button>
        </Link>
      </Space> */}
      <Footer style={{ textAlign: "center" }}>
        <h2>Do not refresh or close the web page during the experiment.</h2>
        <Link
          to={`/pointing?PROLIFIC_PID=${prolificUser.PROLIFIC_PID}&STUDY_ID=${prolificUser.STUDY_ID}&SESSION_ID=${prolificUser.SESSION_ID}`}
        >
          <Button type="primary" size="large" disabled={dpi.measurement === 0}>
            {dpi.measurement === 0 && "you have to measure"}
            {dpi.measurement !== 0 && "NEXT STEP!"}
          </Button>
        </Link>
      </Footer>
    </Content>
  );
};

export default Measure;
