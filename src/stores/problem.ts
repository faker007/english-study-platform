import { atom } from "recoil";

export const quillValue = atom<string>({
  default: "",
  key: "quillValueState",
});
