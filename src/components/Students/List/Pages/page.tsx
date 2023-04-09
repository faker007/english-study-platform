import classNames from "classnames";

interface IProps {
  active?: boolean;
  value: number;
}

export default function Page({ active = false, value }: IProps) {
  return (
    <button
      className={classNames(
        "aspect-square w-[38px] border border-[#e6e6e6] bg-[#fafafa] text-[14px] text-[#666]",
        {
          "!bg-[#007abe] !text-white": active,
        }
      )}
    >
      {value}
    </button>
  );
}
