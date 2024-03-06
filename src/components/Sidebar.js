import {
  query,
  collection,
  where,
  getDocs,
  setDoc,
  doc,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useContext, useState } from "react";

import { AuthContext } from "../context/AuthContext";
import { ConversationsList } from "./ConversationsList";
import loading from "../items/loading1.gif";

export const Sidebar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);

  const { authInstance, dbInstance } = useContext(AuthContext);

  const searchUser = async () => {
    setIsLoading(true);

    const q = query(
      collection(dbInstance, "users"),
      where("email", "==", searchValue)
    );

    try {
      const { docs } = await getDocs(q);

      if (docs.length) {
        setSearchedUser(docs[0].data());
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createChat = async () => {
    const chatId =
      authInstance.currentUser.uid > searchedUser.uid
        ? authInstance.currentUser.uid + searchedUser.uid
        : searchedUser.uid + authInstance.currentUser.uid;

    try {
      const { _document } = await getDoc(doc(dbInstance, "chats", chatId));

      if (!_document) {
        await setDoc(doc(dbInstance, "chats", chatId), { messages: [] });

        await setDoc(
          doc(dbInstance, "userChats", authInstance.currentUser.uid),
          {
            [chatId]: {
              uid: searchedUser.uid,
              displayName: searchedUser.displayName,
              date: serverTimestamp(),
            },
          }
        );
        await setDoc(doc(dbInstance, "userChats", searchedUser.uid), {
          [chatId]: {
            uid: authInstance.currentUser.uid,
            displayName: authInstance.currentUser.displayName,
            date: serverTimestamp(),
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelect = () => {
    createChat();

    setSearchedUser(null);
    setSearchValue("");
  };

  return (
    <div className="bg-[#d6eadf] border border-[#95b8d1] rounded-lg shadow-lg h-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          searchUser();
        }}
        className="w-11/12 m-2s justify-center"
      >
        <input
          className="border border-[#95b8d1] w-full rounded-lg bg m-4 p-3"
          placeholder="search"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />
      </form>
      {isLoading && (
        <div className="justify-center flex">
          <img className="h-20" src={loading} alt="loading gif" />
        </div>
      )}
      {searchedUser && (
        <div
          onClick={handleSelect}
          className="bg-[#d6eadf] cursor-pointer border border-[#95b8d1] text-black hover:bg-[#b8e0d2] hover:text-black active:bg-[#63BB9C] active:text-black active:border-white w-11/12 m-4 p-6 rounded-lg  justify-center"
        >
          {searchedUser.displayName}
        </div>
      )}
      <div className="mx-2 my-2 border border-black" />
      <div className="text-center w-full">Chats</div>
      <ConversationsList searchedUser={searchedUser} />
    </div>
  );
};
