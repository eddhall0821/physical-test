import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import MTPCanvas from "./components/MTP/MTPCanvas";
import "./firebaseConfig";
import MTPReplay from "./components/MTP/MTPReplay";
import Measure from "./components/measure";
import MonitorMeasure from "./components/measure/MonitorMeasure";
import { RecoilRoot } from "recoil";
import ScreenCheck from "./components/measure/ScreenCheck";
import MTPTest from "./components/MTP/MTPTest";
import LinearRegressionComponent from "./components/measure/LinearRegression";
import PointingTest from "./components/MTP/PointingTest";
import Simulator from "./components/simulator/Simulator";
import { ConfigProvider } from "antd";
import MainGuideLines from "./components/MTP/MainGuideLines";

function App() {
  const router = createBrowserRouter(
    [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "pnc",
        element: <MTPCanvas />,
      },
      {
        path: "replay",
        element: <MTPReplay />,
      },
      {
        path: "measure",
        element: <Measure />,
      },
      {
        path: "monitor",
        element: <MonitorMeasure />,
      },
      {
        path: "check",
        element: <ScreenCheck />,
      },
      {
        path: "test",
        element: <MTPTest />,
      },
      {
        path: "linear",
        element: <LinearRegressionComponent />,
      },
      {
        path: "pointing",
        element: <PointingTest />,
      },
      {
        path: "simulator",
        element: <Simulator />,
      },
      {
        path: "main-guidelines",
        element: <MainGuideLines />,
      },
      {},
    ],
    {
      basename: process.env.PUBLIC_URL,
    }
  );

  return (
    <RecoilRoot>
      <div className="App">
        <ConfigProvider
          theme={{
            components: {
              Slider: {
                railSize: 10,
                handleSize: 15,
                handleSizeHover: 17,
              },
              Form: {
                labelFontSize: 20,
                // verticalLabelMargin: "0 0 8px",
              },
            },
          }}
        >
          <RouterProvider router={router} />
        </ConfigProvider>
      </div>
    </RecoilRoot>
  );
}

export default App;
