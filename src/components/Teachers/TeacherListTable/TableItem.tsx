import classNames from "classnames";
import { ITeacher, ITeacherGroup } from "../../../api/models";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { fbStore } from "../../../firebase";
import { COLLECTIONS } from "../../../api/constants";
import dayjs from "dayjs";
import UpdateTeacherButton from "./UpdateTeacherButton";
import UnLockTeacherButton from "./UnLockTeacherButton";

interface IProps {
  index: number;
  teacher: ITeacher;
}

export default function TableItem({ index, teacher }: IProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [populatedTeacherGroups, setPopulatedTeacherGroups] = useState<
    ITeacherGroup[]
  >([]);
  const { groupIDs, name, accountId, phoneNumber, lastLoginTime, isEnabled } =
    teacher;

  async function fetchTeacherGroups(groupIDs: string[]) {
    setIsLoading(true);

    try {
      let container: ITeacherGroup[] = [];
      const promises = groupIDs.map(async (groupId) => {
        const groupDoc = doc(fbStore, COLLECTIONS.teacherGroup, groupId);
        const groupDocObj = await getDoc(groupDoc);

        if (groupDocObj.exists()) {
          container.push(groupDocObj.data() as ITeacherGroup);
        }
      });

      await Promise.all(promises);
      setPopulatedTeacherGroups(container);
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    fetchTeacherGroups(groupIDs);
  }, [groupIDs]);

  if (isLoading) {
    return <></>;
  }

  return (
    <>
      <tr>
        <td className="h-[50px] break-all border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
          {index}
        </td>
        <td className="h-[50px] break-all border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
          {populatedTeacherGroups[0]?.name || "(그룹 없음)"}
        </td>
        <td className="h-[50px] break-all border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
          {name}
        </td>
        <td className="h-[50px] break-all border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
          {accountId}
        </td>
        <td className="h-[50px] break-all border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
          {phoneNumber}
        </td>
        <td className="h-[50px] break-all border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
          {lastLoginTime ? dayjs(lastLoginTime).format("YYYY-MM-DD HH:mm") : ""}
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
          <UpdateTeacherButton teacher={teacher} />
          <UnLockTeacherButton
            accountId={teacher.accountId}
            teacherId={teacher.id}
          />
        </td>
      </tr>
    </>
  );
}
