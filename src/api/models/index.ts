export type UserRole = "STUDENT" | "TEACHER";

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
  role: UserRole;
  groupIDs: string[];
}

export interface IStudentGroup extends ICommonModel {
  studentIDs: string[];
  name: string;
}
