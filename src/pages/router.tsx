import { onAuthStateChanged } from "firebase/auth";
import { useLayoutEffect } from "react";
import { Outlet } from "react-router-dom";
import { fbAuth } from "../firebase";

export default function Router() {
  useLayoutEffect(() => {
    onAuthStateChanged(fbAuth, (user) => {
      console.log(user, ":USER");
    });
  }, []);

  return <Outlet />;
}
