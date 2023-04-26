import { useCallback, useEffect, useState } from "react";
import { IStudentGroup } from "../api/models";
import { useRecoilState } from "recoil";
import { isRefetchStudentGroupListState } from "../stores/students";
import { STUDENT_GROUP_COLLECTION } from "../api/collections";
import { doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { MIN_PAGE, PAGE_PER } from "../constants/Students";
import { IFilterProps } from "../types/Students";
import useUser from "./useUser";
import { isAdmin } from "../api/utils/teacher";
import { fbStore } from "../firebase";
import { COLLECTIONS } from "../api/constants";

interface IProps {
  filterOptions?: Pick<IFilterProps, "searchQuery">;
}

export default function useStudentGroupList({ filterOptions }: IProps) {
  // states
  const [isLoading, setIsLoading] = useState(false);
  const [groups, setGroups] = useState<IStudentGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<IStudentGroup[]>([]);
  const [error, setError] = useState<unknown>();
  const [lastPage, setLastPage] = useState(MIN_PAGE);

  // recoil
  const [isRefetch, setIsRefetch] = useRecoilState(
    isRefetchStudentGroupListState
  );
  const { user } = useUser();

  const fetchStudentGroups = useCallback(async () => {
    let groupIds: string[] = [];
    const container: IStudentGroup[] = [];
    setIsLoading(true);

    try {
      if (user) {
        const teacherGroupId = user.groupIDs[0] ?? "";

        if (teacherGroupId) {
          await fetchStudentGroupIds(teacherGroupId, groupIds);
        }

        if (isAdmin(user)) {
          await fetchStudentGroupIdsFromCollection(groupIds);
        }
      }

      // 중복 제거
      groupIds = Array.from(new Set(groupIds));

      // studentGroupList 채우기
      await fetchStudentGroupListFromIds(groupIds, container);
    } catch (error) {
      console.error(error);
      setError(error);
    }

    setGroups(container);
    setFilteredGroups(container);
    setLastPage(Math.max(Math.ceil(container.length / PAGE_PER), MIN_PAGE));
    setIsRefetch(false);

    setIsLoading(false);
  }, [
    setIsLoading,
    setGroups,
    setFilteredGroups,
    setLastPage,
    setIsRefetch,
    user,
  ]);

  useEffect(() => {
    if (filterOptions) {
      const querySlugs = filterOptions.searchQuery.split("");

      const filteredGroups = groups.filter((group) => {
        return querySlugs.every((querySlug) => group.name.includes(querySlug));
      });

      setFilteredGroups(filteredGroups);
      setLastPage(Math.ceil(filteredGroups.length / PAGE_PER));
    }
  }, [filterOptions, groups]);

  useEffect(() => {
    fetchStudentGroups();
  }, [fetchStudentGroups]);

  useEffect(() => {
    if (isRefetch) fetchStudentGroups();
  }, [isRefetch, fetchStudentGroups]);

  return {
    isLoading,
    groups: filteredGroups,
    error,
    lastPage,
    refetch: fetchStudentGroups,
  };
}

async function fetchStudentGroupIds(
  teacherGroupId: string,
  container: string[]
) {
  const studentGroupQuery = query(
    STUDENT_GROUP_COLLECTION,
    where("teacherGroupIDs", "array-contains", teacherGroupId)
  );
  const studentGroupSnapshot = await getDocs(studentGroupQuery);

  const promises = studentGroupSnapshot.docs.map(async (studentGroupDoc) => {
    if (studentGroupDoc.exists()) container.push(studentGroupDoc.id);
  });

  await Promise.all(promises);
}

async function fetchStudentGroupIdsFromCollection(container: string[]) {
  const snapshot = await getDocs(STUDENT_GROUP_COLLECTION);

  snapshot.forEach(async (doc) => {
    if (doc.exists()) container.push(doc.id);
  });
}

async function fetchStudentGroupListFromIds(
  studentGroupIds: string[],
  container: IStudentGroup[]
) {
  const studentGroupListPromises = studentGroupIds.map(
    async (studentGroupId) => {
      const studentGroupDoc = doc(
        fbStore,
        COLLECTIONS.studentGroup,
        studentGroupId
      );
      const studentGroupObj = await getDoc(studentGroupDoc);

      if (studentGroupObj.exists())
        container.push(studentGroupObj.data() as IStudentGroup);
    }
  );

  await Promise.all(studentGroupListPromises);
}
