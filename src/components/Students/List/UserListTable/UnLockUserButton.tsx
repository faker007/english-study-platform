import { useSetRecoilState } from "recoil";
import { isRefetchStudentListState } from "../../../../stores/students";
import { doc, updateDoc } from "firebase/firestore";
import { fbStore } from "../../../../firebase";
import { COLLECTIONS } from "../../../../api/constants";
import dayjs from "dayjs";

function UnLockUserButton({
  studentId,
  accountId,
}: {
  studentId: string;
  accountId: string;
}) {
  const setRefetchStudentList = useSetRecoilState(isRefetchStudentListState);

  const handleClickButton = async () => {
    const isUnlockUser = window.confirm(
      "계정 잠금을 해제하시겠습니까?\n비밀번호가 아이디로 변경됩니다."
    );

    if (isUnlockUser) {
      try {
        const studentDoc = doc(fbStore, COLLECTIONS.student, studentId);
        await updateDoc(studentDoc, {
          password: accountId,
          updatedAt: dayjs().toISOString(),
        });
        alert("로그인 비밀번호가 아이디로 초기화되었습니다.");
        setRefetchStudentList(true);
      } catch (error) {
        console.error(error);
        alert("에러가 발생하였습니다.");
      }
    }
  };

  return (
    <button
      onClick={handleClickButton}
      className="rounded-[6px] border border-[#d9d9d9] bg-white px-3 py-1 text-[13px] text-[#777] hover:bg-[#d9d9d9]"
    >
      잠금해제
    </button>
  );
}

export default UnLockUserButton;
