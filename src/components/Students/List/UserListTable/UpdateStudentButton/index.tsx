import { useState } from "react";
import Modal from "../../../../Common/Modal";
import ModalContent from "./ModalContent";

function UpdateStudentButton({
  accountId,
  docId,
  isEnabled,
  name,
  phoneNumber,
}: {
  accountId: string;
  name: string;
  isEnabled: boolean;
  phoneNumber: string;
  docId: string;
}) {
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
        수정
      </button>
      <Modal isOpen={isOpen} toggleOpen={toggleOpen} width={750} height={510}>
        {(props) => (
          <ModalContent
            {...props}
            accountId={accountId}
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

export default UpdateStudentButton;
