import { atom } from "recoil";
import { IFilterProps, IRefetchState } from "../types/Students";

export const filterPropsState = atom<IFilterProps | null>({
  key: "filterPropsState",
  default: null,
});

export const refetchStudentListState = atom<IRefetchState>({
  key: "refetchStudentListState",
  default: { refetch: async () => {} },
});

export const studentGroupSearchQueryState = atom<string>({
  default: "",
  key: "studentGroupSearchQueryState",
});

export const refetchStudentGroupListState = atom<IRefetchState>({
  key: "refetchStudentListState",
  default: { refetch: async () => {} },
});
