import { Button, Slider } from "antd";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  monitorHeightInState,
  monitorState,
  monitorWidthInState,
  ppiState,
} from "../../recoil/atom";

const MonitorMeasure = () => {
  const [monitor, setMonitor] = useRecoilState(monitorState);
  const width_in = useRecoilValue(monitorWidthInState);
  const height_in = useRecoilValue(monitorHeightInState);
  const ppi = useRecoilValue(ppiState);
  const [zoom, setZoom] = useState(window.devicePixelRatio);

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
      <p style={{ width: 800 }}>
        To calibrate place a physical credit card against the image of the card
        below and increase or decrease its size until it matches the size of the
        physical card exactly. Once both have the same size the calibration is
        complete and you can read the display dimensions above. If you don't
        have physical card you can use debit card, library card or a standard
        ID.
      </p>
      <p>
        If you are using multiple monitors, do not change the monitor you use
        once the measurement is completed.
      </p>
      {`${diagonal_in} inch ${ppi}`}
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
      </div>
      <Link to="/measure">
        <Button type="primary" size="large" disabled={zoom !== 1}>
          {zoom === 1 ? "NEXT STEP!" : "Please adjust the screen zoom to 100%."}
        </Button>
      </Link>
    </div>
  );
};

export default MonitorMeasure;
