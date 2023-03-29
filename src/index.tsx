import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./customCSS.css";

import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GNBWrapper from "./components/Common/GNB/Wrapper";

/** Own pages */
import ProblemBank from "./pages/ProblemBank";

const router = createBrowserRouter([
  {
    path: "/",
    element: <GNBWrapper />,
    children: [{ path: "/", element: <App /> }],
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
