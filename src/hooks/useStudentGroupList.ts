import { useCallback, useEffect, useState } from "react";
import { IStudentGroup } from "../api/models";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isRefetchStudentGroupListState,
  studentGroupSearchQueryState,
} from "../stores/students";
import { STUDENT_GROUP_COLLECTION } from "../api/collections";
import { getDocs, query } from "firebase/firestore";
import { PAGE_PER } from "../constants/Students";

export default function useStudentGroupList() {
  // states
  const [isLoading, setIsLoading] = useState(false);
  const [groups, setGroups] = useState<IStudentGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<IStudentGroup[]>([]);
  const [error, setError] = useState<unknown>();
  const [lastPage, setLastPage] = useState(1);

  // recoil
  const searchQuery = useRecoilValue(studentGroupSearchQueryState);
  const [isRefetch, setIsRefetch] = useRecoilState(
    isRefetchStudentGroupListState
  );

  const fetchStudentGroups = useCallback(async () => {
    setIsLoading(true);

    try {
      let container: IStudentGroup[] = [];
      const q = query(STUDENT_GROUP_COLLECTION);
      const snapshot = await getDocs(q);

      snapshot.forEach((doc) => container.push(doc.data() as IStudentGroup));
      setGroups(container);
      setFilteredGroups(container);
      setLastPage(Math.ceil(container.length / PAGE_PER));
      setIsRefetch(false);
    } catch (error) {
      console.error(error);
      setError(error);
    }

    setIsLoading(false);
  }, [setIsLoading, setGroups, setFilteredGroups, setLastPage, setIsRefetch]);

  useEffect(() => {
    const querySlugs = searchQuery.split("");

    const filteredGroups = groups.filter((group) => {
      return querySlugs.every((querySlug) => group.name.includes(querySlug));
    });

    setFilteredGroups(filteredGroups);
  }, [searchQuery, groups]);

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
