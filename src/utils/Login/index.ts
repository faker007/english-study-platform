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
  name,
  phoneNumber,
}: {
  user: User;
  role: TUserRole;
  phoneNumber?: string;
  name?: string;
}) {
  const userData: IUser = {
    id: "",
    role,
    email: user.email || "",
    name: user.displayName || name || "",
    phoneNumber: user.phoneNumber || phoneNumber || "",
    uid: user.uid,
    groupIDs: [],
    isEnabled: true,
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
  name,
  phoneNumber,
}: ILoginForm & {
  role: TUserRole;
  phoneNumber?: string;
  name?: string;
}) {
  const { user } = await createUserWithEmailAndPassword(fbAuth, id, password);

  if (user) {
    await syncUserToFirestore({ user, role, name, phoneNumber });
    return true;
  } else {
    return false;
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
