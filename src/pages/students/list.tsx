import { useState } from "react";
import Filter from "../../components/Students/List/Filter";
import Pages from "../../components/Students/List/Pages";
import UserListTable from "../../components/Students/List/UserListTable";
import useStudentList from "../../hooks/useStudentList";
import { MIN_PAGE } from "../../constants/Students";

export default function StudentList() {
  const [page, setPage] = useState(MIN_PAGE);
  const { isLoading, students, lastPage } = useStudentList();

  return (
    <div className="mx-auto w-full max-w-[980px]">
      <h2 className="pt-[20px] text-[26px] font-bold text-[#111]">학생 정보</h2>
      <section className="mt-[20px] flex w-full items-center justify-center border border-[#e0e0e0] bg-[#f7f7f7] p-[20px]">
        <Filter
          groupList={[
            {
              id: "1",
              name: "1",
              createdAt: "",
              updatedAt: "",
              studentIDs: ["jXvXpUWKEwjtvdRKrJyf"],
              teacherID: "",
            },
            {
              id: "2",
              name: "2",
              createdAt: "",
              updatedAt: "",
              studentIDs: ["wcZ5341giCBlEWdvN8KL"],
              teacherID: "",
            },
          ]}
        />
      </section>
      <section className="mt-[30px]">
        <span className="text-[12px] text-[#000000]">
          ＃Tip: 비밀번호 분실이나 기간 만료로 로그인이 안될 경우 잠금 해제를
          하면 됩니다.
        </span>
        <UserListTable isLoading={isLoading} students={students} page={page} />
      </section>
      <section className="mt-[30px] mb-[60px] flex w-full items-center justify-center">
        {!isLoading && (
          <Pages page={page} lastPage={lastPage} setPage={setPage} />
        )}
      </section>
    </div>
  );
}
