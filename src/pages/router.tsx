import { useCallback, useLayoutEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../stores/user";
import { LOCALSTORAGE_USER_TOKEN } from "../constants/Login";
import { IUser, TUserRole } from "../api/models";
import dayjs from "dayjs";
import { getDocs, query, where } from "firebase/firestore";
import { STUDENT_COLLECTION, TEACHER_COLLECTION } from "../api/collections";

export interface IToken {
  role: TUserRole;
  data: IUser;
  createdAt: string;
}

function Router() {
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(userState);

  const handleUser = useCallback(async () => {
    const tokenString = localStorage.getItem(LOCALSTORAGE_USER_TOKEN);
    if (tokenString) {
      const token = JSON.parse(tokenString) as IToken;

      // 토큰 만료 조건
      //  1. 어드민쪽에서 정보 변경한 경우
      //  2. createdAt + 30일 지난 경우
      const isUserInfoModified = await checkUserInfoModified(
        token.role,
        token.data
      );
      const isTokenDurationExpired = checkTokenDurationExpired(token.createdAt);
      const isExpired = isUserInfoModified || isTokenDurationExpired;

      if (isExpired) {
        console.log(isUserInfoModified, isTokenDurationExpired);

        localStorage.removeItem(LOCALSTORAGE_USER_TOKEN);
        alert("로그인 정보가 만료 되었습니다. 다시 로그인 해주세요.");
        setUser(null);
        navigate("/login");
      } else {
        setUser(token.data);
      }
    }
  }, [setUser, navigate]);

  useLayoutEffect(() => {
    handleUser();
  }, [handleUser]);

  return <Outlet />;
}

export default Router;

async function checkUserInfoModified(role: TUserRole, data: IUser) {
  try {
    const q = query(
      role === "STUDENT" ? STUDENT_COLLECTION : TEACHER_COLLECTION,
      where("id", "==", data.id)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const snapshotData = snapshot.docs[0].data() as IUser;
      const isExpired = dayjs(snapshotData.updatedAt).isAfter(
        dayjs(data.updatedAt)
      );

      return isExpired;
    }
  } catch (error) {
    console.error(error);
  }

  return false;
}

function checkTokenDurationExpired(createdAt: string) {
  const targetDate = dayjs(createdAt).add(30, "day");
  return dayjs().isAfter(targetDate);
}
