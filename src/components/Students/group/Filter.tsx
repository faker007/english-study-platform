import { SubmitHandler, useForm } from "react-hook-form";
import { IFilterProps } from "../../../types/Students";
import { MIN_PAGE } from "../../../constants/Students";

interface IForm {
  searchQuery: string;
}

interface IProps {
  setFilterOptions: React.Dispatch<
    React.SetStateAction<Pick<IFilterProps, "searchQuery">>
  >;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function Filter({ setFilterOptions, setPage }: IProps) {
  const { register, handleSubmit, reset } = useForm<IForm>();

  const onSubmit: SubmitHandler<IForm> = ({ searchQuery }) => {
    setFilterOptions({ searchQuery });
    setPage(MIN_PAGE);
  };

  const handleResetForm = () => {
    reset();
    setFilterOptions({ searchQuery: "" });
    setPage(MIN_PAGE);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select className="mr-[10px] w-[120px] border border-[#eee] bg-white py-[6px] text-[14px] outline-none">
        <option value={"groupName"}>그룹명</option>
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
