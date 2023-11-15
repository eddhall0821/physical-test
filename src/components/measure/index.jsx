import { useState } from "react";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { ENUM, dpiState } from "../../recoil/atom";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Input, Space, Switch, Typography } from "antd";

const Measure = () => {
  const [x, setX] = useState(0);
  const [dpi, setDpi] = useRecoilState(dpiState);
  const [isChanged, setIsChanged] = useState(false);

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
    <Card>
      <Space
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          userSelect: "none",
          flexDirection: "column",
        }}
      >
        <Typography>input your dpi.</Typography>
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
          {x ? "MEASUREING....." : ""}
        </div>
        <Button type="primary" size="large">
          <Link to="/pointing">NEXT STEP!</Link>
        </Button>
      </Space>
    </Card>
  );
};

export default Measure;
