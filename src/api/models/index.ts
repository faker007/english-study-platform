export const UserRole = {
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
} as const;

export type TUserRole = keyof typeof UserRole;

interface ICommonModel {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser extends ICommonModel {
  name: string;
  accountId: string;
  password: string;
  phoneNumber: string;
  groupIDs: string[];
  isEnabled: boolean;
  lastLoginTime: string;
  role: TUserRole;
}

export interface IStudent extends IUser {}

export interface IStudentGroup extends ICommonModel {
  studentIDs: string[];
  teacherIDs: string[];
  teacherGroupIDs: string[];
  name: string;
}

export interface ITeacher extends IUser {
  isAdmin: boolean;
}

export interface ITeacherGroup extends ICommonModel {
  studentGroupIDs: string[];
  teacherIDs: string[];
  name: string;
}
