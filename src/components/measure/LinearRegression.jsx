import React, { useState, useEffect } from "react";
import { Scatter } from "react-chartjs-2";
import { linearRegression } from "simple-statistics";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  BarElement,
  registerables,
} from "chart.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Rate,
  Select,
  Space,
} from "antd";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  docIdState,
  dpiState,
  mointorBoundState,
  monitorState,
  pointerWeightState,
  ppiState,
  prolificUserState,
} from "../../recoil/atom";
import { addDoc, doc, collection } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import TextArea from "antd/es/input/TextArea";
import { FrownOutlined, MehOutlined, SmileOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import TaskSteps from "../TaskSteps";

ChartJS.register(...registerables);
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

const customIcons = {
  1: <FrownOutlined />,
  2: <FrownOutlined />,
  3: <MehOutlined />,
  4: <SmileOutlined />,
  5: <SmileOutlined />,
};

const suffixSelector = (
  <Form.Item name={["user", "suffix"]} noStyle>
    <Select style={{ width: 80 }}>
      <Select.Option value="inch">inch</Select.Option>
      <Select.Option value="cm">cm</Select.Option>
    </Select>
  </Form.Item>
);

const LinearRegression = () => {
  const { state } = useLocation();
  const [chartData, setChartData] = useState({});
  const [linearModel, setLinearModel] = useState({ m: 0, b: 0 });
  const monitor = useRecoilValue(monitorState);
  const ppi = useRecoilValue(ppiState);
  const dpi = useRecoilValue(dpiState);
  const pointerWeight = useRecoilValue(pointerWeightState);
  const monitorBound = useRecoilValue(mointorBoundState);
  const [loading, setLoading] = useState(false);
  const [finish, setFinish] = useState(false);
  const [docId, setDocId] = useRecoilState(docIdState);
  const prolificUser = useRecoilValue(prolificUserState);
  const navigate = useNavigate();

  const validateMessages = {
    required: "required!",
  };

  useEffect(() => {
    if (state?.result) {
      const data = state.result;
      const dataPairs = data?.map((x) => [x.difficulty, x.average]);
      const { m, b } = linearRegression(dataPairs);
      const scatterData = data.map((x) => ({ x: x.difficulty, y: x.average }));
      const lineOfBestFit = data.map((x) => ({
        x: x.difficulty,
        y: m * x.difficulty + b,
      }));

      setChartData({
        datasets: [
          {
            label: "Data Points",
            data: scatterData,
            backgroundColor: "rgba(99, 132, 255, 0.6)",
            pointBorderColor: "rgba(99, 132, 255, 1)",
            pointBackgroundColor: "rgba(99, 132, 255, 1)",
            pointRadius: 5,
            type: "scatter",
          },
          {
            label: "Line of Best Fit",
            data: lineOfBestFit,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            type: "line",
            fill: false,
          },
          {
            type: "bar",
            data: [
              {
                x: (400 - b) / m,
                y: 400,
              },
              {
                x: (1000 - b) / m,
                y: 1000,
              },
            ],
          },
        ],
      });

      setLinearModel({ m, b });
    }
  }, [state?.result]);

  const onFinish = async (e) => {
    const user = { ...e.user, age: e.user.age.year() };
    await handleCreateAccount(user);
  };

  const handleCreateAccount = async (user) => {
    const docData = {
      prolific_id: prolificUser.PROLIFIC_PID,
      session_id: prolificUser.SESSION_ID,
      ppi,
      user_dpi: dpi.userInput,
      measure_dpi: dpi.measurement,
      pointer_weight: pointerWeight,
      height: monitorBound.height,
      width: monitorBound.height,
      top: monitorBound.top,
      left: monitorBound.left,
      a: linearModel.m.toFixed(2),
      b: linearModel.b.toFixed(2),
      user,
    };
    setLoading(true);
    console.log(docData);
    if (docData.prolific_id && docData.session_id) {
      const docRef = await addDoc(collection(db, "user"), docData);
      console.log(docRef);
      if (docRef.id) {
        setFinish(true);
        setDocId(docRef.id);
      } else {
        alert("err!");
      }
    } else {
      alert("prolific id error.");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (finish) {
      navigate(
        `/main-guidelines?PROLIFIC_PID=${prolificUser.PROLIFIC_PID}&STUDY_ID=${prolificUser.STUDY_ID}&SESSION_ID=${prolificUser.SESSION_ID}`
      );
    }
  }, [finish]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TaskSteps current={3} />
      <h1>User Survey</h1>
      <Content>
        <Form
          disabled={loading || finish}
          size="large"
          style={{ maxWidth: 1000, textAlign: "left" }}
          layout="vertical"
          name="nest-messages"
          onFinish={onFinish}
          validateMessages={validateMessages}
          initialValues={{
            user: { feeling: 3, suffix: "inch" },
          }}
        >
          <Form.Item name={["user"]} label="Prolific ID">
            <p>{prolificUser.PROLIFIC_PID}</p>
          </Form.Item>
          <Form.Item
            name={["user", "age"]}
            label="Age of birth"
            rules={[{ required: true }]}
          >
            <DatePicker picker="year" format={"YYYY"} />
          </Form.Item>
          <Form.Item
            name={["user", "Sex"]}
            label="What is your gender?"
            rules={[{ required: true }]}
          >
            {/* https://www.psychologytoday.com/ca/blog/the-science-behind-behavior/201609/how-should-market-researchers-ask-about-gender-in-surveys */}
            <Radio.Group>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
              <Radio value="other">Other</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name={["user", "glasses"]}
            label="Are you wearing glasses?"
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Radio value={1}>Yes</Radio>
              <Radio value={0}>No</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name={["user", "education"]}
            label="What is your highest level of education?"
            rules={[{ required: true }]}
          >
            <Radio.Group
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <Radio value={1}>Middle School</Radio>
              <Radio value={2}>High School</Radio>
              <Radio value={3}>Technical School</Radio>
              <Radio value={4}>Some College</Radio>
              <Radio value={5}>Bachelor's Degree</Radio>
              <Radio value={6}>Master's Degree</Radio>
              <Radio value={7}>Doctorate Degree</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name={["user", "game_week"]}
            label="How many hours a week do you play video games?"
            rules={[{ required: true }]}
          >
            <Radio.Group
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <Radio value={1}>0-3</Radio>
              <Radio value={2}>4-7</Radio>
              <Radio value={3}>8-11</Radio>
              <Radio value={4}>12-15</Radio>
              <Radio value={5}>16 or more</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name={["user", "monitor_distance"]}
            label="Please enter the approximate distance between your eyes and the monitor."
            rules={[{ required: true }]}
          >
            <InputNumber addonAfter={suffixSelector} />
          </Form.Item>
          <Form.Item
            name={["user", "feeling"]}
            label="How are you feeling right now?"
            rules={[{ required: true }]}
          >
            <Rate character={({ index = 0 }) => customIcons[index + 1]} />
          </Form.Item>
          <Form.Item
            name={["user", "comment"]}
            label="If you have any comments, please write them down. (optional)"
          >
            <TextArea />
          </Form.Item>

          <Form.Item>
            <div style={{ textAlign: "center" }}>
              <Button
                type="primary"
                size="large"
                loading={loading || finish}
                style={{ margin: 10, textAlign: "center" }}
                htmlType="submit"
              >
                Submit Survey
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Content>

      {/* <Button
        type="primary"
        size="large"
        onClick={() => handleCreateAccount()}
        loading={loading || finish}
        style={{ margin: 10 }}
      >
        create profile
      </Button> */}
      {/* <Link
        to={`/pnc?PROLIFIC_PID=${prolificUser.PROLIFIC_PID}&STUDY_ID=${prolificUser.STUDY_ID}&SESSION_ID=${prolificUser.SESSION_ID}`}
      >
        <Button type="primary" size="large" disabled={docId === ""}>
          NEXT STEP!
        </Button>
      </Link> */}
    </div>
  );
};

export default LinearRegression;
