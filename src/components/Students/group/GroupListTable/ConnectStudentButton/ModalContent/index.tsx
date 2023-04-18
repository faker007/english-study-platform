import { IStudentGroup } from "../../../../../../api/models";
import useStudentGroupList from "../../../../../../hooks/useStudentGroupList";
import useStudentList from "../../../../../../hooks/useStudentList";
import { IModalContentArgs } from "../../../../../Common/Modal";
import ModalFrame from "../../../../../Common/Modal/ModalFrame";
import ConnectStudentToGroupForm from "./ConnectStudentToGroupForm";
import DisconnectStudentFromGroupForm from "./DisconnectStudentFromGroupForm";
import MiddleInstruction from "./MiddleInstruction";

interface IProps extends IModalContentArgs {
  currentGroup: IStudentGroup;
}

function ModalContent({ isOpen, toggleOpen, currentGroup }: IProps) {
  const { students, isLoading: isStudentListLoading } = useStudentList();
  const { groups, isLoading: isStudentGroupLoading } = useStudentGroupList();

  const props = {
    currentGroup,
    students,
    isStudentListLoading,
    groups,
    isStudentGroupLoading,
  };

  return (
    <ModalFrame
      title="학생 그룹 - 학생 연결"
      containerClassname="!p-0"
      isOpen={isOpen}
      toggleOpen={toggleOpen}
    >
      <div className="flex items-center gap-[30px] px-5 pt-5">
        <ConnectStudentToGroupForm {...props} />
        <MiddleInstruction />
        <DisconnectStudentFromGroupForm {...props} />
      </div>
    </ModalFrame>
  );
}

export default ModalContent;
