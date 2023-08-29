import { createContext } from "react";

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  loading: false,
  setLoading: () => {},
  authInstance: null,
  dbInstance: null,
  emailSignIn: () => {},
  googleSignIn: () => {},
  input: false,
  setInput: () => {},
});
