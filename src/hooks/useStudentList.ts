import { useCallback, useEffect, useState } from "react";
import { IUser, IStudentGroup, IStudent } from "../api/models";
import {
  STUDENT_COLLECTION,
  STUDENT_GROUP_COLLECTION,
} from "../api/collections";
import { doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { MIN_PAGE, PAGE_PER } from "../constants/Students";
import { useRecoilState } from "recoil";
import { isRefetchStudentListState } from "../stores/students";
import { FilterSearchType, IFilterProps } from "../types/Students";
import useUser from "./useUser";
import { fbStore } from "../firebase";
import { COLLECTIONS } from "../api/constants";
import { isAdmin } from "../api/utils/teacher";

function useStudentList(filterOptions: IFilterProps) {
  // states
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<IUser[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<IUser[]>([]);
  const [error, setError] = useState<unknown>();
  const [lastPage, setLastPage] = useState(1);

  // recoil
  const [isRefetch, setIsRefetch] = useRecoilState(isRefetchStudentListState);
  const { user } = useUser();

  const fetchStudentList = useCallback(async () => {
    let studentIds: string[] = [];
    const container: IStudent[] = [];
    setIsLoading(true);

    try {
      if (user) {
        const teacherGroupId = user.groupIDs[0] ?? "";

        if (teacherGroupId) {
          await fetchStudentIdsFromGroup(teacherGroupId, studentIds);
        }

        if (isAdmin(user)) {
          await fetchStudentIdsFromCollection(studentIds);
        }
      }

      // 중복 제거
      studentIds = Array.from(new Set(studentIds));

      // studentList 채우기
      await fetchStudentListFromIds(studentIds, container);
    } catch (error) {
      console.error(error);
      setError(error);
    }

    setStudents(container);
    setFilteredStudents(container);
    setLastPage(Math.max(Math.ceil(container.length / PAGE_PER), MIN_PAGE));
    setIsRefetch(false);

    setIsLoading(false);
  }, [
    setIsLoading,
    setStudents,
    setFilteredStudents,
    setLastPage,
    setError,
    setIsRefetch,
    user,
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
      setLastPage(Math.ceil(filteredStudents.length / PAGE_PER));
    } else if (!filterOptions) {
      setFilteredStudents(students);
      setLastPage(Math.ceil(students.length / PAGE_PER));
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

export default useStudentList;

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
    case "NONE":
      return true;
    default:
      return false;
  }
}

async function fetchStudentListFromIds(
  studentIds: string[],
  container: IStudent[]
) {
  const studentListPromises = studentIds.map(async (studentId) => {
    const studentDoc = doc(fbStore, COLLECTIONS.student, studentId);
    const studentObj = await getDoc(studentDoc);

    if (studentObj.exists()) container.push(studentObj.data() as IStudent);
  });

  await Promise.all(studentListPromises);
}

async function fetchStudentIdsFromGroup(
  teacherGroupId: string,
  container: string[]
) {
  const studentGroupQuery = query(
    STUDENT_GROUP_COLLECTION,
    where("teacherGroupIDs", "array-contains", teacherGroupId)
  );
  const studentGroupSnapshot = await getDocs(studentGroupQuery);

  const promises = studentGroupSnapshot.docs.map(async (studentGroupDoc) => {
    if (studentGroupDoc.exists()) {
      const { studentIDs } = studentGroupDoc.data() as IStudentGroup;
      container.push(...studentIDs);
    }
  });

  await Promise.all(promises);
}

async function fetchStudentIdsFromCollection(container: string[]) {
  const snapshot = await getDocs(STUDENT_COLLECTION);

  snapshot.forEach(async (doc) => {
    if (doc.exists()) container.push(doc.id);
  });
}
