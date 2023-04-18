import { atom } from "recoil";
import { IFilterProps } from "../types/Students";

export const filterPropsState = atom<IFilterProps | null>({
  key: "filterPropsState",
  default: null,
});

export const studentGroupSearchQueryState = atom<string>({
  default: "",
  key: "studentGroupSearchQueryState",
});

export const isRefetchStudentListState = atom<boolean>({
  default: false,
  key: "isRefetchStudentListState",
});

export const isRefetchStudentGroupListState = atom<boolean>({
  default: false,
  key: "isRefetchStudentGroupListState",
});
