import { Outlet } from "react-router-dom";
import GNB from "..";

export default function GNBWrapper() {
  return (
    <>
      <GNB role="TEACHER" />
      <Outlet />
    </>
  );
}
