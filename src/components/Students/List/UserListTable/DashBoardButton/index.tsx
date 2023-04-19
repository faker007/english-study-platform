import { useState } from "react";
import Modal from "../../../../Common/Modal";
import ModalContent from "./ModalContent";

interface IProps {
  name: string;
  accountId: string;
  phoneNumber: string;
}

function DashBoardButton({ accountId, name, phoneNumber }: IProps) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleOpen() {
    setIsOpen((prev) => !prev);
  }

  return (
    <>
      <button
        onClick={toggleOpen}
        className="rounded-[6px] border border-[#d9d9d9] bg-white px-3 py-1 text-[13px] text-[#777] hover:bg-[#d9d9d9]"
      >
        대시보드
      </button>
      <Modal isOpen={isOpen} toggleOpen={toggleOpen} fullscreen>
        {(modalProps) => (
          <ModalContent
            accountId={accountId}
            name={name}
            phoneNumber={phoneNumber}
            {...modalProps}
          />
        )}
      </Modal>
    </>
  );
}

export default DashBoardButton;
