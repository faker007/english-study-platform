import { useState } from "react";
import Pages from "../../components/Students/List/Pages";
import { ITeacherGroupListFilter } from "../../types/Teachers";
import useTeacherGroupList from "../../hooks/useTeacherGroupList";
import { MIN_PAGE } from "../../constants/Students";
import Filter from "../../components/Teachers/Group/Filter";
import GroupListTable from "../../components/Teachers/Group/GroupListTable";

export default function TeacherGroup() {
  const [page, setPage] = useState(MIN_PAGE);
  const [filter, setFilter] = useState<ITeacherGroupListFilter>({
    searchQuery: "",
  });
  const { isLoading, teacherGroups, lastPage } = useTeacherGroupList(filter);

  return (
    <div className="mx-auto w-full max-w-[980px]">
      <h2 className="pt-[20px] text-[26px] font-bold text-[#111]">강사 그룹</h2>
      <section className="mt-[20px] flex w-full items-center justify-center border border-[#e0e0e0] bg-[#f7f7f7] p-[20px]">
        <Filter setPage={setPage} setFilter={setFilter} />
      </section>
      <section className="mt-[30px]">
        <div className="flex items-end justify-between">
          <span className="text-[12px]">
            ＃Tip: 그룹이 같은 강사는 문제와 시험 정보를 공유할 수 있으며, 그룹
            지정은 강사 계정 수정을 통해 가능합니다.
          </span>
        </div>
        <GroupListTable
          isLoading={isLoading}
          groups={teacherGroups}
          page={page}
        />
      </section>
      <section className="mt-[30px] mb-[60px] flex w-full items-center justify-center">
        {!isLoading && (
          <Pages page={page} lastPage={lastPage} setPage={setPage} />
        )}
      </section>
    </div>
  );
}
