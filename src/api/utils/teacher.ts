import { IStudent, ITeacher } from "../models";

export function isTeacher(user: ITeacher | IStudent): user is ITeacher {
  return user.role === "TEACHER";
}

export function isAdmin(user: ITeacher | IStudent | null) {
  return user && isTeacher(user) && user.isAdmin;
}
