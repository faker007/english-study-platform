import { useState } from "react";
import Modal from "../../../Common/Modal";
import classNames from "classnames";
import ModalContent from "./ModalContent";

interface IProps {
  index: number;
  name: string;
  email: string;
  phoneNumber: string;
  recentLogin: string;
  isEnabled: boolean;
  lock: string;
  docId: string;
}

export default function TableItem({
  email,
  index,
  lock,
  name,
  phoneNumber,
  recentLogin,
  isEnabled,
  docId,
}: IProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <tr>
        <td className="h-[50px] break-all border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
          {index}
        </td>
        <td className="h-[50px] break-all border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
          {name}
        </td>
        <td className="h-[50px] break-all border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
          {email}
        </td>
        <td className="h-[50px] break-all border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
          {phoneNumber}
        </td>
        <td className="h-[50px] break-all border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
          {recentLogin}
        </td>
        <td
          className={classNames(
            "h-[50px] break-all border-b border-[#e5e5e5] text-center text-[14px] text-[#666]",
            {
              "!text-[red]": !isEnabled,
            }
          )}
        >
          {isEnabled ? "사용" : "정지"}
        </td>
        <td className="h-[50px] space-x-[5px] break-all border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
          <button className="rounded-[6px] border border-[#d9d9d9] bg-white px-3 py-1 text-[13px] text-[#777] hover:bg-[#d9d9d9]">
            대시보드
          </button>
          <button
            onClick={toggleOpen}
            className="rounded-[6px] border border-[#d9d9d9] bg-white px-3 py-1 text-[13px] text-[#777] hover:bg-[#d9d9d9]"
          >
            수정
          </button>
          <button className="rounded-[6px] border border-[#d9d9d9] bg-white px-3 py-1 text-[13px] text-[#777] hover:bg-[#d9d9d9]">
            그룹연결
          </button>
          <button className="rounded-[6px] border border-[#d9d9d9] bg-white px-3 py-1 text-[13px] text-[#777] hover:bg-[#d9d9d9]">
            잠금해제
          </button>
          <button className="rounded-[6px] border border-[#d9d9d9] bg-white px-3 py-1 text-[13px] text-[#777] hover:bg-[#d9d9d9]">
            삭제
          </button>
        </td>
      </tr>
      <Modal isOpen={isOpen} toggleOpen={toggleOpen} width={750} height={510}>
        {(props) => (
          <ModalContent
            {...props}
            email={email}
            name={name}
            isEnabled={isEnabled}
            phoneNumber={phoneNumber}
            docId={docId}
          />
        )}
      </Modal>
    </>
  );
}
