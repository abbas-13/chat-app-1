import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Message = ({ message }) => {
  const { authInstance } = useContext(AuthContext);

  return (
    <div className="flex justify-start mb-2">
      {authInstance.currentUser &&
        message.uid !== authInstance.currentUser.uid && (
          <div className="p-3 max-w-lg rounded-lg bg-gray-200 text-black">
            <p className="text-xs">{message.name}</p>
            <p>{message.text}</p>
          </div>
        )}

      {authInstance.currentUser &&
        message.uid === authInstance?.currentUser.uid && (
          <div className="p-3 max-w-lg rounded-lg bg-blue-400 text-white ml-auto">
            <p>{message.text}</p>
          </div>
        )}
    </div>
  );
};
export default Message;
