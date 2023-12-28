import { Button, Card, Input, Slider, Space, Typography } from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { dpiState, ppiState } from "../../recoil/atom";
const { Text, Link } = Typography;

const Description = ({ setSettings, setIsSettingMode, isSettingMode }) => {
  const [name, setName] = useState("player");
  const [trial, setTrial] = useState(3);
  const [lowerBound, setLowerBound] = useState(300);
  const [upperBound, setUpperBound] = useState(1000);
  const dpi = useRecoilValue(dpiState);
  const ppi = useRecoilValue(ppiState);

  useEffect(() => {
    if (lowerBound > upperBound) {
      setLowerBound(upperBound - 1);
    }

    if (lowerBound < 0) {
      setLowerBound(0);
    }
  }, [upperBound]);

  useEffect(() => {
    if (lowerBound > upperBound) {
      setUpperBound(lowerBound + 1);
    }

    if (upperBound < 0) {
      setUpperBound(0);
    }
  }, [lowerBound]);

  useEffect(() => {
    setSettings({
      name,
      trial,
      lowerBound,
      upperBound,
    });
  }, [lowerBound, upperBound, trial, name]);

  return (
    <Card
      style={{
        display: isSettingMode ? "block" : "none",
        left: "50%",
        top: "50%",
        transform: "translateX(-50%) translateY(-50%)",
        margin: "0 auto",
        background: "white",
        position: "fixed",
        zIndex: 9999,
        height: "100%",
        overflowY: "auto",
      }}
    >
      <Space direction="vertical" style={{ width: "100%", textAlign: "left" }}>
        <Title level={2}>developer settings</Title>
        <Text>name</Text>
        <Input value={name} onChange={(e) => setName(e.target.value)} />

        <Text>monitor PPI</Text>
        <Input type="number" disabled value={ppi} />
        <Text>mouse DPI</Text>
        <Input type="number" disabled value={dpi.measurement} />

        <Text>Trial</Text>
        <Input type="number" disabled value={trial} />
        <Slider
          min={3}
          max={10000}
          step={3}
          value={trial}
          onChange={(e) => setTrial(e)}
        />

        <Text>lower bound</Text>
        <Input type="number" disabled value={lowerBound} addonAfter="px" />
        <Slider
          min={0}
          max={1920}
          value={lowerBound}
          onChange={(e) => setLowerBound(e)}
        />

        <Text>upper bound</Text>
        <Input type="number" disabled value={upperBound} addonAfter="px" />
        <Slider
          min={0}
          max={1920}
          value={upperBound}
          onChange={(e) => setUpperBound(e)}
        />
        <div
          style={{
            backgroundColor: "#efefef",
            width: 640,
            paddingTop: "56.25%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: upperBound / 3,
              height: upperBound / 3,
              position: "absolute",
              borderRadius: "100%",
              top: 180 - upperBound / 3 / 2,
              left: 320 - upperBound / 3 / 2,
              backgroundColor: "green",
            }}
          />
          <div
            style={{
              width: lowerBound / 3,
              height: lowerBound / 3,
              position: "absolute",
              borderRadius: "100%",
              top: 180 - lowerBound / 3 / 2,
              left: 320 - lowerBound / 3 / 2,
              backgroundColor: "#efefef",
            }}
          />
          <div
            style={{
              width: 5,
              height: 5,
              position: "absolute",
              borderRadius: 100,
              top: `calc(50% - 2.5px)`,
              left: `calc(50% - 2.5px)`,
              backgroundColor: "blue",
            }}
          />
        </div>
        <Button
          block
          type="primary"
          onClick={() => {
            setIsSettingMode(false);
          }}
        >
          save
        </Button>
      </Space>
    </Card>
  );
};

export default Description;
