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
    ],
    {
      basename: process.env.PUBLIC_URL,
    }
  );

  return (
    <RecoilRoot>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </RecoilRoot>
  );
}

export default App;
