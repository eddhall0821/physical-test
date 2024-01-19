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
import Done from "./components/MTP/Done";
import { useEffect } from "react";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const routerData = [
    {
      path: "",
      element: <Home />,
      withAuth: false,
    },
    {
      path: "pnc",
      element: <MTPCanvas />,
      withAuth: true,
    },
    {
      path: "replay",
      element: <MTPReplay />,
      withAuth: true,
    },
    {
      path: "measure",
      element: <Measure />,
      withAuth: true,
    },
    {
      path: "monitor",
      element: <MonitorMeasure />,
      withAuth: false,
    },
    {
      path: "check",
      element: <ScreenCheck />,
      withAuth: true,
    },
    {
      path: "test",
      element: <MTPTest />,
      withAuth: true,
    },
    {
      path: "linear",
      element: <LinearRegressionComponent />,
      withAuth: true,
    },
    {
      path: "pointing",
      element: <PointingTest />,
      withAuth: true,
    },
    {
      path: "simulator",
      element: <Simulator />,
      withAuth: true,
    },
    {
      path: "main-guidelines",
      element: <MainGuideLines />,
      withAuth: true,
    },
    {
      path: "done",
      element: <Done />,
      withAuth: true,
    },
  ];
  const router = createBrowserRouter(
    routerData.map((router) => {
      if (!router.withAuth) {
        return {
          path: router.path,
          element: router.element,
        };
      } else {
        return {
          path: router.path,
          element: <PrivateRoute>{router.element}</PrivateRoute>,
          // element: router.element,
        };
      }
    }),
    {
      basename: process.env.PUBLIC_URL,
    }
  );

  return (
    <RecoilRoot>
      <div className="App">
        <ConfigProvider
          theme={{
            token: {
              // fontSize: 16,
            },
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
