import { createContext, useReducer } from "react";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { authInstance } = useContext(AuthContext);
  const INITIAL_STATE = {
    user: {},
    chatId: "null",
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            authInstance.currentUser.uid > action.payload.uid
              ? authInstance.currentUser.uid + action.payload.uid
              : action.payload.uid + authInstance.currentUser.uid,
        };
      default:
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ chatData: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
