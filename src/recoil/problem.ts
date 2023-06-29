import { atom } from "recoil";

export const currentFocusedJimunIdState = atom({
  default: "",
  key: "currentFocusedJimunIdState",
});

export const currentFocusedProblemIdState = atom({
  default: "",
  key: "currentFocusedProblemIdState",
});

export const problemResponseTypeState = atom({
  default: "단일 선택",
  key: "problemResponseTypeState",
});

export const problemSymbolTypeState = atom({
  default: "100",
  key: "problemSymbolTypeState",
});

export const problemCorrectAnswerState = atom({
  default: "A",
  key: "problemCorrectAnswerState",
});

export const problemScoreState = atom({
  default: "1" as string | number,
  key: "problemScoreState",
});

export const problemInfosState = atom({
  default: [] as any,
  key: "problemInfosState",
});

export const shortAnswerState = atom({
  default: "" as any,
  key: "shortAnswerState",
});
