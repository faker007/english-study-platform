import { collection } from "firebase/firestore";
import { fbStore } from "../../firebase";
import { COLLECTIONS } from "../constants";

export const STUDENT_COLLECTION = collection(fbStore, COLLECTIONS.student);
export const TEACHER_COLLECTION = collection(fbStore, COLLECTIONS.teacher);
export const STUDENT_GROUP_COLLECTION = collection(
  fbStore,
  COLLECTIONS.studentGroup
);
