import { Button, Slider } from "antd";
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
    console.log(monitor);
  }, [monitor]);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        minHeight: window.innerHeight,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <p style={{ width: 1000, fontSize: 20 }}>
        Place a physical credit card against the image of the card on the screen
        and adjust its size until they match.
        <br />
        You can also use a debit card, library card, standard ID or ruler.
        <br />
        If using multiple monitors, don't switch monitors after measuring.
        <br />
      </p>

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
              width: `${3.375 * monitor.scale}in`,
              height: `${2.125 * monitor.scale}in`,
              backgroundImage: `url(${Card})`,
              color: "white",
              backgroundSize: "contain",
            }}
          />
        </div>
      </div>
      <div
        style={{
          border: "1px solid black",
          borderRadius: 20,
          padding: 4,
          marginBottom: 16,
        }}
      >
        <h3>Examples</h3>
        <div style={{ display: "flex", gap: 50, margin: 10 }}>
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
      <h2>Do not refresh or close the web page during the experiment.</h2>
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
