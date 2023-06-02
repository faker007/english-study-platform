import { useRecoilValue, useRecoilState } from "recoil";
import { userLoadingState, userState } from "../stores/user";
import { COLLECTIONS } from "../api/constants";
import { doc, getDoc } from "firebase/firestore";
import { fbStore } from "../firebase";
import { IStudent, ITeacher, IUser, TUserRole } from "../api/models";
import { LOCALSTORAGE_USER_TOKEN } from "../constants/Login";
import { IToken } from "../pages/router";
import dayjs from "dayjs";

function useUser() {
  const [user, setUser] = useRecoilState(userState);
  const isLoading = useRecoilValue(userLoadingState);

  async function refetch(role?: TUserRole) {
    try {
      if (!user) return;
      const userRole = role ? role : user.role;

      const collections =
        userRole === "STUDENT" ? COLLECTIONS.student : COLLECTIONS.teacher;
      const userDoc = doc(fbStore, collections, user.id);
      const userObj = await getDoc(userDoc);

      if (userObj.exists()) {
        const newUserData = userObj.data() as IUser;
        updateLocalStorageUserData(newUserData, user);
        setUser(newUserData);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return { user, isLoading, refetch, setUser };
}

export default useUser;

function updateLocalStorageUserData(
  newUserData: IUser,
  user: ITeacher | IStudent
) {
  const localStorageJsonString = window.localStorage.getItem(
    LOCALSTORAGE_USER_TOKEN
  );

  if (localStorageJsonString) {
    const parsedData = JSON.parse(localStorageJsonString) as IToken;
    window.localStorage.setItem(
      LOCALSTORAGE_USER_TOKEN,
      JSON.stringify({ ...parsedData, data: newUserData } as IToken)
    );
  } else {
    window.localStorage.setItem(
      LOCALSTORAGE_USER_TOKEN,
      JSON.stringify({
        createdAt: dayjs().toISOString(),
        data: newUserData,
        role: user.role,
      } as IToken)
    );
  }
}
