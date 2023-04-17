import { atom } from "recoil";
import { IStudent } from "../api/models";
import { ITeacher } from "../api/models";

export const userState = atom<IStudent | ITeacher | null>({
  default: null,
  key: "userState",
});

export const userLoadingState = atom<boolean>({
  default: false,
  key: "userLoadingState",
});
