import { useCallback, useEffect, useState } from "react";
import { IUser } from "../api/models";
import { STUDENT_COLLECTION } from "../api/collections";
import { getDocs } from "firebase/firestore";
import { PAGE_PER } from "../constants/Students";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  filterPropsState,
  isRefetchStudentListState,
} from "../stores/students";
import { FilterSearchType } from "../types/Students";

export default function useStudentList() {
  // states
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<IUser[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<IUser[]>([]);
  const [error, setError] = useState<unknown>();
  const [lastPage, setLastPage] = useState(1);

  // recoil
  const filterOptions = useRecoilValue(filterPropsState);
  const [isRefetch, setIsRefetch] = useRecoilState(isRefetchStudentListState);

  const fetchStudentList = useCallback(async () => {
    setIsLoading(true);
    try {
      const snapshot = await getDocs(STUDENT_COLLECTION);

      if (!snapshot.empty) {
        const container: IUser[] = [];

        snapshot.forEach(async (doc) => {
          container.push(doc.data() as IUser);
        });

        setStudents(container);
        setFilteredStudents(container);
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
    setStudents,
    setFilteredStudents,
    setLastPage,
    setError,
    setIsRefetch,
  ]);

  // effects
  useEffect(() => {
    fetchStudentList();
  }, [fetchStudentList]);

  useEffect(() => {
    if (isRefetch) fetchStudentList();
  }, [isRefetch, fetchStudentList]);

  useEffect(() => {
    if (students.length > 0 && filterOptions) {
      const { group, searchQuery, searchType } = filterOptions;
      let filteredStudents = students;

      if (group)
        filteredStudents = filteredStudents.filter((student) =>
          group.studentIDs.includes(student.id)
        );

      if (searchQuery) {
        filteredStudents = filteredStudents.filter((student) =>
          filterStudentByQuery({ student, searchQuery, searchType })
        );
      }

      setFilteredStudents(filteredStudents);
    } else if (!filterOptions) {
      setFilteredStudents(students);
    }
  }, [filterOptions, students]);

  return {
    isLoading,
    students: filteredStudents,
    error,
    lastPage,
    refetch: fetchStudentList,
  };
}

function filterStudentByQuery({
  searchQuery,
  searchType,
  student,
}: {
  student: IUser;
  searchQuery: string;
  searchType: FilterSearchType;
}) {
  const querySlugs = searchQuery.split("");
  switch (searchType) {
    case "ID": {
      const nameSlugs = student.name.split("");
      const emailSlugs = student.accountId.split("");

      const isNameValidate = querySlugs.every((querySlug) =>
        nameSlugs.includes(querySlug)
      );
      const isEmailValidate = querySlugs.every((querySlug) =>
        emailSlugs.includes(querySlug)
      );

      return isNameValidate || isEmailValidate;
    }
    case "PHONE": {
      const phoneSlugs = student.phoneNumber.split("");

      return querySlugs.every((querySlug) => phoneSlugs.includes(querySlug));
    }
    default:
      return false;
  }
}
