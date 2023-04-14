import { atom } from "recoil";
import { IFilterProps } from "../types/Students";

export const filterPropsState = atom<IFilterProps | null>({
  key: "filterPropsState",
  default: null,
});
