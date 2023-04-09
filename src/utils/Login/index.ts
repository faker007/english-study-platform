import { addDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { USER_COLLECTION } from "../../components/api/collections";
import { User, createUserWithEmailAndPassword } from "firebase/auth";
import { IUser, UserRole } from "../../components/api/models";
import { ILoginForm } from "../../types/Login";
import { fbAuth } from "../../firebase";
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
  role: UserRole;
}) {
  return user?.role === role;
}

export async function syncUserToFirestore({
  role,
  user,
}: {
  user: User;
  role: UserRole;
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
}: ILoginForm & { role: UserRole }) {
  try {
    const { user } = await createUserWithEmailAndPassword(fbAuth, id, password);

    if (user) {
      await syncUserToFirestore({ user, role });
      alert("성공적으로 가입이 완료 되었습니다.");
    }
  } catch (error) {
    console.error(error);
    alert(error);
  }
}

export function updateLocalstorageIdRemember({
  id,
  idRemember,
  role,
}: {
  idRemember: boolean;
  id: string;
  role: UserRole;
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
