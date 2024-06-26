import { useState, useRef, useEffect, useContext } from "react";
import {
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  arrayUnion,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { v4 } from "uuid";

import sendIcon from "../items/112 (1).png";
import Message from "./Message";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

export const ChatBox = () => {
  const [newMessage, setnewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const scroll = useRef();

  const { authInstance, dbInstance } = useContext(AuthContext);
  const { chatData } = useContext(ChatContext);

  const sendMessage = async () => {
    const { uid, displayName } = authInstance.currentUser;
    const { uid: receiverId, displayName: receiverName } = chatData.user;
    const chatDocument = await getDoc(
      doc(dbInstance, "chats", chatData.chatId)
    );

    if (!chatDocument.exists()) {
      await setDoc(doc(dbInstance, "chats", chatData.chatId), {});
    }
    await updateDoc(doc(dbInstance, "chats", chatData.chatId), {
      messages: arrayUnion({
        text: newMessage,
        createdAt: Timestamp.now(),
        name: displayName,
        id: v4(),
        uid,
      }),
    });

    await updateDoc(doc(dbInstance, "userChats", uid), {
      [chatData.chatId + ".lastMessage"]: {
        newMessage,
        sender: displayName,
        date: serverTimestamp(),
      },
    });

    await updateDoc(doc(dbInstance, "userChats", receiverId), {
      [chatData.chatId + ".lastMessage"]: {
        newMessage,
        sender: displayName,
        date: serverTimestamp(),
      },
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newMessage.trim() === "") return;

    sendMessage();
    setnewMessage("");
  };

  console.log(chatData.chatId);

  useEffect(() => {
    const unsubcribe = onSnapshot(
      doc(dbInstance, "chats", chatData.chatId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setMessages(docSnapshot.data().messages);
        } else {
          console.log("document does not exist");
        }
      }
    );

    return () => unsubcribe();
  }, [chatData.chatId, messages?.length]);

  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollTop = scroll.current.scrollHeight;
    }
  }, [chatData.chatId, messages?.length]);

  return (
    <div className="bg-white shadow-lg rounded-lg border border-[#95b8d1] h-full overflow-hidden">
      <nav className="bg-[#b8e0d2] h-16 h-20">
        <div className="hidden md:flex h-full justify-center space-x-4">
          <div className="flex justify-center items-center text-black">
            {chatData?.user.displayName}
          </div>
        </div>
      </nav>
      <div
        ref={scroll}
        className="overflow-y-auto space-y-2 p-4"
        style={{ height: "calc(100% - 9rem)" }}
      >
        {messages?.map((message) => (
          <Message key={Math.random() * 100} message={message} />
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex mt-2 p-2">
        <input
          className="flex-grow border rounded-lg p-2 mr-2"
          value={newMessage}
          onChange={(e) => {
            setnewMessage(e.target.value);
          }}
        />
        <button className="border rounded-lg">
          <img src={sendIcon} className="h-8 w-12" alt="send icon"></img>
        </button>
      </form>
    </div>
  );
};
