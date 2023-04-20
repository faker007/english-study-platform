import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import { ITeacherGroup } from "../../api/models";
import { MIN_PAGE } from "../../constants/Students";
import { ITeacherListFilter } from "../../types/Teachers";

interface IProps {
  groupList: ITeacherGroup[];
  setFilter: React.Dispatch<React.SetStateAction<ITeacherListFilter>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

interface IForm {
  groupId: string;
  searchQuery: string;
}

export default function Filter({ groupList, setFilter, setPage }: IProps) {
  const { register, handleSubmit, reset, watch } = useForm<IForm>();

  const groupIdWatchValue = watch("groupId");

  const onSubmit: SubmitHandler<IForm> = ({ groupId, searchQuery }) => {
    setFilter({
      searchQuery,
      group: groupList.find((item) => item.id === groupId) ?? null,
    });
    setPage(MIN_PAGE);
  };

  const handleResetForm = () => {
    reset();
    setFilter({ group: null, searchQuery: "" });
  };

  useEffect(() => {
    const handleChangeGroup = () => {
      if (typeof groupIdWatchValue !== "undefined") {
        setFilter((prev) => ({
          ...prev,
          group:
            groupList.find((item) => item.id === groupIdWatchValue) ?? null,
        }));
        setPage(MIN_PAGE);
      }
    };

    handleChangeGroup();
  }, [setFilter, groupList, setPage, groupIdWatchValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select
        className="mr-[10px] w-[120px] border border-[#eee] bg-white py-[6px] text-[14px] outline-none"
        {...register("groupId")}
      >
        <option value={""}>그룹 선택</option>
        {groupList.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </select>
      <select className="mr-[10px] w-[120px] border border-[#eee] bg-white py-[6px] text-[14px] outline-none">
        <option>성명</option>
      </select>
      <input
        type="text"
        className="mr-[10px] h-[33px] w-[270px] border border-[#eee] bg-white py-[2px] px-[8px] text-[14px] leading-[33px] outline-none"
        placeholder="2~5글자 입력 후 Enter"
        {...register("searchQuery")}
      />
      <button
        type="submit"
        className="mr-[10px] h-[33px] w-[80px] border border-[#444] bg-[#444] text-[13px] text-white"
      >
        검색
      </button>
      <button
        onClick={handleResetForm}
        type="button"
        className="h-[33px] w-[80px] border border-[#757575] bg-white text-[13px] text-[#333]"
      >
        새로고침
      </button>
    </form>
  );
}
