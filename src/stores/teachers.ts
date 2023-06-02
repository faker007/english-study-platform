import { atom } from "recoil";

export const isRefetchTeacherListState = atom<boolean>({
  default: false,
  key: "isRefetchTeacherListState",
});

export const isRefetchTeacherGroupListState = atom<boolean>({
  default: false,
  key: "isRefetchTeacherGroupListState",
});
