import {
  addDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { IUser, TUserRole } from "../../api/models";
import { fbStore } from "../../firebase";
import { LOCALSTORAGE_ID_REMEBER } from "../../constants/Login";
import { STUDENT_COLLECTION, TEACHER_COLLECTION } from "../../api/collections";
import dayjs from "dayjs";
import { COLLECTIONS } from "../../api/constants";

export async function createUser({
  accountId,
  password,
  role,
  name,
  phoneNumber,
}: {
  accountId: string;
  password: string;
  role: TUserRole;
  phoneNumber: string;
  name: string;
}): Promise<{ ok: boolean; error?: string; docId?: string }> {
  const targetCollection =
    role === "STUDENT" ? STUDENT_COLLECTION : TEACHER_COLLECTION;
  const q = query(
    targetCollection,
    where("accountId", "==", accountId),
    where("password", "==", password)
  );
  const snapshot = await getDocs(q);

  if (!snapshot.empty)
    return { ok: false, error: "중복 되는 계정이 있습니다." };

  const data: IUser = {
    accountId,
    password,
    name,
    phoneNumber,
    id: "",
    isEnabled: true,
    groupIDs: [],
    createdAt: dayjs().toISOString(),
    updatedAt: dayjs().toISOString(),
    lastLoginTime: "",
    role,
  };

  const doc = await addDoc(targetCollection, data);
  await updateDoc(doc, { id: doc.id });

  if (role === "TEACHER") {
    await updateDoc(doc, { isAdmin: false });
  }

  return { ok: true, docId: doc.id };
}

export function updateLocalstorageIdRemember({
  id,
  idRemember,
  role,
}: {
  idRemember: boolean;
  id: string;
  role: TUserRole;
}) {
  if (idRemember) {
    window.localStorage.setItem(
      LOCALSTORAGE_ID_REMEBER,
      JSON.stringify({ id, role })
    );
  } else {
    window.localStorage.removeItem(LOCALSTORAGE_ID_REMEBER);
  }
}

export async function updateUserRecentLoginTime(user: IUser, role: TUserRole) {
  return updateDoc(
    doc(
      fbStore,
      role === "STUDENT" ? COLLECTIONS.student : COLLECTIONS.teacher,
      user.id
    ),
    {
      lastLoginTime: new Date().toISOString(),
    }
  );
}
