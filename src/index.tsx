import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GNBWrapper from "./components/Common/GNB/Wrapper";
import Login from "./pages/login";
import Router from "./pages/router";
import StudentList from "./pages/students/list";
import Students from "./pages/students";
import StudentGroup from "./pages/students/group";
import { RecoilRoot } from "recoil";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Router />,
    children: [
      {
        path: "/",
        element: <GNBWrapper />,
        children: [
          { path: "/", element: <App /> },
          {
            path: "students",
            element: <Students />,
            children: [
              { path: "list", element: <StudentList /> },
              { path: "group", element: <StudentGroup /> },
            ],
          },
        ],
      },
      { path: "/login", element: <Login /> },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>
);
