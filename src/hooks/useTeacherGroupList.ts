import { useCallback, useEffect, useState } from "react";
import { ITeacherGroup } from "../api/models";
import { useRecoilState } from "recoil";
import { MIN_PAGE, PAGE_PER } from "../constants/Students";
import { isRefetchTeacherGroupListState } from "../stores/teachers";
import { getDocs } from "firebase/firestore";
import { TEACHER_GROUP_COLLECTION } from "../api/collections";
import { ITeacherGroupListFilter } from "../types/Teachers";

export default function useTeacherGroupList(filter: ITeacherGroupListFilter) {
  const [isLoading, setIsLoading] = useState(false);
  const [teacherGroups, setTeacherGroups] = useState<ITeacherGroup[]>([]);
  const [filteredTeacherGroups, setFilteredTeacherGroups] = useState<
    ITeacherGroup[]
  >([]);
  const [error, setError] = useState<unknown>();
  const [lastPage, setLastPage] = useState(MIN_PAGE);

  // recoil
  // const filterOptions = useRecoilValue(filterPropsState);
  const [isRefetch, setIsRefetch] = useRecoilState(
    isRefetchTeacherGroupListState
  );

  const fetchTeacherGroupList = useCallback(async () => {
    setIsLoading(true);
    try {
      const snapshot = await getDocs(TEACHER_GROUP_COLLECTION);

      if (!snapshot.empty) {
        const container: ITeacherGroup[] = [];

        snapshot.forEach(async (doc) => {
          container.push(doc.data() as ITeacherGroup);
        });

        setTeacherGroups(container);
        setFilteredTeacherGroups(container);
        setLastPage(Math.ceil(container.length / PAGE_PER));
        setIsRefetch(false);
      }
    } catch (error) {
      console.error(error);
      setError(error);
    }
    setIsLoading(false);
  }, [
    setIsLoading,
    setTeacherGroups,
    setFilteredTeacherGroups,
    setLastPage,
    setError,
    setIsRefetch,
  ]);

  // effects
  useEffect(() => {
    fetchTeacherGroupList();
  }, [fetchTeacherGroupList]);

  useEffect(() => {
    if (isRefetch) fetchTeacherGroupList();
  }, [isRefetch, fetchTeacherGroupList]);

  useEffect(() => {
    if (teacherGroups.length > 0 && filter) {
      let container = teacherGroups;
      const { searchQuery } = filter;

      if (searchQuery) {
        const querySlugs = searchQuery.split("");
        container = container.filter((teacherGroup) =>
          querySlugs.every((querySlug) => teacherGroup.name.includes(querySlug))
        );
      }

      setFilteredTeacherGroups(container);
      setLastPage(Math.ceil(container.length / PAGE_PER));
    }
  }, [filter, teacherGroups]);

  return {
    isLoading,
    teacherGroups: filteredTeacherGroups,
    error,
    lastPage,
    refetch: fetchTeacherGroupList,
  };
}
