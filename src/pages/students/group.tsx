import { useState } from "react";
import Pages from "../../components/Students/List/Pages";
import Filter from "../../components/Students/group/Filter";
import GroupListTable from "../../components/Students/group/GroupListTable";
import useStudentGroupList from "../../hooks/useStudentGroupList";
import { IFilterProps } from "../../types/Students";

export default function StudentGroup() {
  const [page, setPage] = useState(1);
  const [filterOptions, setFilterOptions] = useState<
    Pick<IFilterProps, "searchQuery">
  >({ searchQuery: "" });
  const { groups, isLoading, lastPage } = useStudentGroupList({
    filterOptions,
  });

  return (
    <div className="mx-auto w-full max-w-[980px]">
      <h2 className="pt-[20px] text-[26px] font-bold text-[#111]">학생 그룹</h2>
      <section className="mt-[20px] flex w-full items-center justify-center border border-[#e0e0e0] bg-[#f7f7f7] p-[20px]">
        <Filter setFilterOptions={setFilterOptions} />
      </section>
      <section className="mt-[30px]">
        <div className="flex items-end justify-between">
          <span className="text-[12px]">
            ＃Tip: 시험 및 강사와 연결시 학생들을 그룹으로 묶어서 관리하면
            편리하며, 한 학생이 여러 그룹에 연결될 수 있습니다.
          </span>
        </div>
        <GroupListTable isLoading={isLoading} groups={groups} page={page} />
      </section>
      <section className="mt-[30px] mb-[60px] flex w-full items-center justify-center">
        {!isLoading && (
          <Pages page={page} lastPage={lastPage} setPage={setPage} />
        )}
      </section>
    </div>
  );
}
