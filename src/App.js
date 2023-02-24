import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import MTPCanvas from "./components/MTP/MTPCanvas";
import PointingCanvas from "./components/pointing/PointingCanvas";
import ReactionCanvas from "./components/reaction/ReactionCanvas";
import RhythmCanvas from "./components/rhythm/RhythmCanvas";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/pointing",
      element: <PointingCanvas />,
    },
    {
      path: "/reaction",
      element: <ReactionCanvas />,
    },
    {
      path: "/rhythm",
      element: <RhythmCanvas />,
    },
    {
      path: "/MTP",
      element: <MTPCanvas />,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
