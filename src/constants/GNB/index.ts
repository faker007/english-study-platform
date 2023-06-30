import { ILNBItem } from "../../types/GNB";

export const STUDENT_MANAGE_LNB_ITEMS: ILNBItem[] = [
  { text: "학생 정보", url: "/students/list" },
  { text: "학생 그룹", url: "/students/group" },
  // { text: "출석부", url: "#" },
];

export const PROBLEM_BANK_LNB_ITEMS: ILNBItem[] = [
  { text: "문제 세트", url: "/problem-bank" },
  { text: "지문 검색/수정", url: "#" },
  { text: "문제 검색/수정", url: "#" },
  { text: "문제 유형", url: "#" },
];

export const TEST_MANAGE_LNB_ITEMS: ILNBItem[] = [
  { text: "시험 폴더", url: "/test-folder" },
  { text: "시험 정보", url: "#" },
  { text: "시험별 제출 조회", url: "#" },
  { text: "학생별 제출 조회", url: "#" },
  { text: "ACT Report", url: "#" },
  { text: "SAT Report", url: "#" },
];

export const ESSAY_MANAGE_LNB_ITEMS: ILNBItem[] = [
  { text: "Essay 정보", url: "#" },
  { text: "Essay별 제출 조회", url: "#" },
  { text: "학생별 제출 조회", url: "#" },
];

export const REFERENCE_LNB_ITEMS: ILNBItem[] = [
  { text: "강사 자료실", url: "#" },
  { text: "수업 자료실", url: "#" },
];

export const TEACHER_MANAGE_LNB_ITEMS: ILNBItem[] = [
  { text: "강사 계정", url: "/teachers/list" },
  { text: "강사 그룹", url: "/teachers/group" },
];
