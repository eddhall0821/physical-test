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
import { Link, useLocation } from "react-router-dom";
import { Button } from "antd";
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

ChartJS.register(...registerables);
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
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
  const [comment1, setComment1] = useState("");
  const [docId, setDocId] = useRecoilState(docIdState);
  const prolificUser = useRecoilValue(prolificUserState);

  useEffect(() => {
    const data = state.result;
    const dataPairs = data.map((x) => [x.difficulty, x.average]);
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
  }, [state.result]);

  const handleCreateAccount = async () => {
    // <p>ppi: {ppi}</p>
    // <p>user dpi: {dpi.userInput}</p>
    // <p>measure dpi: {dpi.measurement}</p>
    // <p>pointer weight: {pointerWeight}</p>
    // <p>height: {monitorBound.height}</p>
    // <p>width: {monitorBound.width}</p>
    // <p>top: {monitorBound.top}</p>
    // <p>left: {monitorBound.left}</p>
    // <p>a: {linearModel.m.toFixed(2)}</p>
    // <p>b: {linearModel.b.toFixed(2)}</p>

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
      comment1: comment1,
    };
    setLoading(true);
    const docRef = await addDoc(collection(db, "user"), docData);
    // .then(() => {
    //   console.log("success");
    //   setFinish(true);
    // })
    // .catch((err) => {
    //   alert("err!");
    // })
    // .finally(() => {
    //   setLoading(false);
    // });
    setLoading(false);
    if (docRef.id) {
      setFinish(true);
      setDocId(docRef.id);
    } else {
      alert("err!");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Create User Profile</h1>
      {/* {chartData.datasets && (
        <Scatter
          height="300px"
          width="300px"
          data={chartData}
          options={{
            responsive: false,
            scales: {},
          }}
        />
      )} */}
      <p>PROLIFIC_ID : {prolificUser.PROLIFIC_PID}</p>
      {/* <p>SESSION_ID : {prolificUser.SESSION_ID}</p>
      <p>scale: {monitor.scale}</p>
      <p>ppi: {ppi}</p>
      <p>user dpi: {dpi.userInput}</p>
      <p>measure dpi: {dpi.measurement}</p>
      <p>pointer weight: {pointerWeight}</p>
      <p>height: {monitorBound.height}</p>
      <p>width: {monitorBound.width}</p>
      <p>top: {monitorBound.top}</p>
      <p>left: {monitorBound.left}</p>
      <p>a: {linearModel.m.toFixed(2)}</p>
      <p>b: {linearModel.b.toFixed(2)}</p> */}
      <p>
        Please provide any comments before starting the main experiment.
        (optional)
      </p>
      <TextArea
        rows={2}
        style={{ width: 300 }}
        value={comment1}
        onChange={(e) => setComment1(e.target.value)}
        disabled={loading || finish}
      ></TextArea>
      <Button
        type="primary"
        size="large"
        onClick={() => handleCreateAccount()}
        disabled={loading || finish}
        style={{ margin: 10 }}
      >
        create profile
      </Button>
      <Link
        to={`/pnc?PROLIFIC_PID=${prolificUser.PROLIFIC_PID}&STUDY_ID=${prolificUser.STUDY_ID}&SESSION_ID=${prolificUser.SESSION_ID}`}
      >
        <Button type="primary" size="large" disabled={docId === ""}>
          NEXT STEP!
        </Button>
      </Link>
    </div>
  );
};

export default LinearRegression;
