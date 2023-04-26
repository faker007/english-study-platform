import { useCallback, useEffect, useState } from "react";
import { ITeacher } from "../api/models";
import { MIN_PAGE, PAGE_PER } from "../constants/Students";
import { useRecoilState } from "recoil";
import { isRefetchTeacherListState } from "../stores/teachers";
import { TEACHER_COLLECTION } from "../api/collections";
import { getDocs } from "firebase/firestore";
import { ITeacherListFilter } from "../types/Teachers";

export default function useTeacherList(filter: ITeacherListFilter) {
  const [isLoading, setIsLoading] = useState(false);
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<ITeacher[]>([]);
  const [error, setError] = useState<unknown>();
  const [lastPage, setLastPage] = useState(MIN_PAGE);

  // recoil
  // const filterOptions = useRecoilValue(filterPropsState);
  const [isRefetch, setIsRefetch] = useRecoilState(isRefetchTeacherListState);

  const fetchTeacherList = useCallback(async () => {
    setIsLoading(true);
    try {
      const snapshot = await getDocs(TEACHER_COLLECTION);

      if (!snapshot.empty) {
        const container: ITeacher[] = [];

        snapshot.forEach(async (doc) => {
          container.push(doc.data() as ITeacher);
        });

        setTeachers(container);
        setFilteredTeachers(container);
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
    setTeachers,
    setFilteredTeachers,
    setLastPage,
    setError,
    setIsRefetch,
  ]);

  // effects
  useEffect(() => {
    fetchTeacherList();
  }, [fetchTeacherList]);

  useEffect(() => {
    if (isRefetch) fetchTeacherList();
  }, [isRefetch, fetchTeacherList]);

  useEffect(() => {
    if (teachers.length > 0 && filter) {
      let container = teachers;
      const { group, searchQuery } = filter;

      if (group)
        container = container.filter((teacher) =>
          group.teacherIDs.includes(teacher.id)
        );

      if (searchQuery) {
        const querySlugs = searchQuery.split("");
        container = container.filter((teacher) =>
          querySlugs.every((querySlug) => teacher.name.includes(querySlug))
        );
      }

      setFilteredTeachers(container);
      setLastPage(Math.ceil(container.length / PAGE_PER));
    }
  }, [filter, teachers]);

  return {
    isLoading,
    teachers: filteredTeachers,
    error,
    lastPage,
    refetch: fetchTeacherList,
  };
}
