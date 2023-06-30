import "./index.css";
import "./customCSS.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";

import App from "./App";
import GNBWrapper from "./components/Common/GNB/Wrapper";
import { LOCALSTORAGE_USER_TOKEN } from "./constants/Login";
/** Own pages */
import Login from "./pages/login";
import ProblemBank from "./pages/ProblemBank";
import Router, { IToken } from "./pages/router";
import Students from "./pages/students";
import StudentGroup from "./pages/students/group";
import StudentList from "./pages/students/list";
import Teachers from "./pages/teachers";
import TeacherGroup from "./pages/teachers/group";
import TeacherList from "./pages/teachers/list";
import TestFolder from "./pages/TestFolder";
import { userState } from "./stores/user";

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
          {
            path: "teachers",
            element: <Teachers />,
            children: [
              { path: "list", element: <TeacherList /> },
              { path: "group", element: <TeacherGroup /> },
            ],
          },
          {
            path: "/problem-bank",
            element: <ProblemBank />,
          },
          {
            path: "/test-folder",
            element: <TestFolder />,
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
