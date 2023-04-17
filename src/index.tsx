import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GNBWrapper from "./components/Common/GNB/Wrapper";
import Login from "./pages/login";
import Router, { IToken } from "./pages/router";
import StudentList from "./pages/students/list";
import Students from "./pages/students";
import StudentGroup from "./pages/students/group";
import { RecoilRoot } from "recoil";
import { userState } from "./stores/user";
import { LOCALSTORAGE_USER_TOKEN } from "./constants/Login";

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
    <RecoilRoot
      initializeState={({ set }) => {
        const tokenString = localStorage.getItem(LOCALSTORAGE_USER_TOKEN);
        if (tokenString) {
          const { data } = JSON.parse(tokenString) as IToken;
          set(userState, data);
        }
      }}
    >
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>
);
