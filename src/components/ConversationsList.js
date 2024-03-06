import { useContext, useEffect, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

export const ConversationsList = ({ searchedUser }) => {
  const [conversationsList, setConversationsList] = useState([]);

  const { dbInstance, authInstance } = useContext(AuthContext);
  const { chatData, dispatch } = useContext(ChatContext);

  const handleClick = async (userData) => {
    dispatch({ type: "CHANGE_USER", payload: userData });
    console.log(userData);
  };

  console.log(chatData.user.displayName);

  useEffect(() => {
    if (authInstance.currentUser) {
      const unsub = onSnapshot(
        doc(dbInstance, "userChats", authInstance.currentUser.uid),
        (doc) => {
          if (doc.exists()) {
            const data = doc.data();

            if (data) {
              setConversationsList(
                Object.keys(data)
                  ?.map((chatId) => {
                    return data[chatId];
                  })
                  .sort((a, b) => {
                    return b.lastMessage?.date - a.lastMessage?.date;
                  })
              );
            }
          }
        }
      );

      return () => {
        unsub();
      };
    }
  }, [authInstance.currentUser, dbInstance, chatData.chatId]);

  const result = conversationsList.map((conversation) => conversation);

  console.log(result);

  return conversationsList.map((conversation, index) => (
    <div
      onClick={() => handleClick(conversation)}
      className="bg-[#d6eadf] cursor-pointer text-black hover:bg-[#b8e0d2] hover:text-black active:bg-[#63BB9C] active:text-black active:border-white w-11/12 m-auto py-6 rounded-lg  justify-center"
      key={index}
    >
      <div className="flex flex-col">
        <p>{conversation.displayName}</p>
        <p className="text-sm text-gray-500">
          {conversation.lastMessage && conversation.lastMessage.newMessage}
        </p>
      </div>
    </div>
  ));
};
