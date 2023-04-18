import { useState } from "react";
import Modal from "../../../../Common/Modal";
import ModalContent from "./ModalContent";

interface IProps {
  accountId: string;
  name: string;
  isEnabled: boolean;
  phoneNumber: string;
  docId: string;
  groupIDs: string[];
}

function GroupConnectButton(props: IProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <button
        onClick={toggleOpen}
        className="rounded-[6px] border border-[#d9d9d9] bg-white px-3 py-1 text-[13px] text-[#777] hover:bg-[#d9d9d9]"
      >
        그룹연결
      </button>
      <Modal isOpen={isOpen} toggleOpen={toggleOpen} width={750} height={510}>
        {(modalProps) => <ModalContent {...modalProps} {...props} />}
      </Modal>
    </>
  );
}

export default GroupConnectButton;
