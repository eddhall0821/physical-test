import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import ReactionCanvas from "./components/reaction/ReactionCanvas";
import RhythmCanvas from "./components/rhythm/RhythmCanvas";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/reaction",
      element: <ReactionCanvas />,
    },
    {
      path: "/rhythm",
      element: <RhythmCanvas />,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
