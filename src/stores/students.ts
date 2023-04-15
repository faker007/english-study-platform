import { atom } from "recoil";
import { IFilterProps, IRefetchStudentListState } from "../types/Students";

export const filterPropsState = atom<IFilterProps | null>({
  key: "filterPropsState",
  default: null,
});

export const refetchStudentListState = atom<IRefetchStudentListState>({
  key: "refetchStudentListState",
  default: { refetch: async () => {} },
});
