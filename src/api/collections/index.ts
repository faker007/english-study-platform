import { collection } from "firebase/firestore";
import { fbStore } from "../../firebase";
import { COLLECTIONS } from "../constants";

export const USER_COLLECTION = collection(fbStore, COLLECTIONS.USER);
