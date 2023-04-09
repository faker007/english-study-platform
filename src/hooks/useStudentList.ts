import { useEffect, useState } from "react";
import { IUser, UserRole } from "../api/models";
import { USER_COLLECTION } from "../api/collections";
import { getDocs, query, where } from "firebase/firestore";
import { PAGE_PER } from "../constants/Students";

export default function useStudentList() {
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<IUser[]>([]);
  const [error, setError] = useState<unknown>();
  const [lastPage, setLastPage] = useState(1);

  async function fetchStudentList() {
    setIsLoading(true);
    try {
      const q = query(USER_COLLECTION, where("role", "==", UserRole.STUDENT));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const container: IUser[] = [];

        querySnapshot.forEach((doc) => {
          container.push(doc.data() as IUser);
        });
        setStudents(container);
        setLastPage(Math.ceil(container.length / PAGE_PER));
      }
    } catch (error) {
      console.error(error);
      setError(error);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchStudentList();
  }, []);

  return {
    isLoading,
    students,
    error,
    lastPage,
  };
}
