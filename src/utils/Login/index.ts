import {
  addDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { USER_COLLECTION } from "../../api/collections";
import { User, createUserWithEmailAndPassword } from "firebase/auth";
import { IUser, TUserRole } from "../../api/models";
import { ILoginForm } from "../../types/Login";
import { fbAuth, fbStore } from "../../firebase";
import { LOCALSTORAGE_ID_REMEBER } from "../../constants/Login";

export async function getUserFromFirestore(uid: string) {
  const userDocQuery = query(USER_COLLECTION, where("uid", "==", uid));
  const querySnapshot = await getDocs(userDocQuery);

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data() as IUser;
  }

  return null;
}

export function checkUserRole({
  role,
  user,
}: {
  user: IUser | null;
  role: TUserRole;
}) {
  return user?.role === role;
}

export async function syncUserToFirestore({
  role,
  user,
}: {
  user: User;
  role: TUserRole;
}) {
  const userData: IUser = {
    id: "",
    role,
    email: user.email || "",
    name: user.displayName || "",
    phoneNumber: user.phoneNumber || "",
    uid: user.uid,
    groupIDs: [],
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  const newUserDoc = await addDoc(USER_COLLECTION, userData);
  await updateDoc(newUserDoc, { id: newUserDoc.id });
}

export async function createUser({
  id,
  password,
  role,
}: ILoginForm & { role: TUserRole }) {
  const { user } = await createUserWithEmailAndPassword(fbAuth, id, password);

  if (user) {
    await syncUserToFirestore({ user, role });
    alert("성공적으로 가입이 완료 되었습니다.");
  }
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

export async function updateUserRecentLoginTime(user: IUser) {
  return updateDoc(doc(fbStore, `user/${user.id}`), {
    updatedAt: new Date().toISOString(),
  });
}
