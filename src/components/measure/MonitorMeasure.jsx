import { Button, Slider, Typography } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  behaviorLogState,
  monitorHeightInState,
  monitorState,
  monitorWidthInState,
  ppiState,
  prolificUserState,
} from "../../recoil/atom";
import Right from "../../images/right.png";
import Wrong from "../../images/wrong.png";
import Card from "../../images/card.png";
import Arrow from "../../images/arrow.png";
import QueryString from "qs";
import TaskSteps from "../TaskSteps";
import Paragraph from "antd/es/typography/Paragraph";

const MonitorMeasure = () => {
  const [monitor, setMonitor] = useRecoilState(monitorState);
  const width_in = useRecoilValue(monitorWidthInState);
  const height_in = useRecoilValue(monitorHeightInState);
  const [behaviorLog, setBehaviorLog] = useRecoilState(behaviorLogState);
  const ppi = useRecoilValue(ppiState);
  const [zoom, setZoom] = useState(window.devicePixelRatio);
  const [prolificUser, setProlificUser] = useRecoilState(prolificUserState);
  const location = useLocation();

  useEffect(() => {
    const qs = QueryString.parse(location.search, { ignoreQueryPrefix: true });
    setProlificUser(qs);
  }, [location]);

  const diagonal_in = useMemo(() => {
    return (
      Math.round(10 * Math.sqrt(width_in * width_in + height_in * height_in)) /
      10
    );
  });

  const setScale = (scale) => {
    setMonitor((old) => {
      return {
        ...old,
        scale: scale,
      };
    });
  };

  const handleResize = () => {
    if (window.devicePixelRatio !== 1) {
      alert("do not change device pixel ratio");
    }
    setZoom(window.devicePixelRatio);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    // return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setBehaviorLog((old) => {
      return {
        ...old,
        monitor: [
          ...old.monitor,
          {
            scale: monitor.scale,
            timestamp: Date.now(),
          },
        ],
      };
    });

    console.log(behaviorLog);
  }, [monitor]);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        minHeight: window.innerHeight,
        // justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <TaskSteps current={0} />
      <Typography.Title level={3}>Monitor Size Measurement</Typography.Title>
      <Paragraph level={2}>
        Place a physical credit card against the image of the card below and
        increase or decrease its size until it matches the size of the physical
        card exactly. <br />
        You can also use a library card or standard ID.
        <br />
        If you have multiple displays, please conduct the experiment only on the
        main monitor.
        <br />
      </Paragraph>

      {/* {`${diagonal_in} inch ${ppi}`} */}
      <div style={{ width: 300 }}>
        {/* <img
          src={Arrow}
          style={{ width: 30, marginRight : 10, transform: "rotate(90deg)" }}
        />
        <img src={Arrow} style={{ width: 30, transform: "rotate(-90deg)" }} /> */}
        <Slider
          tooltip={{ open: false }}
          step={0.001}
          min={0.5}
          max={2.3}
          value={monitor.scale}
          onChange={(e) => setScale(e)}
        />
        <Button.Group>
          <Button onClick={(e) => setScale(monitor.scale + 0.01)}>
            Increase
          </Button>
          <Button onClick={(e) => setScale(monitor.scale - 0.01)}>
            Decrease
          </Button>
        </Button.Group>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              margin: 30,
              borderRadius: `${0.125 * monitor.scale}in`,
              // border: "5px dotted black",
              opacity: 0.7,
            }}
          >
            <div
              style={{
                margin: 0,
                borderRadius: `${0.125 * monitor.scale}in`,
                width: `${3.375 * monitor.scale}in`,
                height: `${2.125 * monitor.scale}in`,
                backgroundImage: `url(${Card})`,
                color: "white",
                backgroundSize: "contain",
              }}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          border: "1px solid #aaa",
          borderRadius: 20,
          padding: 4,
          marginBottom: 16,
        }}
      >
        <Typography.Title level={4} style={{ margin: 0 }}>
          Examples
        </Typography.Title>
        <div style={{ display: "flex", gap: 50, margin: 16 }}>
          <img
            style={{
              width: 250,
            }}
            src={Wrong}
          />
          <img
            style={{
              width: 250,
            }}
            src={Right}
          />
        </div>
      </div>
      <Typography.Title level={5}>
        Do not refresh or close the web page during the experiment.
        <br />
        If you refresh or close the web page, the experiment will start again
        from the beginning.
      </Typography.Title>
      <Link
        to={`/measure?PROLIFIC_PID=${prolificUser.PROLIFIC_PID}&STUDY_ID=${prolificUser.STUDY_ID}&SESSION_ID=${prolificUser.SESSION_ID}`}
      >
        <Button type="primary" size="large" disabled={zoom !== 1}>
          {zoom === 1 ? "Next step" : "Please adjust the screen zoom to 100%."}
        </Button>
      </Link>
    </div>
  );
};

export default MonitorMeasure;
