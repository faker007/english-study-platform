import { IModalContentArgs } from "../../../../Common/Modal";

interface IProps extends IModalContentArgs {
  name: string;
  accountId: string;
  phoneNumber: string;
}

function ModalContent({ toggleOpen, accountId, phoneNumber, name }: IProps) {
  return (
    <div
      onClick={toggleOpen}
      className="flex h-full w-full items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-[80%] w-1/2 space-y-5 overflow-auto bg-white p-3"
      >
        <section className="overflow-hidden rounded-md border border-zinc-300">
          <div className="flex items-center justify-between border-b border-zinc-300 bg-zinc-100 p-3">
            <h3 className="text-sm font-bold">
              학생 메모장 ({name} / {accountId} / {phoneNumber})
            </h3>
            <button className="rounded-md bg-blue-500 px-3 py-1.5 text-xs text-white">
              메모 저장
            </button>
          </div>
          <div className="p-3">
            <textarea className="h-96 w-full resize-none border border-zinc-300 p-5 text-sm" />
          </div>
        </section>
        <section className="overflow-hidden rounded-md border border-zinc-300">
          <div className="flex items-center justify-between border-b border-zinc-300 bg-zinc-100 p-3">
            <h3 className="text-sm font-bold">시험 성적 추이(최근 20회)</h3>
            <select className="w-[300px] rounded-md border border-zinc-300 p-1 text-xs">
              <option>시험 폴더 선택</option>
            </select>
          </div>
          <div className="min-h-[300px] p-3"></div>
        </section>
      </div>
    </div>
  );
}

export default ModalContent;
