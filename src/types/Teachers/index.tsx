import { ITeacherGroup } from "../../api/models";

export interface ITeacherListFilter {
  searchQuery: string;
  group: ITeacherGroup | null;
}

export interface ITeacherGroupListFilter {
  searchQuery: string;
}
