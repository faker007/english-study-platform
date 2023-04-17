import { useRecoilValue } from "recoil";
import { userLoadingState, userState } from "../stores/user";

function useUser() {
  const user = useRecoilValue(userState);
  const isLoading = useRecoilValue(userLoadingState);

  return { user, isLoading };
}

export default useUser;
