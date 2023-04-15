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
  uid: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: TUserRole;
  groupIDs: string[];
  isEnabled: boolean;
}

export interface IStudentGroup extends ICommonModel {
  studentIDs: string[];
  teacherID: string;
  name: string;
}
