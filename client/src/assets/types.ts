import type { Dispatch, SetStateAction } from "react";

export interface TUser {
  _id: string;
  email: string;
  name: string;
  displayName: string;
}

export interface TUserContext {
  user: TUser;
  setUser: Dispatch<SetStateAction<TUser>>;
}
