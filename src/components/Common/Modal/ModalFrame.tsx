import { PropsWithChildren } from "react";
import { IModalContentArgs } from ".";

interface IProps extends IModalContentArgs {
  title: string;
}

export default function ModalFrame({
  children,
  toggleOpen,
  title,
}: PropsWithChildren<IProps>) {
  return (
    <div className="h-full w-full overflow-hidden rounded-[10px] bg-white p-[20px]">
      <header className="flex w-full items-center justify-between px-[20px] pt-[20px] pb-[20px]">
        <h3 className="text-2xl font-medium">{title}</h3>
        <button
          onClick={toggleOpen}
          className="text-3xl font-medium text-[#555]"
        >
          X
        </button>
      </header>
      <main className="w-full border-t-[3px] border-[#333] p-[30px]">
        {children}
      </main>
    </div>
  );
}
