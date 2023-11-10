import { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

export const ConversationsList = () => {
  const [conversationsList, setConversationsList] = useState([]);

  const { dbInstance, authInstance } = useContext(AuthContext);
  const { chatData, dispatch } = useContext(ChatContext);

  const handleClick = async (userData) => {
    dispatch({ type: "CHANGE_USER", payload: userData });
  };

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
                    return b.lastMessage.date - a.lastMessage.date;
                  })
              );
            }
          }
        }
      );
      console.log("number 1");
      return () => {
        unsub();
      };
      // }
    }
  }, [authInstance.currentUser, dbInstance, chatData.chatId]);

  // const sortedMessages = conversationsList.sort((a, b) => {
  //   return b.lastMessage.date - a.lastMessage.date;
  // });

  console.log(conversationsList);

  return conversationsList.map((conversation, index) => (
    <div
      onClick={() => handleClick(conversation.userInfo)}
      className="bg-[#d6eadf] cursor-pointer text-black hover:bg-[#b8e0d2] hover:text-black active:bg-[#63BB9C] active:text-black active:border-white w-11/12 m-auto py-6 rounded-lg  justify-center"
      key={index}
    >
      <div className="flex flex-col">
        <p>{conversation.userInfo.displayName}</p>
        <p className="text-sm text-gray-500">
          {conversation.lastMessage && conversation.lastMessage.newMessage}
        </p>
      </div>
    </div>
  ));
};
