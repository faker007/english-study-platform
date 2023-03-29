import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./customCSS.css";

import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

/** Own pages */
import ProblemBank from "./pages/ProblemBank";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/problem-bank",
    element: <ProblemBank />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
