import { onAuthStateChanged } from "firebase/auth";
import { useLayoutEffect } from "react";
import { Outlet } from "react-router-dom";
import { fbAuth } from "../firebase";
import { useSetRecoilState } from "recoil";
import { userState } from "../stores/user";

export default function Router() {
  const setUser = useSetRecoilState(userState);
  useLayoutEffect(() => {
    const unscribe = onAuthStateChanged(fbAuth, (user) => {
      console.log(user, ":USER");
      setUser(user);
    });

    return () => {
      unscribe();
    };
  }, [setUser]);

  return <Outlet />;
}
