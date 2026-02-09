import { type TUserContext } from "@/assets/types";
import { createContext } from "react";

export const AuthContext = createContext<TUserContext>({
  user: {
    _id: "",
    name: "",
    email: "",
    displayName: "",
  },
  setUser: () => {},
});
