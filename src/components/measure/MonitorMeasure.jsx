import { Button, Slider } from "antd";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  monitorHeightInState,
  monitorState,
  monitorWidthInState,
  ppiState,
  prolificUserState,
} from "../../recoil/atom";
import Right from "../../images/right.png";
import Wrong from "../../images/wrong.png";
import QueryString from "qs";

const MonitorMeasure = () => {
  const [monitor, setMonitor] = useRecoilState(monitorState);
  const width_in = useRecoilValue(monitorWidthInState);
  const height_in = useRecoilValue(monitorHeightInState);
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

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: window.innerHeight,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <p style={{ width: 1000, fontSize: 20 }}>
        <br /> Place a physical credit card against the image of the card on the
        screen and adjust its size until they match.
        <br />
        You can also use a debit card, library card, standard ID or ruler.
        <br />
        If using multiple monitors, don't switch monitors after measuring.
      </p>
      {/* {`${diagonal_in} inch ${ppi}`} */}
      <div style={{ width: 300 }}>
        <Slider
          step={0.001}
          min={0.5}
          max={2.3}
          value={monitor.scale}
          onChange={(e) => setScale(e)}
        />
        <Button.Group>
          <Button onClick={(e) => setScale(monitor.scale + 0.01)}>
            increase
          </Button>
          <Button onClick={(e) => setScale(monitor.scale - 0.01)}>
            decrease
          </Button>
        </Button.Group>
      </div>
      <div style={{ display: "flex", gap: 50 }}>
        <img
          style={{
            width: 350,
          }}
          src={Wrong}
        />
        <div
          style={{
            margin: 30,
            borderRadius: 10,
            width: `${3.375 * monitor.scale}in`,
            height: `${2.125 * monitor.scale}in`,
            background: "blue",
            color: "white",
          }}
        >
          CREDIT CARD
          <br />
          3.37 inch
          <br />
          8.56 cm
        </div>
        <img
          style={{
            width: 350,
          }}
          src={Right}
        />
      </div>
      <Link
        to={`/measure?PROLIFIC_PID=${prolificUser.PROLIFIC_PID}&STUDY_ID=${prolificUser.STUDY_ID}&SESSION_ID=${prolificUser.SESSION_ID}`}
      >
        <Button type="primary" size="large" disabled={zoom !== 1}>
          {zoom === 1 ? "NEXT STEP!" : "Please adjust the screen zoom to 100%."}
        </Button>
      </Link>
    </div>
  );
};

export default MonitorMeasure;
