import { atom } from "recoil";

export const isRefetchStudentListState = atom<boolean>({
  default: false,
  key: "isRefetchStudentListState",
});

export const isRefetchStudentGroupListState = atom<boolean>({
  default: false,
  key: "isRefetchStudentGroupListState",
});
