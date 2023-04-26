import { atom } from "recoil";
import { TeacherMenuItems } from "../types/GNB";

export const activeMenuState = atom<TeacherMenuItems>({
  default: undefined,
  key: "activeMenuState",
});
