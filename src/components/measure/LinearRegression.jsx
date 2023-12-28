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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Linear Regression Graph</h1>
      {chartData.datasets && (
        <Scatter
          height="500px"
          width="500px"
          data={chartData}
          options={{
            responsive: false,
            scales: {
              // y: {
              //   min: 0,
              //   max: 2000,
              //   stepSize: 500,
              // },
              // x: {
              //   min: 0,
              //   max: 8,
              // },
            },
          }}
        />
      )}
      <p>
        Equation of the line: y = {linearModel.m.toFixed(2)}x +{" "}
        {linearModel.b.toFixed(2)}
      </p>
      <Button type="primary" size="large">
        <Link to="/pnc">NEXT STEP!</Link>
      </Button>
    </div>
  );
};

export default LinearRegression;
