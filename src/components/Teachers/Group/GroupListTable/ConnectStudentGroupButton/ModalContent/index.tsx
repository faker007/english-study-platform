import { ITeacherGroup } from "../../../../../../api/models";
import { IModalContentArgs } from "../../../../../Common/Modal";
import ModalFrame from "../../../../../Common/Modal/ModalFrame";
import ConnectStudentGroupForm from "./ConnectStudentGroupForm";
import DisconnectStudentGroupForm from "./DisconnectStudentGroupForm";
import MiddleInstruction from "./MiddleInstruction";

interface IProps extends IModalContentArgs {
  currentGroup: ITeacherGroup;
}

function ModalContent({ isOpen, toggleOpen, currentGroup }: IProps) {
  return (
    <ModalFrame
      title="강사그룹-학생그룹 연결"
      containerClassname="!p-0"
      isOpen={isOpen}
      toggleOpen={toggleOpen}
    >
      <div className="flex items-center gap-[30px] px-5 pt-5">
        <ConnectStudentGroupForm currentGroup={currentGroup} />
        <MiddleInstruction />
        <DisconnectStudentGroupForm currentGroup={currentGroup} />
      </div>
    </ModalFrame>
  );
}

export default ModalContent;
